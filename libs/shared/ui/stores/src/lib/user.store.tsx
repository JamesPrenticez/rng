import type { User } from '@shared/models';
import { produce } from 'immer';
import { create } from 'zustand';

export interface UserState {
    user?: User;

    totalWon?: number;

    setUser: (user: User) => void;
    updateUser: (data: Partial<User>) => void;

    updateTotalWon: (won?: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
    setUser: (user) =>
        set(
            produce<UserState>((state) => {
                state.user = user;
            })
        ),
    updateUser: (user) =>
        set(
            produce<UserState>((state) => {
                if (!state.user) return;

                state.user = { ...state.user, ...user };

                console.log('User update', user);
            })
        ),
    updateTotalWon: (won) => set({ totalWon: won }),
}));
