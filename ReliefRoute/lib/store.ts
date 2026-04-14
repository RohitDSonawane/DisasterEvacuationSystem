import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TreeNode, ShelterSummary, EvacuationResult } from './types';

interface ReliefRouteStore {
    // Auth State
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;

    // Data State
    tree: TreeNode | null;
    shelters: ShelterSummary[];
    setTree: (tree: TreeNode) => void;
    setShelters: (shelters: ShelterSummary[]) => void;
    
    // UI State
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useStore = create<ReliefRouteStore>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            logout: () => set({ token: null, tree: null, shelters: [] }),

            tree: null,
            shelters: [],
            setTree: (tree) => set({ tree }),
            setShelters: (shelters) => set({ shelters }),

            isLoading: false,
            setIsLoading: (isLoading) => set({ isLoading }),
            error: null,
            setError: (error) => set({ error }),
        }),
        {
            name: 'reliefroute-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ token: state.token }), // Only persist token
        }
    )
);
