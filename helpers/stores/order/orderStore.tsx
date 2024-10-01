import {create} from "zustand";

interface OrderData {
    OrderData: any,
    setOrderData: (val: any) => void;
}

const OrderStore = create<OrderData>((set) => ({
    OrderData: null,
    setOrderData: (val) => set({OrderData: val}),
}));

export default OrderStore;
