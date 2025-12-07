import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.veronica.NutreTuBienestar',
  appName: 'Nutre tu Bienestar',
  webDir: 'dist',
  //server: {
    // For development: connect to live preview
    // Comment out for production builds
    //url: 'https://6283360e-6121-47a3-8844-5b3a7700e234.lovableproject.com?forceHideBadge=true',
    //cleartext: true
  //},
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#C4A86B',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#C4A86B'
    }
  }
};

export default config;
