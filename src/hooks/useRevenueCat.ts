/**
 * RevenueCat Hook
 * React hook for managing RevenueCat purchases in the app
 */

import { useState, useEffect, useCallback } from 'react';
import { PurchasesOfferings, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { revenueCatService, SubscriptionTier } from '@/services/revenueCatService';
import { useAuth } from '@/hooks/useAuth';
import { isNativeApp } from '@/lib/platformDetection';
import { toast } from 'sonner';

interface UseRevenueCatResult {
  isAvailable: boolean;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  currentTier: SubscriptionTier;
  isSubscribed: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

export function useRevenueCat(): UseRevenueCatResult {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('FREE');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize RevenueCat when user changes
  useEffect(() => {
    const init = async () => {
      if (!isNativeApp()) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const initialized = await revenueCatService.initialize(user?.id);
        setIsAvailable(initialized);

        if (initialized) {
          // If user is logged in, identify them
          if (user?.id) {
            await revenueCatService.login(user.id);
          }

          // Load offerings
          const fetchedOfferings = await revenueCatService.getOfferings();
          setOfferings(fetchedOfferings);

          // Check subscription status
          const status = await revenueCatService.checkSubscription();
          setCurrentTier(status.tier);
          setIsSubscribed(status.isActive);
        }
      } catch (error) {
        console.error('[useRevenueCat] Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [user?.id]);

  // Handle user logout
  useEffect(() => {
    if (!user && isAvailable) {
      revenueCatService.logout();
      setCurrentTier('FREE');
      setIsSubscribed(false);
    }
  }, [user, isAvailable]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (!isAvailable) {
      toast.error('Las compras no están disponibles');
      return false;
    }

    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.purchasePackage(pkg);
      
      if (customerInfo) {
        const status = await revenueCatService.checkSubscription();
        setCurrentTier(status.tier);
        setIsSubscribed(status.isActive);
        toast.success(`¡Bienvenida al plan ${status.tier}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.code !== 'PURCHASE_CANCELLED') {
        toast.error('Error al procesar la compra');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const restore = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) {
      toast.error('Las compras no están disponibles');
      return false;
    }

    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.restorePurchases();
      
      if (customerInfo) {
        const status = await revenueCatService.checkSubscription();
        setCurrentTier(status.tier);
        setIsSubscribed(status.isActive);
        
        if (status.isActive) {
          toast.success('Compras restauradas correctamente');
        } else {
          toast.info('No se encontraron compras previas');
        }
        return status.isActive;
      }
      return false;
    } catch (error) {
      toast.error('Error al restaurar compras');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!isAvailable) return;

    try {
      const status = await revenueCatService.checkSubscription();
      setCurrentTier(status.tier);
      setIsSubscribed(status.isActive);
    } catch (error) {
      console.error('[useRevenueCat] Error refreshing status:', error);
    }
  }, [isAvailable]);

  return {
    isAvailable,
    isLoading,
    offerings,
    currentTier,
    isSubscribed,
    purchase,
    restore,
    refreshStatus
  };
}

export default useRevenueCat;
