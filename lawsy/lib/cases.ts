export const categories = ['All', 'Consumer', 'Tech', 'Privacy', 'Subscriptions'] as const;

export type Category = (typeof categories)[number];
export type CaseCategory = Exclude<Category, 'All'>;

export type CaseRecord = {
  id: string;
  slug: string;
  company: string;
  title: string;
  category: CaseCategory;
  description: string;
  deadlineLabel: string;
  deadlineIso: string;
  payout: string;
  qualifyRules: string[];
  purchaseWindow: string;
  sources: string[];
};

export const caseRecords: CaseRecord[] = [
  {
    id: 'apple-battery',
    slug: 'apple-iphone-battery-settlement',
    company: 'Apple',
    title: 'Apple iPhone Battery Settlement',
    category: 'Tech',
    description: 'iPhone 6 & 7 users may qualify for compensation.',
    deadlineLabel: 'May 20, 2026',
    deadlineIso: '2026-05-20',
    payout: '$25 - $500',
    qualifyRules: ['Owned iPhone 6 or 7', 'Purchased before Dec 2017', 'Device slowed down'],
    purchaseWindow: 'Sep 2014 - Dec 2017',
    sources: ['Official settlement notice', 'Court filing summary'],
  },
  {
    id: 'streamplus-renewal',
    slug: 'streamplus-auto-renewal-settlement',
    company: 'StreamPlus',
    title: 'StreamPlus Auto-Renewal Settlement',
    category: 'Subscriptions',
    description: 'Users charged after free trial may be eligible.',
    deadlineLabel: 'July 15, 2026',
    deadlineIso: '2026-07-15',
    payout: '$15 - $120',
    qualifyRules: [
      'Started free trial between 2023 and 2025',
      'Was charged after trial ended',
      'Did not receive clear cancellation notice',
    ],
    purchaseWindow: 'Jan 2023 - Nov 2025',
    sources: ['Settlement administrator portal', 'Consumer complaint docket'],
  },
  {
    id: 'shopmax-privacy',
    slug: 'shopmax-privacy-tracking-settlement',
    company: 'ShopMax',
    title: 'ShopMax Privacy Tracking Settlement',
    category: 'Privacy',
    description: 'Mobile app tracking disclosures are under settlement.',
    deadlineLabel: 'June 8, 2026',
    deadlineIso: '2026-06-08',
    payout: '$20 - $180',
    qualifyRules: [
      'Used ShopMax app in the United States',
      'Account was active during 2022-2024',
      'Did not consent to behavioral tracking',
    ],
    purchaseWindow: 'Mar 2022 - Oct 2024',
    sources: ['Class notice website', 'State privacy lawsuit archive'],
  },
];

export function getCaseBySlug(slug?: string) {
  if (!slug) {
    return null;
  }

  return caseRecords.find((item) => item.slug === slug) ?? null;
}

export function getCaseById(caseId?: string) {
  if (!caseId) {
    return null;
  }

  return caseRecords.find((item) => item.id === caseId) ?? null;
}
