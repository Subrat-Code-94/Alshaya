import React, { useContext } from 'react';
import './billing-information.css';
import CartContext from '../../../../context/cart-context';
import DeliveryInformationHeader from '../delivery-information/delivery-information-header.jsx';

function BillingInformation() {
  const {
    cart,
    placeholders,
    deliveryInformation,
    setDeliveryInformation,
    setEditAddress,
  } = useContext(CartContext);

  const {
    billingAddressTitle = 'Billing Address',
  } = placeholders;

  const billingAddress = cart?.data?.extension_attributes?.cart?.billing_address;

  const handleChangeClick = (address) => {
    setEditAddress(address);
    setDeliveryInformation({
      ...deliveryInformation, isDialogOpen: true, isModalVisible: true, changeAddress: 'billing',
    });
  };

  // replace paymentMethods with payment component state
  const paymentMethods = [];

  const isCashOnDeliverySelected = paymentMethods?.find((method) => method.code === 'cashondelivery')?.isSelected || false;

  return (
    !isCashOnDeliverySelected && billingAddress?.firstname ? (
      <div className="checkout__billing-information">
        <div className="checkout__billing-information-title">
          {billingAddressTitle}
        </div>

        <div className="checkout__billing-information-wrapper">
          <div className="checkout__billing-information__header">
            <DeliveryInformationHeader
              shippingAddress={billingAddress}
              placeholders={placeholders}
              handleChangeClick={() => handleChangeClick(billingAddress)}
            />
          </div>
        </div>
      </div>
    ) : null
  );
}

export default BillingInformation;
