/**
 * RevenueCat Service
 * Handles in-app purchases for iOS and Android
 */

import { Purchases, PurchasesOfferings, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { isNativeApp, detectPlatform } from '@/lib/platformDetection';
import { supabase } from '@/integrations/supabase/client';

// RevenueCat API keys (from environment or hardcoded for native builds)
const REVENUECAT_KEY_ANDROID = import.meta.env.VITE_REVENUECAT_KEY_ANDROID || '';
const REVENUECAT_KEY_IOS = import.meta.env.VITE_REVENUECAT_KEY_IOS || '';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM';

interface RevenueCatSubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expirationDate?: string;
  willRenew: boolean;
}

class RevenueCatService {
  private initialized = false;

  /**
   * Initialize RevenueCat with the appropriate API key
   */
  async initialize(userId?: string): Promise<boolean> {
    if (!isNativeApp()) {
      console.log('[RevenueCat] Not a native app, skipping initialization');
      return false;
    }

    if (this.initialized) {
      console.log('[RevenueCat] Already initialized');
      return true;
    }

    try {
      const platform = detectPlatform();
      const apiKey = platform === 'ios' ? REVENUECAT_KEY_IOS : REVENUECAT_KEY_ANDROID;

      if (!apiKey) {
        console.error(`[RevenueCat] No API key configured for ${platform}`);
        return false;
      }

      await Purchases.configure({ 
        apiKey,
        appUserID: userId || undefined
      });

      this.initialized = true;
      console.log(`[RevenueCat] Initialized for ${platform}`);

      // Sync with backend if we have a user ID
      if (userId) {
        await this.syncWithBackend(userId);
      }

      return true;
    } catch (error) {
      console.error('[RevenueCat] Initialization error:', error);
      return false;
    }
  }

  /**
   * Login/identify user with RevenueCat
   */
  async login(userId: string): Promise<void> {
    if (!isNativeApp() || !this.initialized) return;

    try {
      await Purchases.logIn({ appUserID: userId });
      await this.syncWithBackend(userId);
      console.log(`[RevenueCat] User logged in: ${userId}`);
    } catch (error) {
      console.error('[RevenueCat] Login error:', error);
    }
  }

  /**
   * Logout user from RevenueCat
   */
  async logout(): Promise<void> {
    if (!isNativeApp() || !this.initialized) return;

    try {
      await Purchases.logOut();
      console.log('[RevenueCat] User logged out');
    } catch (error) {
      console.error('[RevenueCat] Logout error:', error);
    }
  }

  /**
   * Get available offerings/packages
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!isNativeApp() || !this.initialized) return null;

    try {
      const offerings = await Purchases.getOfferings();
      console.log('[RevenueCat] Offerings:', offerings);
      return offerings;
    } catch (error) {
      console.error('[RevenueCat] Error getting offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
    if (!isNativeApp() || !this.initialized) return null;

    try {
      const result = await Purchases.purchasePackage({ aPackage: pkg });
      console.log('[RevenueCat] Purchase successful:', result);
      return result.customerInfo;
    } catch (error: any) {
      if (error.code === 'PURCHASE_CANCELLED') {
        console.log('[RevenueCat] Purchase cancelled by user');
      } else {
        console.error('[RevenueCat] Purchase error:', error);
      }
      throw error;
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<CustomerInfo | null> {
    if (!isNativeApp() || !this.initialized) return null;

    try {
      const result = await Purchases.restorePurchases();
      console.log('[RevenueCat] Purchases restored:', result);
      return result.customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Restore error:', error);
      return null;
    }
  }

  /**
   * Get current customer info
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!isNativeApp() || !this.initialized) return null;

    try {
      const result = await Purchases.getCustomerInfo();
      return result.customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Error getting customer info:', error);
      return null;
    }
  }

  /**
   * Check subscription status from RevenueCat
   */
  async checkSubscription(): Promise<RevenueCatSubscriptionStatus> {
    const defaultStatus: RevenueCatSubscriptionStatus = {
      tier: 'FREE',
      isActive: false,
      willRenew: false
    };

    if (!isNativeApp() || !this.initialized) return defaultStatus;

    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return defaultStatus;

      // Check entitlements
      const entitlements = customerInfo.entitlements.active;
      
      if (entitlements['premium'] || entitlements['PREMIUM']) {
        return {
          tier: 'PREMIUM',
          isActive: true,
          expirationDate: customerInfo.latestExpirationDate || undefined,
          willRenew: !customerInfo.managementURL // If no management URL, likely will renew
        };
      }

      if (entitlements['basic'] || entitlements['BASIC']) {
        return {
          tier: 'BASIC',
          isActive: true,
          expirationDate: customerInfo.latestExpirationDate || undefined,
          willRenew: !customerInfo.managementURL
        };
      }

      return defaultStatus;
    } catch (error) {
      console.error('[RevenueCat] Error checking subscription:', error);
      return defaultStatus;
    }
  }

  /**
   * Sync RevenueCat user ID with backend
   */
  private async syncWithBackend(userId: string): Promise<void> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return;

      // Get the RevenueCat app user ID
      const revenuecatUserId = customerInfo.originalAppUserId;

      // Sync with backend
      await supabase.functions.invoke('sync-revenuecat', {
        body: { revenuecatUserId }
      });

      console.log(`[RevenueCat] Synced user ${userId} with RC ID ${revenuecatUserId}`);
    } catch (error) {
      console.error('[RevenueCat] Error syncing with backend:', error);
    }
  }

  /**
   * Check if RevenueCat is available
   */
  isAvailable(): boolean {
    return isNativeApp() && this.initialized;
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
