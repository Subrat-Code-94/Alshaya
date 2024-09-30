import React, { forwardRef, useContext, useImperativeHandle } from 'react';
import { getPayable } from '../utilities/utils.js';
import CheckoutComUpiContext from '../../../../../context/checkoutcomupi-context.jsx';
import { getConfigValue } from '../../../../../../scripts/configs.js';

const CheckoutComUpiApplePay = forwardRef((props, ref) => {
  let applePaySessionObject;

  const {
    cart,
  } = props;

  const {
    checkoutComUpiConfig,
  } = useContext(CheckoutComUpiContext);

  const isPossible = () => {
    // document.getElementById('is-possible-placeholder').classList.add('error');

    const identifier = checkoutComUpiConfig.apple_pay_merchant_id;
    return window.ApplePaySession.canMakePaymentsWithActiveCard(identifier).then((canMakePayments) => {
      if (canMakePayments) {
        // document.getElementById('is-possible-placeholder').classList.remove('error');
      }
      return canMakePayments;
    }).catch((error) => {
      console.error(error);
      // document.getElementById('is-possible-placeholder').classList.add('error');
      return false;
    });
  };

  const getApplePaySupportedVersion = () => {
    for (let i = 6; i > 1; i--) {
      if (window.ApplePaySession.supportsVersion(i)) {
        return i;
      }
    }

    return 1;
  };

  const onValidateMerchant = async (event) => {
    const url = await getConfigValue('commerce-base-endpoint');
    const endpoint = await getConfigValue('appbuilder-apple-pay-endpoint');
    const fetchUrl = `${url}/${endpoint}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referrer: window.location.origin,
      },
    };

    options.body = JSON.stringify({
      data: {
        apple_pay_gateway: event.validationURL,
        brand_name: await getConfigValue('brand'),
      },
    });

    await fetch(fetchUrl, options).then((merchantSession) => {
      applePaySessionObject.completeMerchantValidation(merchantSession);
    }).catch((error) => {
      console.error(error);
    });
  };

  const onPaymentAuthorized = async (event) => {
    console.debug('Inside onPaymentAuthorized for Apple Pay UPAPI.');

    const url = checkoutComUpiConfig.api_url;
    const { token } = event.payment;
    const params = {
      type: 'applepay',
      token_data: {
        version: token.paymentData.version,
        data: token.paymentData.data,
        signature: token.paymentData.signature,
        header: {
          ephemeralPublicKey: token.paymentData.header.ephemeralPublicKey,
          publicKeyHash: token.paymentData.header.publicKeyHash,
          transactionId: token.transactionIdentifier,
        },
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: checkoutComUpiConfig.public_key,
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({ params }),
    };

    await fetch(url, options).then((response) => {
      console.log('------------Apple pay payment response');
      console.log(response);

      if (response.data.type !== undefined && response.data.type === 'applepay') {
        const paymentData = {
          payment: {
            method: 'checkout_com_upapi_applepay',
            additional_data: {
              token: response.data.token,
              bin: response.data.bin,
              type: response.data.type,
              expires_on: response.data.expires_on,
              expiry_month: response.data.expiry_month,
              expiry_year: response.data.expiry_year,
              last4: response.data.last4,
            },
          },
        };

        console.log(paymentData);

        // addPaymentMethodInCart(cartActions.cartPaymentFinalise, paymentData).then((result) => {
        //   if (!result) {
        //     throw new Error(response.data.error_message);
        //   }
        //
        //   if (result.error === undefined) {
        //     applePaySessionObject.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        //     //placeOrder('checkout_com_upapi_apple_pay');
        //   }
        // }).catch((error) => {
        //   console.error(error);
        //   applePaySessionObject.completePayment(window.ApplePaySession.STATUS_FAILURE);
        // });

        return;
      }
      throw new Error(response.data.error_message);
    }).catch((error) => {
      console.error(error);
      applePaySessionObject.completePayment(window.ApplePaySession.STATUS_FAILURE);
    });
  };

  const startPayment = async (total) => {
    let networks = checkoutComUpiConfig.apple_pay_supported_networks.split(',');
    if (getApplePaySupportedVersion() < 5) {
      networks = networks.filter((element) => element !== 'mada');
    }

    const paymentRequest = {
      merchantIdentifier: checkoutComUpiConfig.apple_pay_merchant_id,
      currencyCode: await getConfigValue('currency'),
      countryCode: await getConfigValue('country-code'),
      total: {
        label: 'H&M QA',
        amount: total,
      },
      supportedNetworks: networks,
      merchantCapabilities: checkoutComUpiConfig.apple_pay_merchant_capabilities.split(','),
    };

    try {
      applePaySessionObject = new window.ApplePaySession(1, paymentRequest);
      applePaySessionObject.onvalidatemerchant = onValidateMerchant;
      applePaySessionObject.onpaymentauthorized = onPaymentAuthorized;
      applePaySessionObject.begin();
    } catch (e) {
      console.error(e);
    }
  };

  const validateBeforePlaceOrder = async () => {
    try {
      const payableAmount = getPayable(cart);
      startPayment(payableAmount);
    } catch (e) {
      console.log(e);
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    completePurchase: () => {
      validateBeforePlaceOrder();
    },
  }));
});

export default CheckoutComUpiApplePay;
