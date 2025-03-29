import { create } from 'zustand';

// Types can now be strings for more flexibility
export type BusinessType = string | null;
export type BusinessGoal = string;
export type MessageTone = string | null;

// Define the store state
export interface OnboardingState {
  // Current step in the onboarding process
  currentStep: number;
  
  // Business information
  businessType: BusinessType;
  customBusinessType: string;
  businessGoals: BusinessGoal[];
  messageTone: MessageTone;
  customMessageTone: string;
  
  // Actions
  setStep: (step: number) => void;
  
  setBusinessType: (type: BusinessType) => void;
  setCustomBusinessType: (type: string) => void;
  
  addBusinessGoal: (goal: BusinessGoal) => void;
  removeBusinessGoal: (goal: BusinessGoal) => void;
  setBusinessGoals: (goals: string) => void;
  clearBusinessGoals: () => void;
  
  setMessageTone: (tone: MessageTone) => void;
  setCustomMessageTone: (tone: string) => void;
}

// Create the store
export const useOnboardingStore = create<OnboardingState>((set) => ({
  // Initial state
  currentStep: 0,
  
  businessType: null,
  customBusinessType: '',
  businessGoals: [],
  messageTone: null,
  customMessageTone: '',
  
  // Actions
  setStep: (step) => set({ currentStep: step }),
  
  setBusinessType: (type) => set({ businessType: type }),
  setCustomBusinessType: (type) => set({ customBusinessType: type }),
  
  addBusinessGoal: (goal) => set((state) => ({ 
    businessGoals: [...state.businessGoals, goal] 
  })),
  removeBusinessGoal: (goal) => set((state) => ({ 
    businessGoals: state.businessGoals.filter(g => g !== goal) 
  })),
  setBusinessGoals: (goals) => set({ 
    businessGoals: [goals] 
  }),
  clearBusinessGoals: () => set({ businessGoals: [] }),
  
  setMessageTone: (tone) => set({ messageTone: tone }),
  setCustomMessageTone: (tone) => set({ customMessageTone: tone }),
})); 