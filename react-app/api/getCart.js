import { useCallback, useContext, useEffect } from 'react';
import getRestApiClient from '../utils/api-client.js';
import CartContext from '../context/cart-context.jsx';

/**
 * Fetches the current guest cart
 * @returns {{cartData: boolean|{}}}
 */
const useGetCart = () => {
  const {
    isLoggedIn, cartId, cart, setCart,
  } = useContext(CartContext); // Get the cart context

  const getCartURI = isLoggedIn
    ? 'carts/mine/getCart'
    : `guest-carts/${cartId}/getCart`;

  const fetchCart = useCallback(() => {
    setCart({ ...cart, isLoading: true });
    getRestApiClient(getCartURI, isLoggedIn).then((response) => {
      setCart({ ...cart, data: response.response });
    });
  }, [cartId, setCart, cart]);

  useEffect(() => {
    if (cartId) {
      fetchCart();
    }
  }, [cartId, setCart]);

  return null;
};

export default useGetCart;
