import React, { useRef, useState } from 'react';
import CheckoutDeliveryMethod from './checkout-delivery-method.jsx';
import './checkout.css';
import DeliveryInformation from './delivery-information/delivery-information.jsx';
import OrderSummary from './order-summary/order-summary.jsx';
import PaymentMethods from './payment-methods/payment-methods.jsx';
import BillingInformation from './billing-information/billing-information.jsx';
import CompletePurchase from './complete-purchase/complete-purchase-btn.jsx';

function Checkout({ content }) {
  const [selectedMethod, setSelectedMethod] = useState('home_delivery');
  const paymentRef = useRef();
  return (
    <div className="checkout__shopping-block">
      <div className="checkout__container">
        <CheckoutDeliveryMethod onSelectedMethodChange={setSelectedMethod} />
        {selectedMethod === 'home_delivery' ? <DeliveryInformation /> : null}
        <PaymentMethods paymentMethods={content.paymentMethods} paymentRef={paymentRef} />
        <BillingInformation />
        <CompletePurchase purchasePolicyText={content.purchasePolicyText} paymentRef={paymentRef} />
      </div>
      <div className="order-summary-container">
        <OrderSummary isAddress isCOD={selectedMethod === 'home_delivery'} content={content} />
      </div>
    </div>
  );
}

export default Checkout;
