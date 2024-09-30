import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app.jsx';
import '../cart/index.css';
import './index.css';
import fetchPlaceholdersForLocale from '../../utils/placeholders.js';
import {
  CartContextProvider,
  INIT_PLACEHOLDERS,
} from '../../context/cart-context.jsx';

export default async function decorate(block) {
  // render React components
  const langCode = document.documentElement.lang;
  const placeholders = await fetchPlaceholdersForLocale(
    langCode ? `/${langCode}` : '',
    'sheet=cart',
  );
  const root = createRoot(block);

  const [messageContentConatiner] = block.querySelectorAll(
    '.order-confirmation > div',
  );
  const thanksConfirmationMessage = messageContentConatiner.querySelectorAll('p');

  let content = {
    thanksMessageText: '',
    confirmationText: '',
    printConfirmation: '',
  };

  const [thanksMessageText, confirmationText, printConfirmation] = thanksConfirmationMessage;

  content = {
    thanksMessageText: thanksMessageText ? thanksMessageText.innerText : '',
    confirmationText: confirmationText ? confirmationText.innerText : '',
    printConfirmation: printConfirmation ? printConfirmation.innerText : '',
  };

  root.render(
    <CartContextProvider
      placeholders={{ ...INIT_PLACEHOLDERS, ...placeholders }}
    >
      <App content={content} />
    </CartContextProvider>,
  );
}
