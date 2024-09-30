import getRestApiClient from '../utils/api-client.js';

/**
 * Fetches the current customer's cart
 *
 * @returns {Promise<{response: null}>|*}
 */
const getHelloMemberCoupons = () => getRestApiClient('hello-member/customers/coupons', true);

export default getHelloMemberCoupons;
