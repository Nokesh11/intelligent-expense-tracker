import { create } from 'zustand';

interface UIState {
  // Bottom sheet / modal controls
  isAddExpenseOpen: boolean;
  isVoiceLogOpen: boolean;

  // Active tab
  activeTab: 'home' | 'expenses' | 'insights' | 'budgets' | 'settings';

  // Global loading/error feedback
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;

  // Actions
  openAddExpense: () => void;
  closeAddExpense: () => void;
  openVoiceLog: () => void;
  closeVoiceLog: () => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  showToast: (message: string, type?: UIState['toastType']) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>(set => ({
  isAddExpenseOpen: false,
  isVoiceLogOpen: false,
  activeTab: 'home',
  toastMessage: null,
  toastType: null,

  openAddExpense: () => set({ isAddExpenseOpen: true }),
  closeAddExpense: () => set({ isAddExpenseOpen: false }),
  openVoiceLog: () => set({ isVoiceLogOpen: true }),
  closeVoiceLog: () => set({ isVoiceLogOpen: false }),
  setActiveTab: tab => set({ activeTab: tab }),

  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    // Auto-clear after 3 seconds
    setTimeout(() => set({ toastMessage: null, toastType: null }), 3000);
  },
  clearToast: () => set({ toastMessage: null, toastType: null }),
}));
