import getRestApiClient from '../utils/api-client.js';

const estimateShippingMethods = async (body, cartId, isLoggedIn) => {
  const getCartURI = isLoggedIn
    ? 'carts/mine/estimate-shipping-methods'
    : `guest-carts/${cartId}/estimate-shipping-methods`;

  let responseData = {};
  try {
    const response = await getRestApiClient(getCartURI, isLoggedIn, 'POST', body);
    responseData = response?.response;
  } catch (error) {
    console.log(error, 'error');
  }

  return responseData;
};

export default estimateShippingMethods;
