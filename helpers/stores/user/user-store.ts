import { UserStoreTypes } from "@/types/user/user";
import { create } from "zustand";
import * as Location from 'expo-location';

export const useUserStore = create<UserStoreTypes>((set) => ({
    userLocation: null,
    setUserLocation: (val: Location.LocationObject | null) => set({ userLocation: val }),
}));