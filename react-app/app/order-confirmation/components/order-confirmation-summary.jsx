import React, { useState, useContext } from 'react';
import CartContext from '../../../context/cart-context.jsx';

function Chevron({ isExpanded, onClick }) {
  return (
    <span onClick={onClick} onKeyUp={(e) => e.key === 'Enter' && onClick()} style={{ cursor: 'pointer' }} role="button" tabIndex={0}>
      {isExpanded ? (
        <span className="accordian-chevron-up" />
      ) : (
        <span className="accordian-chevron-down" />
      )}
    </span>
  );
}

function SummaryItem({
  label,
  value,
  isAccordion = false,
  onClick,
  isExpanded,
}) {
  const summaryItemClass = isExpanded
    ? 'summary-item expanded-br'
    : 'summary-item';
  return (
    <div
      className={summaryItemClass}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{label}</span>
      {isAccordion ? (
        <Chevron onClick={onClick} isExpanded={isExpanded} />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

function AccordionItem({ label, name, value }) {
  return (
    <div
      className="summary-item"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <span>{label}</span>
      <span className="accordian-content">
        <span className="name">{name}</span>
        <span>{value}</span>
      </span>
    </div>
  );
}

function OrderConfirmationSummary() {
  const [isOrderDetailExpanded, setIsOrderDetailExpanded] = useState(false);
  const { placeholders } = useContext(CartContext);

  const orderData = {
    email: 'Albert@gmail.com',
    orderNumber: 'HMKWHDE0054078',
    transactionID: 'HMKWHDE0054078',
    paymentID: 'HMKWHDE0054078',
    resultCode: 'HMKWHDE0054078',
    orderDetail: 'Order details go here',
    customerName: 'Albert Singh',
    billingAddress: 'Your billing address',
    mobileNumber: '+123456789',
    paymentMethod: 'Credit Card',
    deliveryType: 'Standard Delivery',
    expectedDelivery: '3-5 business days',
    numberOfItems: 3,
    auraPoints: 100,
  };

  const toggleOrderDetailAccordion = () => {
    setIsOrderDetailExpanded(!isOrderDetailExpanded);
  };

  const handleContinueShooping = () => {
    window.location.href = `/${document.documentElement.lang}`;
  };

  return (
    <div className="order-confirmation-summary">
      <div className="order-confirmation-summary-main-title">
        <span>{placeholders.orderSuccessfullyReceived}</span>
      </div>
      <div className="order-confirmation-summary-main-content">
        <div className="heading">
          <span>{placeholders.orderSummaryTitle}</span>
        </div>
        <div className="summary">
          <SummaryItem
            label={placeholders.confirmationSentTo}
            value={orderData.email}
          />
          <SummaryItem
            label={placeholders.orderNumber}
            value={orderData.orderNumber}
          />
          <SummaryItem
            label={placeholders.transactionId}
            value={orderData.transactionID}
          />
          <SummaryItem
            label={placeholders.paymentId}
            value={orderData.paymentID}
          />
          <SummaryItem
            label={placeholders.resultCode}
            value={orderData.resultCode}
          />
          <SummaryItem
            label={placeholders.orderDetail}
            isAccordion
            onClick={toggleOrderDetailAccordion}
            isExpanded={isOrderDetailExpanded}
          />
          {isOrderDetailExpanded && (
            <>
              <AccordionItem
                label={placeholders.deliveryTo}
                name={orderData.customerName}
                value={orderData.orderDetail}
              />
              <AccordionItem
                label={placeholders.billingAddress}
                name={orderData.customerName}
                value={orderData.billingAddress}
              />
              <SummaryItem
                label={placeholders.mobileNumber}
                value={orderData.mobileNumber}
              />
              <SummaryItem
                label={placeholders.paymentMethod}
                value={orderData.paymentMethod}
              />
              <SummaryItem
                label={placeholders.deliveryType}
                value={orderData.deliveryType}
              />
              <SummaryItem
                label={placeholders.expecteDeliveryWithin}
                value={orderData.expectedDelivery}
              />
              <SummaryItem
                label={placeholders.numberOfItems}
                value={orderData.numberOfItems}
              />
              <SummaryItem
                label={placeholders.auraPointsEarned}
                value={orderData.auraPoints}
              />
            </>
          )}
        </div>
      </div>
      <div className="download-text">
        <span>
          To use your points online, please download the Aura MENA app available
          both on
          {' '}
          <b>App store</b>
          {' '}
          and
          {' '}
          <b>Play Store</b>
          {' '}
        </span>
      </div>
      <button type="button" className="continue-shooping" onClick={handleContinueShooping}>
        continue shopping
      </button>
    </div>
  );
}

export default OrderConfirmationSummary;
