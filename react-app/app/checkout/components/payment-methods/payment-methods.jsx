import React, { useEffect, useState, useContext } from 'react';
import PaymentMethod from './payment-method/payment-method';
import CartContext from '../../../../context/cart-context';
import './payment-methods.css';

function PaymentMethods({ paymentMethods, paymentRef }) {
  const [methods, setMethods] = useState([]);
  const {
    cart, placeholders,
  } = useContext(CartContext);

  useEffect(() => {
    const availablePayments = cart.data.available_payment_methods || [];
    if (paymentMethods) {
      let paymentMethodsJson = [];
      Object.values(paymentMethods).forEach((method) => {
        const [key, isDefaultSelected, content, icon] = method.querySelectorAll('td');
        if (availablePayments.find((available) => available.code === key.innerHTML)) {
          const metaData = {};
          if (isDefaultSelected.innerHTML) {
            metaData.isSelected = true;
          }
          metaData.icon = icon;
          metaData.code = key.innerHTML;
          const methodContents = content.querySelectorAll('p');
          if (methodContents.length) {
            const [title, ...body] = methodContents;
            metaData.title = title.innerHTML;
            metaData.body = body;
          } else {
            metaData.title = content.innerHTML;
          }
          paymentMethodsJson = paymentMethodsJson.concat(metaData);
        }
      });
      setMethods(paymentMethodsJson);
    }
  }, [paymentMethods]);

  // const animationInterval = 0.4 / Object.keys(activePaymentMethods).length;

  function onChangePaymentMethod(methodCode) {
    const updatedMethods = methods.map((method) => {
      if (method.code === methodCode) {
        method.isSelected = true;
      } else {
        method.isSelected = false;
      }
      return method;
    });
    setMethods(updatedMethods);
  }

  return (
    <div id="spc-payment-methods" className="spc-checkout-payment-options fadeInUp">
      <div className="spc-checkout-section-title fadeInUp payment-method-title">{placeholders?.paymentMethodsTitle}</div>
      {Array.from(methods).map((method) => (
        <PaymentMethod
          key={method.code}
          method={method}
          onChangePaymentMethod={(methodCode) => onChangePaymentMethod(methodCode)}
          paymentRef={paymentRef}
          cart={cart}
        />
      ))}
    </div>
  );
}
export default PaymentMethods;
