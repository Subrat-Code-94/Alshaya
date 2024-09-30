import React, { createContext, useEffect, useState } from 'react';
import { getSignInToken } from '../../scripts/commerce.js';
import getLocalStorageByKey from '../utils/local-storage-util.js';
import { getConfigValue } from '../../scripts/configs.js';
import CONSTANTS from '../utils/app-constants.js';

export const INIT_PLACEHOLDERS = {
  moveToFav: 'Move to favorites',
  promoBtn: 'Done',
  productArtNo: 'Art. no.',
  productColorLabel: 'Color label',
  productSize: 'Size',
  excludingDelivery: 'Excluding delivery',
  deleteSuccess: 'The product has been removed from your basket',
  inclusiveVat: 'Inclusive of VAT',
  deleteitempopupmessage: 'Do you want to move this item to favorites?',
  itemmovetofavtext: 'Yes, Move to favorites',
  itemremovetext: 'No, remove it',
  emptyCartMessage: 'Your shopping bag is empty',
  emptyCartFavMessage: 'Here are some of our favorites',
  productPriceSaveLabel: 'save',
  orderSummaryTitle: 'Order Summary',
  subTotalLabel: 'Subtotal',
  discountsLabel: 'Discounts',
  orderTotalLabel: 'Order Total',
  bagUpdatedSuccessLabel: 'Your bag has been updated successfully',
  quantityNotAvailableLabel: 'The requested quantity is not available',
  deliveryMethodTitle: 'Delivery method',
  homeDelivery: 'Home Delivery',
  clickCollect: 'Click & Collect',
  bagLabel: 'Bag',
  signInLabel: 'Sign In',
  deliveryPaymentLabel: 'Delivery & Payment',
  confirmationLabel: 'Confirmation',
  promotionLabel: 'Do you have a Promotional Code?',
  promotionInputPlaceholder: 'Promo code',
  promotionApplyButtonLabel: 'Apply',
  promotionAppliedButtonLabel: 'Applied',
  promotionRequiredValidationErrorMessage: 'Please enter a promotional code',
  promotionDiscountAndVouchersLabel: 'Discounts & Vouchers',
  promotionInvalidCodeMessage: 'Sorry, this code is invalid. Please enter a valid promotional code.',
  discountLabel: 'Discount',
  bonusVouchers: 'Bonus Vouchers',
  memberOffers: 'Member Offers',
  clearAllText: 'CLEAR ALL',
  applyOffersText: 'APPLY OFFERS',
  applyVouchersText: 'APPLY VOUCHERS',
  checkoutAsGuest: 'Checkout as a Guest',
  backToBasket: 'Back to basket',
  sepratorOrLabel: 'OR',
  signInEmail: 'sign in with email address',
  signInSocial: 'sign in with social media',
  checkoutBtn: 'Continue to Checkout',
  outOfStockContent: 'This product is out of stock',
  outOfStockToast: 'Sorry, one or more products in your bag are no longer available. Please review your bag in order to checkout securely.',
  shippingMethodFreeLabel: 'FREE',
  changeDeliveryAddressCta: 'Change',
  confirmationSentTo: 'Confirmation sent to:',
  orderNumber: 'Order Number:',
  transacioId: 'Transaction ID:',
  paymentId: 'Payment ID:',
  resultCode: 'Result Code:',
  orderDetail: 'Order Detail',
  deliveryTo: 'Delivery to:',
  billingAddress: 'Billing Address:',
  mobileNumber: 'Mobile Number:',
  paymentMethod: 'Payment Method:',
  deliveryType: 'Delivery Type:',
  expecteDeliveryWithin: 'Expected Delivery Within:',
  numberOfItems: 'Number of Items:',
  auraPointsEarned: 'Aura Points Earned:',
  homeDeliveryTitle: 'Free delivery on all orders above QAR 199.',
  clickCollectTitle: 'Order now & collect from store of your choice',
  clickCollectDisabled: 'Collect your order in-store is unavailable',
  deliveryInformationTitle: 'Delivery Information',
  deliveryInformationBtnText: 'Please add your contact details and address → →',
  deliveryInformationModalTitle: 'Delivery Information',
  collectionStoreTitle: 'Collection Store',
  collectionStoreBtnText: 'Select your preferred collection store',
  styleText: 'Style',
  sendToText: 'Send to',
  customMessageEgift: 'Message',
  egiftcardtext: 'eGift Card',
  egiftGetcode: 'Get Code',
  egiftCardInputTitle: 'eGift Card Number',
  cashOnDeliveryLabel: 'Cash on delivery service charge',
  egiftCardInputPlaceholder: 'Enter verification code',
  discountTooltipMessageApplied: 'Discount applied',
  discountTooltipMessageMemberDiscount: 'Member Discount',
  discountTooltipMessageAdvantageCardDiscount: 'Advantage Card Discount',
  memberOffersApplied: 'Member offers applied',
  bonusVouchersApplied: 'Bonus voucher applied',
  bonusVouchersExpiresOn: 'Expires On',
  bonusVoucherAppliedLabel: 'voucher applied',
  paymentMethodsTitle: 'Payment Methods',
  freeGiftLabel: 'Free gift with Purchase',
};

const INIT_CART_CONTEXT_VALUES = {
  isLoggedIn: false,
  cart: {
    cartId: null,
    data: {},
    isLoading: false,
    isError: false,
    oosDisable: false,
    isCheckoutFlag: true,
  },
  promotion: {
    isApplyingPromoCode: false,
    isRemovingPromoCode: false,
    errorMessage: '',
    data: {},
  },
  activeProgressStep: 1,
  store: null,
  deliveryInformation: {
    isDialogOpen: false,
    isModalVisible: false,
    isLoadingShippingMethods: false,
    shippingMethods: [],
    changeAddress: '',
  },
  userAddressList: [],
  editAddress: {},
};

/**
 * Cart Context is used to share data between components of the cart
 */
const CartContext = createContext(INIT_CART_CONTEXT_VALUES);

export function CartContextProvider(props) {
  // add the state variables that needs to be shared accross components
  const [cart, setCart] = useState(INIT_CART_CONTEXT_VALUES.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getSignInToken());
  const [cartId, setCartId] = useState(INIT_CART_CONTEXT_VALUES.cart.cartId);
  const [placeholders, setPlaceholders] = useState(props?.placeholders);
  const [activeProgressStep, setActiveProgressStep] = useState(INIT_CART_CONTEXT_VALUES.activeProgressStep);
  const [priceDecimals, setPriceDecimals] = useState(INIT_CART_CONTEXT_VALUES.store);
  const [cartShowFreeReturns, setCartShowFreeReturns] = useState(INIT_CART_CONTEXT_VALUES.store);
  const [promotion, setPromotion] = useState(INIT_CART_CONTEXT_VALUES.promotion);
  const [deliveryInformation, setDeliveryInformation] = useState(INIT_CART_CONTEXT_VALUES.deliveryInformation);
  const [userAddressList, setUserAddressList] = useState(INIT_CART_CONTEXT_VALUES.deliveryInformation);
  const [oosDisableButton, setOOSDisableButton] = useState(INIT_CART_CONTEXT_VALUES.cart.oosDisable);
  const [isCheckoutFlag, setIsCheckoutFlag] = useState(INIT_CART_CONTEXT_VALUES.cart.isCheckoutFlag);
  const [editAddress, setEditAddress] = useState(INIT_CART_CONTEXT_VALUES.cart.editAddress);
  const outOfStockData = cart?.data?.items?.filter((item) => item?.extensionAttributes?.extension_attributes?.is_egift !== '1' && !item?.extensionAttributes?.extension_attributes?.is_free_gift && item?.extensionAttributes?.extension_attributes?.error_message);
  const maxQuantityCheck = cart?.data?.items?.filter((item) => item?.extensionAttributes?.extension_attributes?.is_egift !== '1' && !item?.extensionAttributes?.extension_attributes?.is_free_gift && item?.isQuantityNotAvailable);
  useEffect(() => {
    switch (window.location.pathname) {
      case `/${document.documentElement.lang}/cart`:
        setActiveProgressStep(CONSTANTS.CART_STEP);
        break;
      case `/${document.documentElement.lang}/cart/login`:
        if (isLoggedIn) {
          window.location.assign(`/${document.documentElement.lang}/checkout`);
          break;
        }
        if (window.location.search !== `?redirect=/${document.documentElement.lang}/checkout`) {
          window.location.assign(`/${document.documentElement.lang}/cart/login?redirect=/${document.documentElement.lang}/checkout`);
        }
        setActiveProgressStep(CONSTANTS.LOGIN_STEP);
        break;
      case `/${document.documentElement.lang}/checkout`:
        setActiveProgressStep(CONSTANTS.CHECKOUT_STEP);
        break;
      case `/${document.documentElement.lang}/confirmation`:
        setActiveProgressStep(CONSTANTS.CONFIRMATION_STEP);
        break;
      default:
        setActiveProgressStep(CONSTANTS.CART_STEP);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setPlaceholders(props?.placeholders);
  }, [props?.placeholders]);

  useEffect(() => {
    setIsLoggedIn(!!getSignInToken());
  }, [getSignInToken]);

  /**
   * Set the masked cart id for guest from local storage.
   * Set the masked cart id for logged in customer from the cart
   * object as the local storage does not have masked cart id
   */
  useEffect(() => {
    const storage = getLocalStorageByKey('M2_VENIA_BROWSER_PERSISTENCE__cartId');
    setCartId(storage);

    const maskedCartId = cart?.data?.id ?? null;
    if (maskedCartId) {
      setCartId(maskedCartId);
    }
  }, [setCartId, isLoggedIn, cart]);

  useEffect(() => {
    const fetchStoreCode = async () => {
      const storeCodeVal = await getConfigValue('cart-price-decimals');
      const cartShowFreeReturn = await getConfigValue('cart-show-free-returns');
      setPriceDecimals(storeCodeVal);
      setCartShowFreeReturns(cartShowFreeReturn === 'true');
    };
    fetchStoreCode();
  }, []);

  useEffect(() => {
    if (outOfStockData?.length > 0 || maxQuantityCheck?.length > 0 || !isCheckoutFlag) {
      setOOSDisableButton(true);
    } else {
      setOOSDisableButton(false);
    }
  }, [cart, oosDisableButton, isCheckoutFlag]);
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CartContext.Provider value={{
      isLoggedIn,
      cartId,
      cart,
      setCart,
      placeholders,
      activeProgressStep,
      setActiveProgressStep,
      priceDecimals,
      promotion,
      setPromotion,
      deliveryInformation,
      setDeliveryInformation,
      userAddressList,
      setUserAddressList,
      cartShowFreeReturns,
      oosDisableButton,
      setOOSDisableButton,
      setIsCheckoutFlag,
      isCheckoutFlag,
      editAddress,
      setEditAddress,
    }}
    >
      {props?.children}
    </CartContext.Provider>
  );
}

export default CartContext;
