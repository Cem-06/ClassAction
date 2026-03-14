import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type EligibilityStatus = 'unknown' | 'likely_eligible' | 'needs_review' | 'not_eligible';

type CasesStore = {
  savedCaseIds: string[];
  eligibilityByCaseId: Record<string, EligibilityStatus>;
  toggleSaved: (caseId: string) => void;
  setEligibilityStatus: (caseId: string, status: EligibilityStatus) => void;
  clearAllLocalData: () => void;
};

export const useCasesStore = create<CasesStore>()(
  persist(
    (set) => ({
      savedCaseIds: [],
      eligibilityByCaseId: {},
      toggleSaved: (caseId) =>
        set((state) => ({
          savedCaseIds: state.savedCaseIds.includes(caseId)
            ? state.savedCaseIds.filter((id) => id !== caseId)
            : [...state.savedCaseIds, caseId],
        })),
      setEligibilityStatus: (caseId, status) =>
        set((state) => ({
          eligibilityByCaseId: {
            ...state.eligibilityByCaseId,
            [caseId]: status,
          },
        })),
      clearAllLocalData: () =>
        set({
          savedCaseIds: [],
          eligibilityByCaseId: {},
        }),
    }),
    {
      name: 'lawsy-cases-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
