import { FavouriteOrdersStoreTypes } from "@/types/favourite/favourite";
import { StadiumTypes } from "@/types/stadium/stadium";
import { create } from "zustand";

const useFavoutiteOrders = create<FavouriteOrdersStoreTypes>((set) => ({
    masterId: '',
    setMasterId: (data: string) => set({ masterId: data }),
    favouriteOrders: [],
    setFavouriteOrders: (data: StadiumTypes[]) => set({ favouriteOrders: data }),
    isLoading: false,
    setIsLoading: (data: boolean) => set({ isLoading: data }),
    isModal: false,
    setIsModal: (data: boolean) => set({ isModal: data }),
}));

export default useFavoutiteOrders;
