import React from 'react';
import OrderConfirmationSummary from './order-confirmation-summary';
import OrderConfirmationItemBillSummary from './order-confirmation-item-bill-summary';

function OrderConfirmation({ content }) {
  const handlePrintconfitmation = () => {
    window.print();
  };

  return (
    <div className="order__confirmation-block">
      <div className="oredr__confirmation-header">
        <span className="thanks-message">
          {content.thanksMessageText}
        </span>
        <span className="confirmation-message">
          {content.confirmationText}
        </span>
        <div
          className="order-print-confirmation"
          onClick={handlePrintconfitmation}
          onKeyUp={(e) => e.key === 'Enter' && handlePrintconfitmation()}
          role="button"
          tabIndex={0}
        >
          {content.printConfirmation}
        </div>
      </div>
      <div className="order__confirmation-summary">
        <div className="order__confirmation-details-info">
          <OrderConfirmationSummary />
        </div>
        <div className="order__confirmation-details-sidebar">
          <OrderConfirmationItemBillSummary />
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
