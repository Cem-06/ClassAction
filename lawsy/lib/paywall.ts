import { Platform } from 'react-native';
import type { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

type ConfigureResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
    };

export type TrialStartResult =
  | { status: 'success' }
  | { status: 'cancelled' }
  | { status: 'not_configured'; message: string }
  | { status: 'no_offering'; message: string }
  | { status: 'error'; message: string };

export type PaywallPlanPreference = 'annual' | 'monthly';

let hasConfiguredPurchases = false;
let purchasesModulePromise: Promise<typeof import('react-native-purchases')> | null = null;

async function getPurchasesModule(): Promise<typeof import('react-native-purchases') | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  if (!purchasesModulePromise) {
    purchasesModulePromise = import('react-native-purchases');
  }

  return purchasesModulePromise;
}

function getRevenueCatApiKey(): string | null {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? null;
  }

  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? null;
  }

  return null;
}

async function ensurePurchasesConfigured(): Promise<ConfigureResult> {
  if (hasConfiguredPurchases) {
    return { ok: true };
  }

  const purchasesModule = await getPurchasesModule();

  if (!purchasesModule) {
    return {
      ok: false,
      message: 'RevenueCat is available on native platforms only.',
    };
  }

  const Purchases = purchasesModule.default;
  const apiKey = getRevenueCatApiKey();

  if (!apiKey) {
    return {
      ok: false,
      message:
        'RevenueCat key is missing. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS and EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID.',
    };
  }

  Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO);
  Purchases.configure({ apiKey });
  hasConfiguredPurchases = true;

  return { ok: true };
}

function getPreferredPackage(
  offerings: PurchasesOfferings,
  planPreference: PaywallPlanPreference
): PurchasesPackage | null {
  const packages = offerings.current?.availablePackages ?? [];

  if (!packages.length) {
    return null;
  }

  if (planPreference === 'monthly') {
    return (
      packages.find((item) => item.packageType === 'MONTHLY') ??
      packages.find((item) => item.packageType === 'ANNUAL') ??
      packages[0]
    );
  }

  return (
    packages.find((item) => item.packageType === 'ANNUAL') ??
    packages.find((item) => item.packageType === 'MONTHLY') ??
    packages[0]
  );
}

export async function startFreeTrialPurchase(
  planPreference: PaywallPlanPreference = 'annual'
): Promise<TrialStartResult> {
  const configureResult = await ensurePurchasesConfigured();

  if (!configureResult.ok) {
    return {
      status: 'not_configured',
      message: configureResult.message,
    };
  }

  try {
    const purchasesModule = await getPurchasesModule();

    if (!purchasesModule) {
      return {
        status: 'not_configured',
        message: 'RevenueCat is available on native platforms only.',
      };
    }

    const Purchases = purchasesModule.default;
    const offerings = await Purchases.getOfferings();
    const selectedPackage = getPreferredPackage(offerings, planPreference);

    if (!selectedPackage) {
      return {
        status: 'no_offering',
        message: 'No active packages found in RevenueCat offerings.',
      };
    }

    await Purchases.purchasePackage(selectedPackage);
    return { status: 'success' };
  } catch (error) {
    const purchaseError = error as { userCancelled?: boolean; message?: string };

    if (purchaseError?.userCancelled) {
      return { status: 'cancelled' };
    }

    return {
      status: 'error',
      message: purchaseError?.message ?? 'Could not start free trial.',
    };
  }
}

export async function syncPaywallUser(appUserId: string): Promise<void> {
  const configureResult = await ensurePurchasesConfigured();

  if (!configureResult.ok) {
    return;
  }

  const purchasesModule = await getPurchasesModule();

  if (!purchasesModule) {
    return;
  }

  try {
    await purchasesModule.default.logIn(appUserId);
  } catch {
    // Ignore paywall identity sync failures so auth is never blocked.
  }
}

export async function clearPaywallUser(): Promise<void> {
  const configureResult = await ensurePurchasesConfigured();

  if (!configureResult.ok) {
    return;
  }

  const purchasesModule = await getPurchasesModule();

  if (!purchasesModule) {
    return;
  }

  try {
    await purchasesModule.default.logOut();
  } catch {
    // Ignore paywall logout failures so sign-out is never blocked.
  }
}
