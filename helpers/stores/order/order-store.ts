import { create } from "zustand";

export const useOrderStory = create<Order>((set) => ({
    freeTime: [],
    setFreeTime: (val: any) => set({ freeTime: val }),
    pay: '',
    setPay: (val: string) => set({ pay: val }),
    cardExpire: '',
    setCardExpire: (val: string) => set({ cardExpire: val }),
    cardNumber: '',
    setCardNumber: (val: string) => set({ cardNumber: val })
}));