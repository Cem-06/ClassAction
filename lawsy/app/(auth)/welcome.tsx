import { Link, useRouter } from 'expo-router';
import {
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Clock3,
  Crown,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { Features } from '../../constants/features';
import { createFunnelSessionId, trackOnboardingEvent } from '../../lib/onboarding-analytics';
import { startFreeTrialPurchase } from '../../lib/paywall';
import { useAuthStore } from '../../stores/auth-store';
import { useOnboardingStore } from '../../stores/onboarding-store';
import type { OnboardingEventName, OnboardingEventPayload, OnboardingStepKey } from '../../types/onboarding-analytics';

type PlanType = 'annual' | 'monthly';

type SettlementItem = {
  company: string;
  name: string;
  payout: string;
  min: number;
  max: number;
};

const totalSteps = 8;
const stepKeys: OnboardingStepKey[] = [
  'hook',
  'big_numbers',
  'social_proof',
  'personalization',
  'eligibility_scan',
  'potential_results',
  'prepaywall',
  'paywall',
];
const onboardingCompanies = ['Apple', 'Amazon', 'Facebook / Meta', 'Google', 'Uber', 'Netflix', 'Other'];
const loadingMessages = [
  'Scanning active settlements...',
  'Checking eligibility signals...',
  'Analyzing potential claims...',
];

const allSettlements: SettlementItem[] = [
  { company: 'Apple', name: 'Apple Battery Settlement', payout: '$25 - $500', min: 25, max: 500 },
  {
    company: 'Facebook / Meta',
    name: 'Facebook Privacy Settlement',
    payout: '$50 - $400',
    min: 50,
    max: 400,
  },
  {
    company: 'Other',
    name: 'Equifax Data Breach Settlement',
    payout: '$100 - $300',
    min: 100,
    max: 300,
  },
  { company: 'Google', name: 'Google Tracking Settlement', payout: '$40 - $250', min: 40, max: 250 },
  { company: 'Amazon', name: 'Amazon Voice Data Settlement', payout: '$30 - $200', min: 30, max: 200 },
  { company: 'Uber', name: 'Rideshare Driver Fee Settlement', payout: '$20 - $180', min: 20, max: 180 },
  { company: 'Netflix', name: 'Streaming Billing Settlement', payout: '$20 - $120', min: 20, max: 120 },
];

const plans = {
  annual: {
    badge: 'Save 50%',
    monthlyEquivalent: '$2.50/mo',
    price: '$29.99 / year',
    trialCopy: '7-day free trial, then yearly plan',
  },
  monthly: {
    badge: 'Flexible',
    monthlyEquivalent: '$4.99/mo',
    price: '$4.99 / month',
    trialCopy: '7-day free trial, then monthly billing',
  },
} as const;

export default function WelcomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const funnelSessionIdRef = useRef(createFunnelSessionId());
  const milestonesRef = useRef({
    scanCompleted: false,
    resultsViewed: false,
    prepaywallViewed: false,
    paywallViewed: false,
    onboardingCompleted: false,
  });
  const lastTrackedPlanRef = useRef<PlanType | null>(null);

  const [step, setStep] = useState(0);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessageIndex, setScanMessageIndex] = useState(0);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const selectedPlanInfo = plans[selectedPlan];
  const currentStepKey = stepKeys[step];

  const sendEvent = (name: OnboardingEventName, payload: Omit<OnboardingEventPayload, 'funnel_session_id'> = {}) => {
    void trackOnboardingEvent(name, {
      funnel_session_id: funnelSessionIdRef.current,
      user_id: user?.id ?? null,
      step_key: currentStepKey,
      step_index: step,
      plan_selected: selectedPlan,
      ...payload,
    });
  };

  const completeOnboardingFlow = (path: 'trial' | 'limited_access') => {
    if (milestonesRef.current.onboardingCompleted) {
      return;
    }

    milestonesRef.current.onboardingCompleted = true;
    sendEvent('onboarding_completed', {
      completion_path: path,
    });
  };

  const matchedSettlements = useMemo(() => {
    if (!selectedCompanies.length) {
      return allSettlements.slice(0, 4);
    }

    const matches = allSettlements.filter((settlement) =>
      selectedCompanies.some(
        (company) => company === settlement.company || (company === 'Other' && settlement.company === 'Other')
      )
    );

    return matches.length ? matches.slice(0, 4) : allSettlements.slice(0, 4);
  }, [selectedCompanies]);

  const resultMinValue = matchedSettlements.reduce((sum, settlement) => sum + settlement.min, 0);
  const resultMaxValue = matchedSettlements.reduce((sum, settlement) => sum + settlement.max, 0);
  const stepProgress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    sendEvent('onboarding_started');
    // We only want to set the run-level start marker once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sendEvent('onboarding_step_viewed');

    if (step === 5 && !milestonesRef.current.resultsViewed) {
      milestonesRef.current.resultsViewed = true;
      sendEvent('results_viewed', {
        estimated_min: resultMinValue,
        estimated_max: resultMaxValue,
      });
    }

    if (step === 6 && !milestonesRef.current.prepaywallViewed) {
      milestonesRef.current.prepaywallViewed = true;
      sendEvent('prepaywall_viewed');
    }

    if (step === 7 && !milestonesRef.current.paywallViewed) {
      milestonesRef.current.paywallViewed = true;
      sendEvent('paywall_viewed');
    }
    // Intentional dependency set to keep events aligned with viewed state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resultMaxValue, resultMinValue]);

  useEffect(() => {
    if (step !== 7) {
      return;
    }

    if (lastTrackedPlanRef.current === selectedPlan) {
      return;
    }

    lastTrackedPlanRef.current = selectedPlan;
    sendEvent('paywall_plan_selected');
    // Tracking selection change only on paywall.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, step]);

  useEffect(() => {
    if (step !== 4) {
      setScanProgress(0);
      setScanMessageIndex(0);
      return;
    }

    const messageTimer = setInterval(() => {
      setScanMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 800);

    const progressTimer = setInterval(() => {
      setScanProgress((current) => {
        const next = Math.min(current + 4, 100);

        if (next === 100) {
          if (!milestonesRef.current.scanCompleted) {
            milestonesRef.current.scanCompleted = true;
            sendEvent('scan_completed');
          }
          clearInterval(progressTimer);
          setTimeout(() => {
            setStep((activeStep) => (activeStep === 4 ? 5 : activeStep));
          }, 300);
        }

        return next;
      });
    }, 90);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [step]);

  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const goForward = (ctaLabel = 'Continue') => {
    sendEvent('onboarding_cta_tapped', { cta_label: ctaLabel });
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  };

  const toggleCompany = (company: string) => {
    setSelectedCompanies((current) => {
      const next = current.includes(company)
        ? current.filter((item) => item !== company)
        : [...current, company];

      void trackOnboardingEvent('personalization_updated', {
        funnel_session_id: funnelSessionIdRef.current,
        user_id: user?.id ?? null,
        step_key: 'personalization',
        step_index: 3,
        plan_selected: selectedPlan,
        selected_companies_count: next.length,
      });

      return next;
    });
  };

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <View style={styles.heroVisualWrap}>
            <View style={styles.heroGlow} />
            <View style={styles.heroCard}>
              <View style={styles.badge}>
                <CircleDollarSign color={Colors.primary} size={14} />
                <Text variant="caption" color={Colors.primary} style={styles.badgeText}>
                  Money opportunity scan
                </Text>
              </View>
              <Text variant="titleXl">You may be missing out on settlement money</Text>
              <Text color={Colors.textSecondary}>
                Most people never claim the money they are legally entitled to.
              </Text>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatPill}>
                <Text variant="caption" color={Colors.textSecondary}>
                  Avg. unclaimed
                </Text>
                <Text variant="label">$460</Text>
              </View>
              <View style={styles.heroStatPill}>
                <Text variant="caption" color={Colors.textSecondary}>
                  Active cases
                </Text>
                <Text variant="label">200+</Text>
              </View>
            </View>
          </View>
          <Button label="Continue" onPress={() => goForward('Continue')} />
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">Billions of dollars are paid out every year</Text>
            <Text color={Colors.textSecondary}>
              Lawsy highlights where people miss money and where your opportunity could be.
            </Text>
          </View>

          <Card>
            <View style={styles.statRow}>
              <BarChart3 color={Colors.primary} size={18} />
              <Text variant="sectionTitle">$42B+ in settlements paid</Text>
            </View>
            <View style={styles.statRow}>
              <Users color={Colors.primary} size={18} />
              <Text variant="sectionTitle">120M Americans affected</Text>
            </View>
            <View style={styles.statRow}>
              <TrendingUp color={Colors.primary} size={18} />
              <Text variant="sectionTitle">60% remains unclaimed</Text>
            </View>

            <View style={styles.chartBlock}>
              <View style={styles.chartRow}>
                <Text variant="caption" color={Colors.textSecondary}>
                  Claimed
                </Text>
                <View style={styles.chartTrack}>
                  <View style={[styles.chartFill, { width: '40%' }]} />
                </View>
              </View>
              <View style={styles.chartRow}>
                <Text variant="caption" color={Colors.textSecondary}>
                  Unclaimed
                </Text>
                <View style={styles.chartTrack}>
                  <View style={[styles.chartFillMuted, { width: '60%' }]} />
                </View>
              </View>
            </View>
          </Card>

          <Button label="Continue" onPress={() => goForward('Continue')} />
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">Thousands already discovered settlements</Text>
            <Text color={Colors.textSecondary}>
              Real case examples build trust and make the value obvious.
            </Text>
          </View>

          <Card>
            <View style={styles.socialHeader}>
              <Star color="#F59E0B" fill="#F59E0B" size={16} />
              <Text variant="label">4.8 rating from early users</Text>
            </View>
            <Text color={Colors.textSecondary}>"Found 2 settlements I didn't know existed."</Text>
          </Card>

          <Card>
            <Text variant="sectionTitle">Apple Battery Settlement</Text>
            <Text color={Colors.textSecondary}>$25 - $500 payouts</Text>
          </Card>

          <Card>
            <Text variant="sectionTitle">Facebook Privacy Settlement</Text>
            <Text color={Colors.textSecondary}>$397M settlement</Text>
          </Card>

          <Card>
            <Text variant="sectionTitle">Equifax Data Breach</Text>
            <Text color={Colors.textSecondary}>$425M settlement</Text>
          </Card>

          <Button label="Continue" onPress={() => goForward('Continue')} />
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">Let's find settlements for you</Text>
            <Text color={Colors.textSecondary}>Which companies do you use? (Multi-select)</Text>
          </View>

          <View style={styles.chipsRow}>
            {onboardingCompanies.map((company) => {
              const selected = selectedCompanies.includes(company);
              return (
                <Pressable
                  key={company}
                  onPress={() => toggleCompany(company)}
                  style={[styles.companyChip, selected ? styles.companyChipActive : styles.companyChipInactive]}
                >
                  <Text
                    variant="caption"
                    color={selected ? Colors.white : Colors.textPrimary}
                    style={styles.chipText}
                  >
                    {company}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Card>
            <Text variant="caption" color={Colors.textSecondary}>
              Personalization improves match quality and makes results feel relevant.
            </Text>
          </Card>

          <Button label="Continue" onPress={() => goForward('Continue')} />
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">Scanning potential settlements</Text>
            <Text color={Colors.textSecondary}>{loadingMessages[scanMessageIndex]}</Text>
          </View>

          <Card>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
            </View>
            <Text variant="label">{scanProgress}% complete</Text>
            <View style={styles.scanDotRow}>
              <View style={[styles.scanDot, scanProgress > 20 ? styles.scanDotActive : null]} />
              <View style={[styles.scanDot, scanProgress > 55 ? styles.scanDotActive : null]} />
              <View style={[styles.scanDot, scanProgress > 85 ? styles.scanDotActive : null]} />
            </View>
          </Card>
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">You may qualify for settlements</Text>
            <Text color={Colors.textSecondary}>{matchedSettlements.length} potential settlements found</Text>
          </View>

          <Card>
            <Text variant="caption" color={Colors.textSecondary}>
              Estimated value
            </Text>
            <Text variant="titleXl">
              ${resultMinValue} - ${resultMaxValue}
            </Text>

            <View style={styles.chartTrack}>
              <View style={[styles.chartFill, { width: '78%' }]} />
            </View>
            <Text variant="caption" color={Colors.textSecondary}>
              High match confidence based on your selected companies.
            </Text>
          </Card>

          {matchedSettlements.map((settlement) => (
            <Card key={settlement.name}>
              <Text variant="sectionTitle">{settlement.name}</Text>
              <Text color={Colors.textSecondary}>{settlement.payout}</Text>
            </Card>
          ))}

          <Button label="Unlock My Results" onPress={() => goForward('Unlock My Results')} />
        </>
      );
    }

    if (step === 6) {
      return (
        <>
          <View style={styles.header}>
            <Text variant="titleXl">How your free trial works</Text>
            <Text color={Colors.textSecondary}>One quick step before we unlock your full settlement list.</Text>
          </View>

          <Card>
            <View style={styles.timelineRow}>
              <CheckCircle2 color={Colors.primary} size={16} />
              <View style={styles.timelineCopy}>
                <Text variant="label">Today</Text>
                <Text color={Colors.textSecondary}>Get instant access to your personalized matches.</Text>
              </View>
            </View>

            <View style={styles.timelineRow}>
              <Clock3 color={Colors.primary} size={16} />
              <View style={styles.timelineCopy}>
                <Text variant="label">Day 5</Text>
                <Text color={Colors.textSecondary}>We remind you before your trial ends.</Text>
              </View>
            </View>

            <View style={styles.timelineRow}>
              <Crown color={Colors.primary} size={16} />
              <View style={styles.timelineCopy}>
                <Text variant="label">Day 7</Text>
                <Text color={Colors.textSecondary}>Keep full access or cancel anytime before renewal.</Text>
              </View>
            </View>
          </Card>

          <Button label="Continue to Plans" onPress={() => goForward('Continue to Plans')} />
        </>
      );
    }

    return (
      <>
        <View style={styles.header}>
          <View style={styles.paywallBadge}>
            <Crown color={Colors.primary} size={14} />
            <Text variant="caption" color={Colors.primary} style={styles.badgeText}>
              Step 3 of 3: Choose your plan
            </Text>
          </View>
          <Text variant="titleXl">Unlock all settlements you may qualify for</Text>
          <Text color={Colors.textSecondary}>Clear value, low risk, cancel anytime in your trial window.</Text>
        </View>

        <Card>
          <View style={styles.featureRow}>
            <Check color={Colors.success} size={16} />
            <Text>Discover active settlements</Text>
          </View>
          <View style={styles.featureRow}>
            <Check color={Colors.success} size={16} />
            <Text>Eligibility checker + deadline alerts</Text>
          </View>
          <View style={styles.featureRow}>
            <Check color={Colors.success} size={16} />
            <Text>Claim tracker and reminder timeline</Text>
          </View>
        </Card>

        <Card>
          <Pressable
            onPress={() => setSelectedPlan('annual')}
            style={[
              styles.planCard,
              selectedPlan === 'annual' ? styles.planCardActive : styles.planCardInactive,
            ]}
          >
            <View style={styles.planHeader}>
              <Text variant="sectionTitle">Annual</Text>
              <View style={styles.bestValuePill}>
                <Text variant="caption" color={Colors.white} style={styles.bestValueText}>
                  {plans.annual.badge}
                </Text>
              </View>
            </View>
            <Text variant="label">{plans.annual.price}</Text>
            <Text color={Colors.textSecondary}>{plans.annual.monthlyEquivalent}</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' ? styles.planCardActive : styles.planCardInactive,
            ]}
          >
            <View style={styles.planHeader}>
              <Text variant="sectionTitle">Monthly</Text>
              <View style={styles.neutralPill}>
                <Text variant="caption" color={Colors.textPrimary} style={styles.badgeText}>
                  {plans.monthly.badge}
                </Text>
              </View>
            </View>
            <Text variant="label">{plans.monthly.price}</Text>
            <Text color={Colors.textSecondary}>{plans.monthly.monthlyEquivalent}</Text>
          </Pressable>
        </Card>

        <Card>
          <Text variant="sectionTitle">Start with a 7-day free trial</Text>
          <View style={styles.timelineRow}>
            <Sparkles color={Colors.primary} size={16} />
            <Text>Today: full access unlocked</Text>
          </View>
          <View style={styles.timelineRow}>
            <Clock3 color={Colors.primary} size={16} />
            <Text>In 5 days: reminder before renewal</Text>
          </View>
          <View style={styles.timelineRow}>
            <Rocket color={Colors.primary} size={16} />
            <Text>In 7 days: {selectedPlanInfo.trialCopy}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.tableHeader}>
            <Text variant="sectionTitle">Compare plans</Text>
            <Pressable onPress={() => setShowAllFeatures((current) => !current)} style={styles.showMoreBtn}>
              <Text variant="caption" color={Colors.primary}>
                {showAllFeatures ? 'Show less' : 'Show more'}
              </Text>
              {showAllFeatures ? (
                <ChevronUp color={Colors.primary} size={14} />
              ) : (
                <ChevronDown color={Colors.primary} size={14} />
              )}
            </Pressable>
          </View>

          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Settlement discovery</Text>
            <Text variant="caption">Annual and Monthly</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Claim tracker</Text>
            <Text variant="caption">Annual and Monthly</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Deadline alerts</Text>
            <Text variant="caption">Annual and Monthly</Text>
          </View>

          {showAllFeatures ? (
            <>
              <View style={styles.compareRow}>
                <Text style={styles.compareLabel}>Priority case updates</Text>
                <Text variant="caption">Annual only</Text>
              </View>
              <View style={styles.compareRow}>
                <Text style={styles.compareLabel}>Higher savings</Text>
                <Text variant="caption">Annual only</Text>
              </View>
            </>
          ) : null}
        </Card>

        <Card>
          <View style={styles.featureRow}>
            <Star color="#F59E0B" fill="#F59E0B" size={16} />
            <Text>4.8 rating from early users</Text>
          </View>
          <View style={styles.featureRow}>
            <Users color={Colors.primary} size={16} />
            <Text>Trusted by thousands discovering settlements</Text>
          </View>
          <View style={styles.featureRow}>
            <ShieldCheck color={Colors.primary} size={16} />
            <Text>Some settlements expire soon - do not miss deadlines</Text>
          </View>
        </Card>

        <Card>
          <Text variant="caption" color={Colors.textSecondary}>
            Lawsy helps users discover public class action settlements. Lawsy does not provide legal
            advice and does not file claims on behalf of users. Eligibility must be verified on
            official claim websites.
          </Text>
        </Card>

        <Button
          disabled={isStartingTrial}
          label={isStartingTrial ? 'Starting trial...' : `Start Free Trial - ${selectedPlanInfo.price}`}
          onPress={async () => {
            sendEvent('onboarding_cta_tapped', { cta_label: 'Start Free Trial' });
            sendEvent('paywall_trial_tapped');
            setIsStartingTrial(true);

            const result = await startFreeTrialPurchase(selectedPlan);
            sendEvent('paywall_trial_result', {
              trial_result_status: result.status,
            });

            setIsStartingTrial(false);

            if (result.status === 'success') {
              completeOnboardingFlow('trial');
              if (!user) {
                completeOnboarding('register');
              } else {
                completeOnboarding('tabs');
              }
              router.replace(user ? '/(tabs)' : '/(auth)/register');
              return;
            }

            if (result.status === 'cancelled') {
              return;
            }

            completeOnboardingFlow('trial');
            completeOnboarding('register');
            Alert.alert('Checkout unavailable', result.message);
            router.push('/(auth)/register');
          }}
        />

        <Button
          label="Continue with limited access"
          onPress={() => {
            sendEvent('paywall_limited_access_tapped');
            completeOnboardingFlow('limited_access');
            completeOnboarding('tabs');
            router.replace('/(tabs)');
          }}
          variant="secondary"
        />

        <View style={styles.loginRow}>
          <Text color={Colors.textSecondary}>Already have an account?</Text>
          <Link href="/(auth)/login">
            <Text variant="label" color={Colors.primary}>
              Login
            </Text>
          </Link>
        </View>
      </>
    );
  };

  return (
    <Screen scroll>
      <View style={styles.topRow}>
        <View style={styles.progressMeta}>
          <ShieldCheck color={Colors.primary} size={14} />
          <Text variant="caption" color={Colors.textSecondary}>
            Step {step + 1} / {totalSteps}
          </Text>
        </View>
        {step > 0 && step < totalSteps - 1 ? <Button label="Back" onPress={goBack} variant="secondary" /> : null}
      </View>

      <View style={styles.stepProgressTrack}>
        <View style={[styles.stepProgressFill, { width: `${stepProgress}%` }]} />
      </View>

      {renderStepContent()}

      {step === totalSteps - 1 ? (
        <Card>
          <Text variant="sectionTitle">Continue with</Text>
          <Button
            disabled={!Features.enableGoogleAuth}
            label={Features.enableGoogleAuth ? 'Google' : 'Google (coming soon)'}
            variant="secondary"
          />
          <Button
            disabled={!Features.enableAppleAuth}
            label={Features.enableAppleAuth ? 'Apple' : 'Apple (coming soon)'}
            variant="secondary"
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 'auto',
  },
  badgeText: {
    fontWeight: '600',
  },
  bestValuePill: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bestValueText: {
    fontWeight: '700',
  },
  chartBlock: {
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginTop: 8,
    padding: 10,
  },
  chartFill: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    height: 8,
  },
  chartFillMuted: {
    backgroundColor: '#93C5FD',
    borderRadius: 999,
    height: 8,
  },
  chartRow: {
    gap: 6,
  },
  chartTrack: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  chipText: {
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  companyChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  companyChipActive: {
    backgroundColor: Colors.primary,
  },
  companyChipInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  compareLabel: {
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  compareRow: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
    paddingTop: 4,
  },
  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  header: {
    gap: 8,
  },
  heroCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  heroGlow: {
    backgroundColor: '#DBEAFE',
    borderRadius: 140,
    height: 140,
    opacity: 0.7,
    position: 'absolute',
    right: -20,
    top: -30,
    width: 140,
  },
  heroStatPill: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    padding: 10,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  heroVisualWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  neutralPill: {
    backgroundColor: Colors.border,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paywallBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  planCard: {
    borderRadius: 14,
    gap: 4,
    padding: 12,
  },
  planCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  planCardInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  planHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressFill: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    height: 10,
  },
  progressMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  progressTrack: {
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  scanDot: {
    backgroundColor: '#BFDBFE',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  scanDotActive: {
    backgroundColor: Colors.primary,
  },
  scanDotRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  showMoreBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  socialHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stepProgressFill: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    height: 4,
  },
  stepProgressTrack: {
    backgroundColor: Colors.border,
    borderRadius: 999,
    height: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineCopy: {
    flex: 1,
    gap: 2,
  },
  timelineRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
