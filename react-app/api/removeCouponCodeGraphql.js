import { getGraphqlClient } from '../utils/api-client.js';
import Constants from './constants.js';

/**
 * Remove coupon code from cart
 *
 * @param cartId
 * @returns {{cartData: boolean|{}}}
 */
const removeCouponCodeGraphql = async (cartId) => {
  const removeCouponCodeMutation = `mutation removeCouponFromCart($cartId: String!) {
      removeCouponFromCart(
        input: {
          cart_id: $cartId
        }
      )
      {
        cart {
          ${Constants.CART_QUERY__EXTENSION_ATTRIBUTE}
          ${Constants.CART_QUERY__PRICES}
        }
      }
    }`;

  let responseData = {
    cart: null,
    errors: null,
  };

  try {
    const response = await getGraphqlClient(removeCouponCodeMutation, { cartId });
    responseData = {
      cart: response.response?.data?.removeCouponFromCart?.cart,
      errors: response?.response?.errors,
    };
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }

  return responseData;
};

export default removeCouponCodeGraphql;
