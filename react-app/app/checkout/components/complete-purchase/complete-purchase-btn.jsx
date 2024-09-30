import React, { useContext } from 'react';
import './complete-purchase-btn.css';
import CartContext from '../../../../context/cart-context';

function CompletePurchase({ purchasePolicyText, paymentRef }) {
  const {
    placeholders,
  } = useContext(CartContext);

  return (
    <div className="complete_purchase_container">
      <div className="checkbox_confirm_text">
        <input className="checkbox_purchase" type="checkbox" />
        <span>{placeholders.completePurchaseCheckbox}</span>
      </div>
      <div>
        <p className="purchase_policy_text">
          {' '}
          <span dangerouslySetInnerHTML={{ __html: purchasePolicyText }} />
          {' '}
        </p>
      </div>
      <button
        id="cardPayButton"
        type="button"
        onClick={() => paymentRef.current.completePurchase()}
        className="complete_purchase_click"
      >
        <span className="text">{placeholders.completePurchaseButton}</span>
      </button>

    </div>

  );
}

export default CompletePurchase;
