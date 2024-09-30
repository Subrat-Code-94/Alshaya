import { resetMessageForm, showPageErrorMessage, showPageSuccessMessage } from './forms.js';
import { loadFragment } from './scripts.js';
import { showAddressForm } from '../blocks/account-address-book/account-address-book.js';
import {
  datalayerViewCartEvent, datalayerRemoveFromCartEvent,
  dataLayerCartErrorsEvent, dataLayerPromoCodeEvent,
} from './analytics/google-data-layer.js';

window.addEventListener('react:loadFragment', async (event) => {
  const fragment = await loadFragment(event.detail.path);
  if (fragment) {
    document.querySelector(event.detail.targetSelector)?.appendChild(fragment);
  }
});

window.addEventListener('react:showPageErrorMessage', (eve) => {
  showPageErrorMessage(eve.detail.message, '');
});

window.addEventListener('react:showPageSuccessMessage', (eve) => {
  showPageSuccessMessage(eve.detail.message, '');
});

window.addEventListener('react:resetPageMessage', () => {
  resetMessageForm();
});

window.addEventListener('react:loadAddressForm', async (event) => {
  const {
    targetSelector, placeholder, newCustomer, isCheckoutPage, address, isLoggedIn, config,
  } = event.detail;
  const updatedAddress = Object.keys(address).length === 0
    ? address
    : { ...address, address: address?.custom_attributes?.find((attribute) => attribute.attribute_code === 'address')?.value };
  showAddressForm(
    targetSelector,
    placeholder,
    updatedAddress,
    newCustomer,
    isCheckoutPage,
    isLoggedIn,
    config,
  );
});

window.addEventListener('react:datalayerViewCartEvent', (event) => {
  datalayerViewCartEvent(event.detail);
});

window.addEventListener('react:datalayerRemoveFromCartEvent', (event) => {
  datalayerRemoveFromCartEvent(event.detail);
});

window.addEventListener('react:dataLayerCartErrorsEvent', (event) => {
  dataLayerCartErrorsEvent(event.detail);
});

window.addEventListener('react:dataLayerPromoCodeEvent', (event) => {
  dataLayerPromoCodeEvent(event.detail);
});
