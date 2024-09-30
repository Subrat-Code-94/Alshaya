import React, { useContext } from 'react';
import CartContext from '../../../context/cart-context.jsx';
import ProgressBar from '../../../shared/progress-bar/progress-bar.jsx';
import useGetCartGraphql from '../../../api/getCartGraphql.js';
import Loader from '../../../shared/loader/loader.jsx';
import EmptyCart from '../../../shared/empty-cart/empty-cart.jsx';
import CONSTANTS from '../../../utils/app-constants.js';
import OrderConfirmation from './order-confirmation.jsx';

/**
 * App Component.
 * @param {string} [content] block content from sharepoint docx
 * @param {string} [placeholders] locale based placeholders coming from placeholders.xlsx
 */

function App({ content }) {
  useGetCartGraphql();

  const { activeProgressStep } = useContext(CartContext);
  const { cartId, cart } = useContext(CartContext);
  const items = cart?.data?.items;

  if (cart.isLoading) return <Loader />;

  if (!cartId || !items?.length) {
    return (
      <EmptyCart />
    );
  }

  return (
    <>
      <ProgressBar />
      <div className="cart__checkout__blocks">
        {activeProgressStep === CONSTANTS.CONFIRMATION_STEP && <OrderConfirmation content={content} />}
      </div>
    </>
  );
}

export default App;
