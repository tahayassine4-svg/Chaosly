import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Idea {
  id: string;
  text: string;
  createdAt: number;
  status: 'inbox' | 'kept' | 'maybe' | 'deleted';
}

interface FocusSession {
  isActive: boolean;
  duration: number;
  timeRemaining: number;
  isPaused: boolean;
  startedAt: number | null;
}

interface AppStore {
  // Focus session state
  session: FocusSession;

  // Ideas state
  ideas: Idea[];

  // Focus session actions
  startSession: (duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  updateTimeRemaining: (time: number) => void;

  // Ideas actions
  addIdea: (text: string) => void;
  removeIdea: (id: string) => void;
  keepIdea: (id: string) => void;
  maybeIdea: (id: string) => void;
  loadIdeas: () => Promise<void>;

  // Brain dump modal
  isBrainDumpOpen: boolean;
  openBrainDump: () => void;
  closeBrainDump: () => void;

  // Celebration modal
  isCelebrationOpen: boolean;
  openCelebration: () => void;
  closeCelebration: () => void;
}

const STORAGE_KEY = 'chaosly_ideas';

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  session: {
    isActive: false,
    duration: 0,
    timeRemaining: 0,
    isPaused: false,
    startedAt: null,
  },

  ideas: [],
  isBrainDumpOpen: false,
  isCelebrationOpen: false,

  // Focus session actions
  startSession: (duration: number) => {
    set({
      session: {
        isActive: true,
        duration,
        timeRemaining: duration * 60, // Convert to seconds
        isPaused: false,
        startedAt: Date.now(),
      },
    });
  },

  pauseSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        isPaused: true,
      },
    }));
  },

  resumeSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        isPaused: false,
      },
    }));
  },

  endSession: () => {
    set({
      session: {
        isActive: false,
        duration: 0,
        timeRemaining: 0,
        isPaused: false,
        startedAt: null,
      },
    });
  },

  updateTimeRemaining: (time: number) => {
    set((state) => ({
      session: {
        ...state.session,
        timeRemaining: time,
      },
    }));
  },

  // Ideas actions
  addIdea: (text: string) => {
    const newIdea: Idea = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      createdAt: Date.now(),
      status: 'inbox',
    };

    const updatedIdeas = [...get().ideas, newIdea];
    set({ ideas: updatedIdeas });

    // Persist to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
  },

  removeIdea: (id: string) => {
    const updatedIdeas = get().ideas.filter((idea) => idea.id !== id);
    set({ ideas: updatedIdeas });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
  },

  keepIdea: (id: string) => {
    const updatedIdeas = get().ideas.map((idea) =>
      idea.id === id ? { ...idea, status: 'kept' as const } : idea
    );
    set({ ideas: updatedIdeas });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
  },

  maybeIdea: (id: string) => {
    const updatedIdeas = get().ideas.map((idea) =>
      idea.id === id ? { ...idea, status: 'maybe' as const } : idea
    );
    set({ ideas: updatedIdeas });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
  },

  loadIdeas: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ideas = JSON.parse(stored);
        set({ ideas });
      }
    } catch (error) {
      console.error('Failed to load ideas:', error);
    }
  },

  // Brain dump modal actions
  openBrainDump: () => set({ isBrainDumpOpen: true }),
  closeBrainDump: () => set({ isBrainDumpOpen: false }),

  // Celebration modal actions
  openCelebration: () => set({ isCelebrationOpen: true }),
  closeCelebration: () => set({ isCelebrationOpen: false }),
}));
