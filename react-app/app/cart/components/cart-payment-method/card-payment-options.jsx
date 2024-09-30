import React from 'react';
import './card-payment-options.css';
import { getRandomNumber } from '../../../../utils/base-utils';

function CardPaymentOptions({ cardMethodTitle, paymentLogoList }) {
  if (!cardMethodTitle || !paymentLogoList) {
    return null;
  }

  return (
    <div id="payment_method_logos" className="payment_method_logos_blocks">
      <div className="payment_logos_title">{cardMethodTitle}</div>
      <div className="payment_logos">
        <div className="logos_bar">
          {Array.from(paymentLogoList).map((item) => <span key={`card-payment-option-${getRandomNumber()}`} dangerouslySetInnerHTML={{ __html: item.innerHTML }} />)}
        </div>
      </div>
    </div>
  );
}

export default CardPaymentOptions;
