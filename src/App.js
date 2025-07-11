import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { sendCartData } from "./store/cart-slice";

let INITIAL_REQUEST = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const notification = useSelector((state) => state.ui.notification);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // preventing the initial data fetch sent when component mounts before declaring our
    //updatingCartDb() function
    if (INITIAL_REQUEST) {
      INITIAL_REQUEST = false;
      return;
    }

    // using the action function we created in the cart-slice file (sendCartData) inside a
    // dispatch() to both update Db and store
    dispatch(sendCartData(cart));
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
