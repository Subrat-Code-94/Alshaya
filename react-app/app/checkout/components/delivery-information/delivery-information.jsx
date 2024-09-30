import React, { useContext, useEffect, useState } from 'react';
import './delivery-information.css';
import CheckoutMethodOption from '../checkout-method-option/checkout-method-option';
import CartContext from '../../../../context/cart-context';
import { formatPrice } from '../../../../utils/base-utils';
import estimateShippingMethods from '../../../../api/estimateShippingMethods';
import Loader from '../../../../shared/loader/loader';
import { getConfigValue } from '../../../../../scripts/configs';
import DeliveryInformationHeader from './delivery-information-header';

function DeliveryInformation() {
  const {
    cart, cartId, isLoggedIn, placeholders, deliveryInformation, setDeliveryInformation, setEditAddress,
  } = useContext(CartContext);
  const [selectedMethod, setSelectedMethod] = useState();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [currency, setCurrency] = useState('');

  const availableShippingMethods = deliveryInformation.shippingMethods;
  const shipping = cart?.data?.extension_attributes?.cart?.extension_attributes?.shipping_assignments?.[0]?.shipping;
  const shippingAddress = shipping?.address;

  const getFormattedPrice = async (amount) => {
    let price = placeholders.shippingMethodFreeLabel;
    if (amount) {
      price = await formatPrice(currency, amount);
    }
    return price;
  };

  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (availableShippingMethods) {
        const methods = await Promise.all(
          availableShippingMethods
            .filter((method) => method.method_code !== 'click_and_collect')
            .map(async (method, index) => ({
              id: index + 1,
              title: method.method_title,
              subTitle: method.carrier_title,
              value: `${method.carrier_code}_${method.method_code}`,
              subTitleRight: await getFormattedPrice(method.amount),
              info: method.error_message,
              isDisabled: !method.available,
            })),
        );
        setShippingMethods(methods);
      }
    };

    fetchShippingMethods();
  }, [availableShippingMethods]);

  useEffect(() => {
    const fetchCurrency = async () => {
      const configValue = await getConfigValue('currency');
      setCurrency(configValue);
    };
    fetchCurrency();
  }, []);

  const getShippingMethods = async () => {
    if (shippingAddress?.firstname) {
      setDeliveryInformation({ ...deliveryInformation, isLoadingShippingMethods: true });
      const shippingBody = {
        address: shippingAddress,
      };
      const allShippingMethods = await estimateShippingMethods(shippingBody, cartId, isLoggedIn);
      setDeliveryInformation({ ...deliveryInformation, shippingMethods: (allShippingMethods ?? []), isLoadingShippingMethods: false });
    }
  };

  useEffect(() => {
    getShippingMethods();
  }, [shippingAddress]);

  useEffect(() => {
    setSelectedMethod(shipping?.method);
  }, [shipping?.method]);

  const handleDeliveryMethodChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMethod(selectedValue);
  };

  const renderShippingMethods = () => {
    const filteredShippingMethods = shippingMethods?.filter((method) => !method.isHidden) ?? [];
    return filteredShippingMethods.map((method, index) => (
      <React.Fragment key={`shipping-method-${method.id}`}>
        <CheckoutMethodOption
          className="checkout__shipping-method-option"
          name="shipping-method"
          selectedMethod={selectedMethod}
          handleDeliveryMethodChange={handleDeliveryMethodChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...method}
        />
        {index < filteredShippingMethods.length - 1 && <div className="divider" />}
      </React.Fragment>
    ));
  };

  const handleChangeClick = (address) => {
    setEditAddress(address);
    setDeliveryInformation({
      ...deliveryInformation, isDialogOpen: true, isModalVisible: true, changeAddress: 'shipping',
    });
  };

  return (
    (shippingAddress?.firstname || availableShippingMethods?.length) ? (
      <div className="checkout__delivery-information__wrapper">
        {
          shippingAddress?.firstname
            ? (
              <DeliveryInformationHeader
                shippingAddress={shippingAddress}
                placeholders={placeholders}
                handleChangeClick={() => handleChangeClick(shippingAddress)}
              />
            )
            : null
        }
        {
            deliveryInformation.isLoadingShippingMethods
              ? <Loader />
              : availableShippingMethods?.length && (
              <>
                <div className="divider" />
                {renderShippingMethods()}
              </>
              )
        }
      </div>
    ) : null
  );
}

export default DeliveryInformation;
