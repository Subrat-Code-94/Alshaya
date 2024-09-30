/* TODO: WIP and Eslints will be fixed with story completion */
/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../../context/cart-context.jsx';
import Loader from '../../../shared/loader/loader.jsx';
import estimateShippingMethods from '../../../api/estimateShippingMethods.js';
import { getConfigValue } from '../../../../scripts/configs.js';
import updateCart from '../../../api/updateCart.js';
import DeliveryInformationHeader from './delivery-information/delivery-information-header.jsx';
import Icon from '../../../library/icon/icon.jsx';

const CheckoutHomeDeliveryModal = ({ isVisible, onClose }) => {
    const { placeholders, cartId, isLoggedIn, cart, setCart, deliveryInformation, setDeliveryInformation, userAddressList, editAddress, setEditAddress } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddressForm, setNewAddressForm] = useState(true);
    const shippingAddress = cart?.data?.extension_attributes?.cart?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address;

  const {
    deliveryInformationModalTitle = '',
    changeAddressModalTitle = '',
    addNewAddress = '',
  } = placeholders;

    useEffect(() => {
        setShowAddressForm(!userAddressList?.length);
    }, [userAddressList]);

    useEffect(() => {
        if (showAddressForm) {
          const isNewForm = !editAddress;
          triggerLoadFormEvent(isNewForm);
        }
        else {
            setLoading(false);
        }
    }, [loading]);

    const loadAddressForm = (isNewForm, address = {}) => {
        setNewAddressForm(isNewForm);
        setEditAddress(address);
        setShowAddressForm(true);
        setLoading(true);
    };

    const triggerLoadFormEvent = async (newAddressForm = true) => {
        const checkoutHomeDelivery = document.getElementById('checkout-home-delivery');
        const endpoint = await getConfigValue('apimesh-endpoint');
        const config = {
          endpoint
        };
        window.dispatchEvent(new CustomEvent('react:loadAddressForm',
            {
                detail: {
                    targetSelector: checkoutHomeDelivery,
                    placeholder: placeholders,
                    newCustomer: true,
                    isCheckoutPage: true,
                    // address: newAddressForm ? {} : shippingAddress
                    address: newAddressForm ? {} : editAddress,
                    isLoggedIn,
                    config
                }
            }
        ));
    };

    useEffect(() => {
        const handleAddressFormLoaded = () => {
            setLoading(false);
        };

        const handleAddressFormSubmitted = async (event) => {
          if (deliveryInformation.changeAddress === 'billing') {
            const addressPayload = createAddressPayload(event.detail);
            await invokeUpdateCart(null, addressPayload, deliveryInformation.changeAddress);
            if (onClose) onClose();

            return;
          }

          invokeUpdateShippingAddress(event.detail);
        };

        window.addEventListener('react:addressFormLoaded', handleAddressFormLoaded);
        window.addEventListener('react:addressFormSubmitted', handleAddressFormSubmitted);

        return () => {
            window.removeEventListener('react:addressFormLoaded', handleAddressFormLoaded);
            window.removeEventListener('react:addressFormSubmitted', handleAddressFormSubmitted);
        };
    }, []);
    
    const selectAddress = async (event, arg1) => {

      const addressListDiv = document.querySelector('.delivery-information__address-list');
      const buttons = addressListDiv.querySelectorAll('button');
      buttons.forEach(button => button.setAttribute('disabled', 'true'));
      event.target.classList.add('loader');

      const { region, street, id, ...rest } = arg1;
      const addr = {
        address: {
          ...rest,
          // street: street[0]
          street
        }
      };

      if (deliveryInformation.changeAddress === 'billing') {
        addr.address.customer_address_id = id;
        await invokeUpdateCart(null, addr, deliveryInformation.changeAddress);
        if (onClose) onClose();

        return;
      }

      await invokeUpdateShippingAddress(addr);
    };

    const createAddressPayload = (arg1) => {
      const isAddrAttribute = arg1?.address?.custom_attributes?.find(
        (attribute) => attribute.attribute_code === 'address'
      );

      let customAttributes = arg1?.address?.custom_attributes || [];

      if (!isAddrAttribute) {
        customAttributes = [...arg1?.address?.custom_attributes, {
            attribute_code: 'address',
            name: 'address',
            value: arg1?.address?.address
        }];
      }

      const { country_code, id, customer_id, ...addressWithoutCountryCode } = arg1.address;
      const addressPayload = {
          address: {
              ...addressWithoutCountryCode,
              country_id: country_code || addressWithoutCountryCode.country_id,
              street: [addressWithoutCountryCode.street],
              custom_attributes: customAttributes
          }
      };

      return addressPayload;
    };

    const invokeUpdateShippingAddress = async (arg1) => {
      const addressPayload = createAddressPayload(arg1);
      // email validation - validateInfo();
      const availableShippingMethods = await estimateShippingMethods(addressPayload, cartId, isLoggedIn);
      setDeliveryInformation({ ...deliveryInformation, shippingMethods: (availableShippingMethods ?? []) });
      const firstShippingMethod = availableShippingMethods.find((method) => method.available) ?? null;

      await invokeUpdateCart(firstShippingMethod, addressPayload, 'shipping');
      await invokeUpdateCart(null, addressPayload, 'billing');

      if (onClose) onClose();
    };

    const invokeUpdateCart = async (firstShippingMethod, addressPayload, addressType) => {
      const createAddressBody = (type, action, additionalFields = {}) => ({
        [type]: {
          ...(type !== 'shipping' && addressPayload.address),
          ...additionalFields,
        },
        extension: {
          action,
        },
      });

      let addressBody;
      if (addressType === 'billing') {
        addressBody = createAddressBody('billing', 'update billing');
      } else if (firstShippingMethod) {
        const { carrier_code, method_code } = firstShippingMethod;
        addressBody = createAddressBody('shipping', 'update shipping', {
          shipping_carrier_code: carrier_code,
          shipping_method_code: method_code,
          shipping_address: {
            ...addressPayload.address,
          },
        });
      } else {
        console.log('No shipping methods available');
        return;
      }
      const response = await updateCart(addressBody, cartId, isLoggedIn);
      if (response?.response_message?.[1] === 'success') {
        setCart((prevCart) => ({
          ...prevCart,
          data: {
            ...prevCart.data,
            extension_attributes: {
              ...prevCart.data.extension_attributes,
              cart: {
                ...prevCart.data.extension_attributes.cart,
                billing_address: response.cart?.billing_address,
                extension_attributes: {
                  ...prevCart.data.extension_attributes.cart.extension_attributes,
                  shipping_assignments: response.cart?.extension_attributes?.shipping_assignments,
                },
              },
            },
          },
        }));
      }
    };

    const renderLoader = () => (
      <div className="dialog-loader">
        <Loader />
      </div>
    );

    const renderAddressList = () => (
      <div className='delivery-information__address-container'>
          <button className='secondary delivery-information__new-address' onClick={() => loadAddressForm(true)}>{addNewAddress}</button>
          <div className="delivery-information__address-list">
            {
              userAddressList.length ? (
                userAddressList.map((address) => (
                  <DeliveryInformationHeader
                      key={address.id}
                      shippingAddress={address}
                      placeholders={placeholders}
                      handleSelectClick={(event) => selectAddress(event, address)}
                      {...(deliveryInformation.changeAddress !== 'billing' && { handleEditClick: () => loadAddressForm(false, address) })}
                  />
                ))
              ) : null
            }
          </div>
      </div>
  );

  if (!isVisible) return null;

  const isAddressList = userAddressList && !showAddressForm;

  const backToAddressList = () => {
    // setShowAddressForm(false);
    // setLoading(true);
  };

  console.log(isAddressList);
  const shouldShowBackButton = !isAddressList && isLoggedIn;

  return (
    <>
      <div className="dialog-heading">
        <h2>
          {shouldShowBackButton && (
            <Icon 
              name="arrow-left"
              className="dialog-back-icon hidden"
              onIconClick={backToAddressList}
            />
          )}
          {isAddressList ? changeAddressModalTitle : deliveryInformationModalTitle}
        </h2>
      </div>

      {loading && renderLoader()}

      {
        isAddressList
            ? renderAddressList()
            : <div id="checkout-home-delivery" className='dialog-form'></div>
      }
    </>
  );
}

export default CheckoutHomeDeliveryModal;
