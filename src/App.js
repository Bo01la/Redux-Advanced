import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { uiActions } from "./store/ui-slice";

let INITIAL_REQUEST = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const notification = useSelector((state) => state.ui.notification);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const updatingCartDb = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "sending...!",
          message: "sending cart data",
        })
      );

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

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "sending cart data successfully",
        })
      );
    };
    // preventing the initial data fetch sent when component mounts before declaring our
    //updatingCartDb() function
    if (INITIAL_REQUEST) {
      INITIAL_REQUEST = false;
      return;
    }

    updatingCartDb().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "sending cart data failed",
        })
      );
    });
  }, [cart]);
  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
