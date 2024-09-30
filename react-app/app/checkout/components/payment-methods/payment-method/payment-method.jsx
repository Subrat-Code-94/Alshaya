import React from 'react';
import './payment-method.css';
import CheckoutComUpiApplePay from '../checkout-com-upi-apple-pay';
import { CheckoutComUpiContextProvider } from '../../../../../context/checkoutcomupi-context';

function PaymentMethod(props) {
  const {
    methodCode,
    method,
    onChangePaymentMethod,
    cart,
    paymentRef,
  } = props;

  return (
    <div className={`payment-method fadeInUp payment-method-${method.code}`} onClick={(e) => { e.stopPropagation(); onChangePaymentMethod(method.code); }} role="button" tabIndex="0" onKeyUp={(e) => e.key === 'Enter' && onChangePaymentMethod(method.code)}>
      <div className="payment-method-top-panel">
        <div className="payment-method-card">
          <input
            id={`payment-method-${methodCode}`}
            className="payment-method-radio"
            type="radio"
            checked={method.isSelected}
            value={methodCode}
            name="payment-method"
            onChange={() => onChangePaymentMethod(method.code)}
          />

          <label className="radio-sim radio-label" htmlFor={`payment-method-${methodCode}`}>
            {method.title}
          </label>
          <span dangerouslySetInnerHTML={{ __html: method.icon.innerHTML }} />
        </div>
        { (method.isSelected && method.code === 'checkout_com_upapi_applepay') ? (
          <CheckoutComUpiContextProvider>
            <CheckoutComUpiApplePay
              ref={paymentRef}
              cart={cart}
            />
          </CheckoutComUpiContextProvider>
        ) : '' }
      </div>
    </div>
  );
}

export default PaymentMethod;
