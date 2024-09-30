import { getGraphqlClient } from '../utils/api-client.js';
import Constants from './constants.js';

/**
 * Updates the quantity of a product in the cart
 * @param cartItemId
 * @param cartId
 * @param quantity
 * @returns {Promise<*[]>}
 */
const updateQuantityGraphql = async (cartItemId, cartId, quantity) => {
  const updateQuantityQuery = `mutation updateCartItems($cartId: String!, $cartItemId: ID!, $quantity: Float!) {
    commerce_updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_uid: $cartItemId, quantity: $quantity }]
      }
    ) {
      cart ${Constants.CART_QUERY}
    }
  }`;

  let responseDataCart = [];

  try {
    const response = await getGraphqlClient(updateQuantityQuery, { cartId, cartItemId, quantity }, true);
    responseDataCart = response.response;
    window.dispatchEvent(new CustomEvent('updateMiniCart'));
  } catch (error) {
    console.error('Error updating quantity:', error);
  }

  return responseDataCart;
};

export default updateQuantityGraphql;
