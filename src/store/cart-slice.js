import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      // storing the payload in a const
      const newItem = action.payload;

      state.totalQuantity++;
      // checking if my item already exist in the cart
      const existingItem = state.items.find((item) => item.id === newItem.id);
      // if item doesn't exist, then we add a new item
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
        // if item already exist, then we change the quantity of items and total price
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      // geting the item id from the payload
      const id = action.payload;
      state.totalQuantity--;

      // checking if item exists only once or more than once
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        //if item is repeated in the cart then we decrease the number by 1
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
