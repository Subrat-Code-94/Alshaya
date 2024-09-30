import { useCallback, useContext, useEffect } from 'react';
import { getGraphqlClient } from '../utils/api-client.js';
import CartContext from '../context/cart-context.jsx';
import Constants from './constants.js';

/**
 * Fetches the current guest cart
 * @returns {{cartData: boolean|{}}}
 */
const useGetCartGraphql = (step) => {
  const {
    isLoggedIn, cart, setCart, cartId,
  } = useContext(CartContext); // Get the cart context

  const fetchGuestCartQuery = `query ($cartId: String!) {
  commerce_cart(cart_id: $cartId) ${Constants.CART_QUERY}
}`;

  const fetchCustomerCartQuery = `query customerCart {
  commerce_customerCart ${Constants.CART_QUERY}
}`;

  const cartQuery = isLoggedIn ? fetchCustomerCartQuery : fetchGuestCartQuery;

  const fetchCart = useCallback(
    () => {
      setCart({ ...cart, isLoading: true });
      getGraphqlClient(cartQuery, { cartId }, true).then((response) => {
        const responseData = isLoggedIn
          ? response.response.data.commerce_customerCart
          : response.response.data.commerce_cart;

        responseData.items = responseData?.items?.map((item, index) => {
          if (!responseData?.extension_attributes?.cart
            ?.items[index]?.extension_attributes?.is_free_gift) {
            if ((Number(item?.quantity) <= Number(item?.configured_variant?.stock_data?.qty))
            ) {
              return {
                ...item,
                isQuantityNotAvailable: false,
                extensionAttributes: responseData?.extension_attributes?.cart?.items
                  ?.find((element) => Number(item?.id) === Number(element?.item_id)),
              };
            }
            return {
              ...item,
              isQuantityNotAvailable: true,
              extensionAttributes: responseData?.extension_attributes?.cart?.items
                ?.find((element) => Number(item?.id) === Number(element?.item_id)),
            };
          }
          return {
            ...item,
          };
        });
        setCart({ ...cart, data: responseData });
        window.dispatchEvent(new CustomEvent('updateMiniCart'));
        if (step === 1) {
          window.dispatchEvent(new CustomEvent(
            'react:datalayerViewCartEvent',
            {
              detail: {
                value: responseData?.prices?.grand_total?.value || 0,
                currency: responseData?.prices?.grand_total?.currency || '',
                productData: responseData.items.map((item) => {
                  const gtmAttributes = item?.product?.gtm_attributes;
                  return {
                    gtm: {
                      'gtm-magento-product-id': gtmAttributes?.id || '',
                      'gtm-name': gtmAttributes?.name || '',
                      'gtm-brand': gtmAttributes?.brand || '',
                      'gtm-category': gtmAttributes?.category || '',
                      'gtm-variant': gtmAttributes?.variant || '',
                      'gtm-stock': item?.configured_variant?.stock_status === 'IN_STOCK' ? 'in stock' : '',
                      'gtm-price': gtmAttributes?.price || '',
                    },
                    discount: {
                      en: '',
                    },
                    quantity: item.quantity,
                  };
                }),
              },
            },
          ));
        }
      }).catch(() => {
        setCart({ ...cart, isError: true, isLoading: false });
      });
    },
    [isLoggedIn, cartId, setCart, cart],
  );

  useEffect(() => {
    if (cartId) {
      fetchCart();
    }
  }, [cartId]);

  return null;
};

export default useGetCartGraphql;
