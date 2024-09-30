import { getGraphqlClient } from '../utils/api-client.js';
import Constants from './constants.js';

/**
 * Apply coupon code to cart
 *
 * @param cartItemId
 * @param cartId
 * @returns {{cartData: boolean|{}}}
 */
const applyCouponCodeGraphql = async (cartId, couponCode) => {
  const applyCouponCodeMutation = `mutation applyCouponToCart($cartId: String!, $couponCode: String!) {
      applyCouponToCart(
        input: {
          cart_id: $cartId,
          coupon_code: $couponCode
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
    const response = await getGraphqlClient(applyCouponCodeMutation, { cartId, couponCode });
    responseData = {
      cart: response?.response?.data?.applyCouponToCart?.cart,
      errors: response?.response?.errors,
    };
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }

  return responseData;
};

export default applyCouponCodeGraphql;
