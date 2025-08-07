
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  birthDate?: string;
  birthTime?: string;
  isProfileComplete: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeProfile: (name: string, birthDate: string, birthTime: string) => void;
  updateProfile: (name: string, birthDate: string, birthTime: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: '1',
          email,
          isProfileComplete: false
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },

      register: async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: Date.now().toString(),
          email,
          isProfileComplete: false
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },

      completeProfile: (name: string, birthDate: string, birthTime: string) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            name,
            birthDate,
            birthTime,
            isProfileComplete: true
          };
          set({ user: updatedUser });
        }
      },

      updateProfile: (name: string, birthDate: string, birthTime: string) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            name,
            birthDate,
            birthTime
          };
          set({ user: updatedUser });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'tarot' | 'astrology' | 'numerology';
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading })
}));

export interface Partner {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  relationship: 'married' | 'dating' | 'interested';
  startDate: string;
}

export interface BreakupData {
  isActive: boolean;
  partnerName: string;
  partnerInfo: Partner;
  breakupDate: string;
  autoDeleteDate: string;
  weeklyCheckDone: boolean[];
}

interface ProfileState {
  partner: Partner | null;
  breakupData: BreakupData | null;
  addPartner: (partnerData: Omit<Partner, 'id' | 'startDate'>) => void;
  updatePartner: (partnerData: Partial<Partner>) => void;
  breakup: () => void;
  confirmRecovery: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner: null,
      breakupData: null,

      addPartner: (partnerData) => {
        const newPartner: Partner = {
          ...partnerData,
          id: Date.now().toString(),
          startDate: new Date().toISOString()
        };
        set({ partner: newPartner, breakupData: null });
      },

      updatePartner: (partnerData) => {
        const { partner } = get();
        if (partner) {
          set({ partner: { ...partner, ...partnerData } });
        }
      },

      breakup: () => {
        const { partner } = get();
        if (partner) {
          const breakupDate = new Date();
          const autoDeleteDate = new Date(breakupDate);
          autoDeleteDate.setMonth(autoDeleteDate.getMonth() + 3);

          const breakupData: BreakupData = {
            isActive: true,
            partnerName: partner.name,
            partnerInfo: partner,
            breakupDate: breakupDate.toISOString(),
            autoDeleteDate: autoDeleteDate.toISOString(),
            weeklyCheckDone: []
          };

          set({ partner: null, breakupData });

          setTimeout(() => {
            const { breakupData: currentBreakupData } = get();
            if (currentBreakupData && currentBreakupData.isActive) {
              set({ breakupData: null });
            }
          }, 3 * 30 * 24 * 60 * 60 * 1000); 
        }
      },

      confirmRecovery: () => {
        set({ breakupData: null });
      }
    }),
    {
      name: 'profile-storage'
    }
  )
);
