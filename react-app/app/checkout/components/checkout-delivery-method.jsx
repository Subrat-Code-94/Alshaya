import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../../context/cart-context.jsx';
import { getConfigValue } from '../../../../scripts/configs.js';
import CheckoutMethodOption from './checkout-method-option/checkout-method-option.jsx';
import CheckoutHomeDeliveryModal from './checkout-home-delivery-modal.jsx';
import Dialog from '../../../shared/dialog/dialog.jsx';
import { getCustomer } from '../../../../scripts/customer/api.js';
import CollectionStore from './collection-store/collection-store.jsx';

function CheckoutDeliveryMethod({ onSelectedMethodChange }) {
  const {
    placeholders, cart, isLoggedIn, deliveryInformation, setDeliveryInformation, setUserAddressList,
  } = useContext(CartContext);
  const [hideClickAndCollect, setHideClickAndCollect] = useState(false);
  const [isGlobalClickCollectDisabled, setIsGlobalClickCollectDisabled] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('home_delivery');

  const {
    deliveryMethodTitle = '',
    homeDelivery = '',
    clickCollect = '',
    homeDeliveryTitle = '',
    clickCollectTitle = '',
    clickCollectDisabled = '',
    deliveryInformationTitle = '',
    deliveryInformationBtnText = '',
    collectionStoreTitle = '',
    collectionStoreBtnText = '',
  } = placeholders;

  const items = cart?.data?.items;
  const isMultiBrandCart = cart?.data?.extension_attributes?.cart?.extension_attributes?.is_multi_brand_cart ?? false;
  const isShippingAddressAvailable = !!cart?.data?.extension_attributes?.cart?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.firstname;

  const fetchGlobalConfig = async () => {
    const isDisabled = await getConfigValue('global-click-collect-disabled');
    setIsGlobalClickCollectDisabled(isDisabled === 'true');
  };

  const determineHideClickAndCollect = () => {
    if (items && !isGlobalClickCollectDisabled) {
      const shouldHide = items.some((item) => item?.configured_variant?.reserve_and_collect === 2 && item?.configured_variant?.ship_to_store === 2);
      setHideClickAndCollect(shouldHide);
    }
  };

  useEffect(() => {
    fetchGlobalConfig();
    determineHideClickAndCollect();

    const getSavedAddress = async () => {
      const customer = await getCustomer();
      if (customer) {
        const defaultShippingAddress = customer?.addresses?.find((address) => address.id === parseInt(customer.default_shipping, 10));
        if (defaultShippingAddress) {
          setUserAddressList(customer.addresses);
        }
      }
    };

    if (isLoggedIn) {
      getSavedAddress();
    }
  }, [items]);

  const handleDeliveryMethodChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMethod(selectedValue);
    onSelectedMethodChange(selectedValue);
  };

  const handleButtonClick = () => {
    if (selectedMethod === 'home_delivery') setDeliveryInformation({ ...deliveryInformation, isDialogOpen: true, isModalVisible: true });
    else {
      // Add your collection store logic here
      setDeliveryInformation({ ...deliveryInformation, isDialogOpen: true });
    }
  };

  const handleCloseDialog = () => setDeliveryInformation({ ...deliveryInformation, isDialogOpen: false });

  const isClickAndCollectDisabled = isGlobalClickCollectDisabled || hideClickAndCollect || isMultiBrandCart;

  const deliveryMethods = [
    {
      id: 1,
      subTitle: homeDelivery,
      title: homeDeliveryTitle,
      icon: 'home-delivery',
      value: 'home_delivery',
    },
    {
      id: 2,
      subTitle: clickCollect,
      title: isClickAndCollectDisabled ? clickCollectDisabled : clickCollectTitle,
      icon: 'click-collect',
      value: 'click_and_collect',
      isDisabled: isClickAndCollectDisabled,
    },
  ];

  const headerClassName = 'dialog__header-checkout';

  return (
    <>
      <div className="checkout__delivery-methods-container">
        <div className="checkout-title">
          {deliveryMethodTitle}
        </div>
        <div className="checkout__delivery-methods-wrapper">
          {deliveryMethods.map((method) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <CheckoutMethodOption key={method.id} name="delivery-method" selectedMethod={selectedMethod} handleDeliveryMethodChange={handleDeliveryMethodChange} {...method} />
          ))}
        </div>
      </div>
      <div className="checkout__delivery-information">
        <div className="checkout__delivery-information-title">
          {selectedMethod === 'home_delivery' ? deliveryInformationTitle : collectionStoreTitle}
        </div>
        {selectedMethod === 'home_delivery' && !isShippingAddressAvailable && (
          <button type="button" className="checkout__delivery-information-btn" onClick={handleButtonClick}>
            {deliveryInformationBtnText}
          </button>
        )}
        {selectedMethod !== 'home_delivery' && (
          <button type="button" className="checkout__delivery-information-btn" onClick={handleButtonClick}>
            {collectionStoreBtnText}
          </button>
        )}
      </div>
      <Dialog
        isOpen={deliveryInformation.isDialogOpen}
        onClose={handleCloseDialog}
        headerClassName={headerClassName}
        containerClassName="dialog__checkout-container"
      >
        {selectedMethod === 'home_delivery' && <CheckoutHomeDeliveryModal isVisible={deliveryInformation.isModalVisible} onClose={handleCloseDialog} />}
        {selectedMethod === 'click_and_collect' && <CollectionStore />}
      </Dialog>
    </>
  );
}

export default CheckoutDeliveryMethod;
