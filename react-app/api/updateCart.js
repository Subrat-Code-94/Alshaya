import getRestApiClient from '../utils/api-client.js';

const updateCart = async (body, cartId, isLoggedIn) => {
  // Get the cart context

  const getCartURI = isLoggedIn
    ? 'carts/mine/updateCart'
    : `guest-carts/${cartId}/updateCart`;

  let responseData = {};
  try {
    const response = await getRestApiClient(getCartURI, isLoggedIn, 'POST', body);
    responseData = response?.response;
    window.dispatchEvent(new CustomEvent('updateMiniCart'));
  } catch (error) {
    console.log(error, 'error');
  }
  return responseData;
};

export default updateCart;
