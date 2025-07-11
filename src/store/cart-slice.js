import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;

      state.totalQuantity++;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      state.totalQuantity--;

      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

// to send an http request throu redux reucers, we create a function thet returns another function
// by this we are creating our own "action function"
// when we do that, redux toolkit will handle this function when called in other
// components as an action function and will update the store accordingly.

export const sendCartData = (cart) => {
  return async (dispatch) => {
    // when the request is being send, we dispatch the below to update our Notification component
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "sending...!",
        message: "sending cart data",
      })
    );

    // creating a function that updtaes the DB to then use it in a try/catch block
    const sendRequest = async () => {
      const response = await fetch(
        "https://advanced-redux-4da17-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data faild");
      }
    };

    try {
      // caling that function and if succeeded then will dispatch the success to update our Notification component
      sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "sending cart data successfully",
        })
      );
    } catch (error) {
      // if error then will dipatch error to update our our Notification component
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "sending cart data failed",
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;
export default cartSlice;
