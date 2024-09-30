/* eslint-disable prefer-regex-literals */
/**
 * Bin validation.
 *
 * @param {*} bin
 * eslint-disable
 */
export const binValidation = (bin, checkoutComUpiBinConfig) => {
  const { supportedPaymentMethods, cardBinNumbers } = checkoutComUpiBinConfig;
  let valid = true;
  let errorMessage = 'invalid_card';

  supportedPaymentMethods.split(',').every((paymentMethod) => {
    // If the given bin number matches with the bins of given payment method
    // then this card belongs to that payment method, so throw an error
    // asking user to use that payment method.
    const paymentMethodBinNumbers = cardBinNumbers[paymentMethod];

    if (paymentMethodBinNumbers !== undefined
      && Object.values(paymentMethodBinNumbers.split(',')).includes(bin)) {
      valid = false;
      errorMessage = `card_bin_validation_error_message_${paymentMethod}`;
      return false;
    }
    return true;
  });

  if (valid === false) {
    return ({ error: true, error_message: errorMessage });
  }

  return valid;
};

export const getPaymentCardType = (cardNumber, checkoutComUpiBinConfig) => {
  const { mada_bin_numbers: madaBins } = checkoutComUpiBinConfig;
  // Get rid of anything but numbers.
  const curCardNumber = cardNumber.replace(/\D/g, '');
  let cardType = ''; // Variable to store the card type.

  // Min length of bin is 6.
  // If more than 5 chars have been entered then check for mada bin match.
  if (madaBins.length > 0 && curCardNumber.length > 5) {
    const cardInitials = curCardNumber.slice(0, 6);
    // If 6 chars entered then check if exact match is available.
    if (curCardNumber.length === 6 && madaBins.includes(curCardNumber)) {
      cardType = 'mada';
    }
    // We need to check matches only within 6 char bins if 7 chars entered.
    if (curCardNumber.length === 7) {
      // Filter out 8 digit Mada bins.
      const filteredMadaBins = madaBins.filter((bin) => bin.length === 6);
      if (filteredMadaBins.some((bin) => bin === cardInitials)) {
        cardType = 'mada';
      }
    }
    // Compare if any bin is present matching with 6 first chars of entered card number.
    if (curCardNumber.length >= 8) {
      // Check for mada bin match.
      if (madaBins.some((bin) => bin.startsWith(cardInitials))) {
        cardType = 'mada';
      }
    }
  }

  // Current brand is not MADA then check rest.
  // Compare entered chars with regular exp of AmEx, Visa and Master Card.
  if (cardType === '') {
    // American Express
    const amexRegex = new RegExp('^3[47][0-9]{0,}$'); // 34, 37
    // Visa
    const visaRegex = new RegExp('^4[0-9]{0,}$'); // 4
    // MasterCard
    const mastercardRegex = new RegExp(
      '^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$',
    ); // 2221-2720, 51-55

    if (curCardNumber.match(amexRegex)) {
      cardType = 'amex';
    } else if (curCardNumber.match(visaRegex)) {
      cardType = 'visa';
    } else if (curCardNumber.match(mastercardRegex)) {
      cardType = 'master';
    }
  }

  // Partially checking mada bin if none matches for 4 chars.
  if (curCardNumber.length > 3 && cardType === '') {
    const partialMatch = madaBins.some((bin) => bin.startsWith(curCardNumber));
    if (partialMatch) {
      cardType = 'mada';
    }
  }
  return cardType;
};

/**
 * Returns balance payable amount if present.
 *
 * @returns {string}
 *   Amount.
 */
export const getPayable = (value) => value.data.prices.grand_total.value;

export const isApplePayAvailable = (applePayAllowedIn) => {
  if (!(window.ApplePaySession)) {
    return false;
  }

  const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
  return applePayAllowedIn === 'all' || isMobile;
};

/**
 * Checks if upapi payment method (payment method via checkout.com).
 *
 * @param {string} paymentMethod
 *   Payment method code.
 *
 * @return {bool}
 *   TRUE if payment methods from checkout.com
 */
const isUpapiPaymentMethod = (paymentMethod) => paymentMethod.indexOf('upapi', 0) !== -1;

/**
 * Checks if postpay payment method.
 *
 * @param {string} paymentMethod
 *   Payment method code.
 *
 * @return {bool}
 *   TRUE if payment methods from postpay
 */
const isPostpayPaymentMethod = (paymentMethod) => paymentMethod.indexOf('postpay', 0) !== -1;

/**
 * Checks if tabby payment method.
 *
 * @param {string} paymentMethod
 *   Payment method code.
 *
 * @return {bool}
 *   TRUE if payment methods from tabby
 */
const isTabbyPaymentMethod = (paymentMethod) => paymentMethod.indexOf('tabby', 0) !== -1;

/**
 * Checks if tamara payment method.
 *
 * @param {string} paymentMethod
 *   Payment method code.
 *
 * @return {bool}
 *   TRUE if payment methods from tamara
 */
const isTamaraPaymentMethod = (paymentMethod) => paymentMethod.indexOf('tamara', 0) !== -1;

/**
 * Process payment data before placing order.
 *
 * @param paymentData
 * @param data
 * @returns {{cvv: string, public_hash: string}}
 */
const processPaymentData = (paymentData, data) => {
  const additionalInfo = data;
  switch (paymentData.method) {
    case 'checkout_com_upapi':
      switch (additionalInfo.card_type) {
        case 'new':
          additionalInfo.is_active_payment_token_enabler = parseInt(additionalInfo.save_card, 10);
          break;

        case 'existing': {
          const { cvvCheck } = true;
          const { cvv, id } = additionalInfo;

          if (cvvCheck && !cvv) {
            return {
              data: {
                error: true,
                error_code: '505',
                message: 'CVV missing for credit/debit card.',
              },
            };
          }

          if (!id) {
            return {
              data: {
                error: true,
                error_code: '505',
                message: 'Invalid card token.',
              },
            };
          }

          additionalInfo.public_hash = atob(id);

          if (cvvCheck) {
            additionalInfo.cvv = atob(decodeURIComponent(cvv));
          }

          break;
        }

        // no default
      }
      break;

    // no default
  }

  return additionalInfo;
};

/**
 * Prepare message to log when API fail after payment successful.
 *
 * @param {array} cart
 *   Cart Data.
 * @param {array} data
 *   Payment data.
 * @param {string} exceptionMessage
 *   Exception message.
 * @param {string} api
 *   API identifier which failed.
 *
 * @return {string}
 *   Prepared error message.
 */
const prepareOrderFailedMessage = (cart, data, exceptionMessage, api) => {
  const orderId = cart?.cart?.extension_attributes?.real_reserved_order_id;
  const message = [];
  message.push(`exception:${exceptionMessage}`);
  message.push(`api:${api}`);
  message.push(`order_id:${orderId}`);

  const cartObj = cart?.cart;

  if (cartObj) {
    message.push(`cart_id:${cart.cart.id}`);
    message.push(`amount_paid:${cart.totals.base_grand_total}`);
  }

  const paymentMethod = data?.method ?? data.paymentMethod?.method;
  message.push(`payment_method:.${paymentMethod}`);

  const paymentAdditionalData = data?.paymentMethod?.additional_data ?? '';
  const additionalData = data?.paymentMethod?.additional_data ?? '';
  let additionalInfo = '';
  if (paymentAdditionalData) {
    additionalInfo = JSON.stringify(paymentAdditionalData);
  } else if (additionalData) {
    additionalInfo = JSON.stringify(data.additional_data);
  }
  message.push(`additional_information:${additionalInfo}`);

  const cartShippingMethod = cart?.shipping?.method;
  if (cartShippingMethod) {
    message.push(`shipping_method:${cart.shipping.method}`);
    // eslint-disable-next-line no-undef
    _.each(cart.shipping.custom_attributes, (value) => {
      message.push(`${value.attribute_code}:${value.value}`);
    });
  }

  return (message) ? message.join('||') : '';
};

/**
 * Adds payment method in the cart and returns the cart.
 *
 * @param {object} data
 *   The data object to send in the API call.
 *
 * @returns params
 *   A promise object.
 */
export const preparePaymentData = (data) => {
  const paymentData = data.payment;
  const additionalData = paymentData?.additional_data;
  const params = {
    extension: {
      action: 'update payment',
    },
    payment: {
      method: paymentData.method,
      additional_data: (additionalData) ?? {},
    },
  };

  const analytics = data?.payment_info?.payment?.analytics;
  if (analytics) {
    const analyticsData = data.payment_info.payment.analytics;

    params.extension.ga_client_id = analyticsData?.clientId ?? '';
    params.extension.tracking_id = analyticsData?.trackingId ?? '';
    params.extension.user_id = 0;
    params.extension.user_type = 'Guest User';
    params.extension.user_agent = navigator.userAgent;
    params.extension.client_ip = '';
    params.extension.attempted_payment = 1;
  }

  // If upapi payment method (payment method via checkout.com).
  if (isUpapiPaymentMethod(paymentData.method)
    || isPostpayPaymentMethod(paymentData.method)
    || isTabbyPaymentMethod(paymentData.method)
    || isTamaraPaymentMethod(paymentData.method)) {
    // Add success and fail redirect url to additional data.
    params.payment.additional_data.successUrl = `/${document.documentElement.lang}/confirmation`;
    params.payment.additional_data.failUrl = `/${document.documentElement.lang}/cart`;
  }

  // Process payment data by paymentMethod.
  const processedData = processPaymentData(paymentData, params.payment.additional_data);
  if (typeof processedData.data !== 'undefined' && processedData.data.error) {
    // eslint-disable-next-line no-console
    console.error(processedData);
    return processedData;
  }
  params.payment.additional_data = processedData;

  if (paymentData.method === 'checkout_com_upapi') {
    const hash = params?.payment?.additional_data?.public_hash;
    if (hash) {
      params.payment.method = 'checkout_com_upapi_vault';
    }
  }

  return params;
};

// eslint-disable-next-line consistent-return
export const validatePaymentUpdateError = (oldCartData, newCartData, paymentInfoData) => {
  const cartError = newCartData?.data?.error;
  if (cartError) {
    const paymentData = paymentInfoData.payment_info.payment;
    const errorMessage = (newCartData.data.error_code > 600) ? 'Back-end system is down' : newCartData.data.error_message;
    newCartData.data.message = errorMessage;
    const message = prepareOrderFailedMessage(oldCartData.data, paymentData, errorMessage, 'update cart', 'NA');
    console.error(message);

    return newCartData;
  }
};
