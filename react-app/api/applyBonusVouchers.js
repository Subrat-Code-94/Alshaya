import getRestApiClient from '../utils/api-client.js';

/**
 * Fetches the current customer's cart
 * @param payload
 * @returns {Promise<{response: null}>|*}
 */
const applyBonusVouchers = (payload) => {
  const requestMethod = (payload) ? 'POST' : 'DELETE';
  return getRestApiClient('hello-member/carts/mine/bonusVouchers', true, requestMethod, payload);
};

export default applyBonusVouchers;
