import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean; // ✅ tambahkan ini
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false, // 👈 tambahkan ini

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) =>
  set((state) => {
    console.log("BEFORE:", state.items);

    const existing = state.items.find((i) => i.id === item.id);

    let newItems;

    if (existing) {
      newItems = state.items.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [...state.items, { ...item, quantity: 1 }];
    }

    console.log("AFTER:", newItems);

    return {
      items: newItems,
    };
  }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "dapurpizza-cart",
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state, error) => {
  if (!error && state) {
    state.hasHydrated = true;
  }
},
    }
  )
);