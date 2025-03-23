import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const localStorageCart = (): CartItem[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: localStorageCart(),
};

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions,
) => {
  if (action.type === "add-to-cart") {
    const itemExists = state.cart.find(
      (cartItem) => cartItem.id === action.payload.item.id,
    );

    let updatedCart: CartItem[] = [];
    if (itemExists) {
      updatedCart = state.cart.map((cartItem) => {
        if (
          cartItem.id === action.payload.item.id &&
          cartItem.quantity < MAX_ITEMS
        ) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        } else {
          return cartItem;
        }
      });
    } else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "remove-from-cart") {
    return {
      ...state,
      cart: state.cart.filter((cartItem) => cartItem.id !== action.payload.id),
    };
  }

  if (action.type === "decrease-quantity") {
    const updatedCart = state.cart.map((cartItem) => {
      if (cartItem.id === action.payload.id && cartItem.quantity > MIN_ITEMS) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1,
        };
      } else {
        return cartItem;
      }
    });
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "increase-quantity") {
    const updatedCart = state.cart.map((cartItem) => {
      if (cartItem.id === action.payload.id && cartItem.quantity < MAX_ITEMS) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      } else {
        return cartItem;
      }
    });
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "clear-cart") {
    return {
      ...state,
      cart: [],
    };
  }
  return state;
};
