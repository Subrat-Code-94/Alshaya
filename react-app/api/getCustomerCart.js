import getRestApiClient from '../utils/api-client.js';

/**
 * Fetches the current customer's cart
 *
 * @returns {Promise<{response: null}>|*}
 */
const getCustomerCart = () => getRestApiClient('carts/mine/getCart', true);

export default getCustomerCart;
