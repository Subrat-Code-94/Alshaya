/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useMemo } from 'react';
import './order-summary.css';
import CartContext from '../../../../context/cart-context';
// import ProductCard from "./product-card";
import ProductSummaryCardGql from '../../../cart/components/product-summary-card-graphql';
import useCurrencyFormatter from '../../../../utils/hooks/useCurrencyFormatter';
import Tooltip from '../../../../library/tooltip/tooltip';
import Icon from '../../../../library/icon/icon.jsx';

function OrderSummary({ content }) {
  const { cart, placeholders, priceDecimals } = useContext(CartContext);
  const surCharge = cart?.data?.extension_attributes?.cart?.extension_attributes?.surcharge;
  const isAppliedSurcharge = Number(surCharge?.is_applied) === 1;
  const updatedTitle = content.checkoutOrderSummaryTitle?.replace('{{COUNT}}', cart?.data?.items?.length);
  const grandTotal = cart?.data?.prices?.grand_total?.value ?? 0;
  const grandTotalCurrency = cart?.data?.prices?.grand_total?.currency ?? '';
  const subtotalIncludingTax = cart?.data?.prices?.subtotal_including_tax?.value ?? 0;
  const appliedTaxes = cart?.data?.prices?.applied_taxes ?? [];
  const taxesTotal = appliedTaxes.reduce((acc, tax) => acc + (tax.amount.value ?? 0), 0);
  // const deliveryFreeShow = cart?.data?.extension_attributes?.totals?.shipping_incl_tax;
  const totalDiscountAmount = cart?.data?.prices?.discount?.amount?.value;
  const subtotalIncludingTaxFormatted = useCurrencyFormatter({ price: subtotalIncludingTax, priceDecimals, currency: grandTotalCurrency });
  const totalDiscountAmountFormatted = useCurrencyFormatter({ price: totalDiscountAmount, priceDecimals, currency: grandTotalCurrency });
  const grandTotalFormatted = useCurrencyFormatter({ price: grandTotal, priceDecimals, currency: grandTotalCurrency });

  const surchargeAmountFormatted = useCurrencyFormatter({ price: surCharge?.amount, priceDecimals, currency: grandTotalCurrency });
  const paidWithAuraObject = cart?.data?.extension_attributes?.totals?.total_segments?.find((item) => item?.code === 'aura_payment');
  const balancePaymentObject = cart?.data?.extension_attributes?.totals?.total_segments?.find((item) => item?.code === 'balance_payable');
  const paidAuraValue = useCurrencyFormatter({ price: paidWithAuraObject?.value, priceDecimals, currency: grandTotalCurrency });
  const balancePaymentValue = useCurrencyFormatter({ price: balancePaymentObject?.value, priceDecimals, currency: grandTotalCurrency });
  const discountToolTipContent = useMemo(() => {
    const tooltipData = `<div className="applied-discounts-title">${placeholders.discountTooltipMessageApplied}</div>`;
    return tooltipData;
  }, [cart]);
  return (
    <div>
      <div className="checkout-order-summary-title">
        <span>{updatedTitle}</span>
      </div>
      <div className="checkout-order-summary-wrapper">
        <div id="checkout-items" className="checkout-items-list-container">
          {cart?.data?.items?.length && cart?.data?.items?.map((product) => <ProductSummaryCardGql key={product?.id} product={product} currency={cart?.data?.prices?.grand_total?.currency} checkoutHideSection />)}
        </div>
        <div className="checkout-subtotal-container">
          <div className="checkout-subtotal-wrapper">
            <div className="checkout-subtotal">
              <div className="checkout-subtotal-line">
                <div className="checkout-subtotal-label">{placeholders?.subTotalLabel}</div>
                <div className="checkout-subtotal-price">
                  {subtotalIncludingTaxFormatted}
                </div>
              </div>
              {isAppliedSurcharge && (
                <div className="checkout-subtotal-line">
                  <div className="checkout-subtotal-label">{placeholders?.cashOnDeliveryLabel}</div>
                  <div className="checkout-subtotal-price">
                    {surchargeAmountFormatted}
                  </div>
                </div>
              )}
              {/* {deliveryFreeShow > 0 && ( */}
              <div className="checkout-subtotal-line">
                <div className="checkout-subtotal-label">{placeholders?.deliveryLabel}</div>
                <div className="checkout-subtotal-price">
                  <span className="checkout-subtotal-amount">{placeholders?.shippingMethodFreeLabel}</span>
                </div>
              </div>
              {/* )} */}
              {totalDiscountAmount < 0 && (
                <div className="checkout-subtotal-line">
                  <label aria-label="discount" className="discount-label">
                    {placeholders?.discountsLabel}
                    <Tooltip content={discountToolTipContent}>
                      <Icon name="info-blue" className="discount-icon" />
                    </Tooltip>
                  </label>
                  <label aria-label="value" className="discount-label">{totalDiscountAmountFormatted}</label>
                </div>
              )}
            </div>

            <div className="checkout-order-total">
              {paidAuraValue > 0 && (
                <div className="checkout-subtotal-line">
                  <div className="checkout-subtotal-label">{placeholders?.paidWithAuraLabel}</div>
                  <div className="checkout-subtotal-price">
                    <span className="checkout-subtotal-amount">{paidAuraValue}</span>
                  </div>
                </div>
              )}
              {balancePaymentValue > 0 && (
                <div className="checkout-subtotal-line">
                  <div className="checkout-subtotal-label">{placeholders?.balancePaymentLabel}</div>
                  <div className="checkout-subtotal-price">
                    <span className="checkout-subtotal-amount">{balancePaymentValue}</span>
                  </div>
                </div>
              )}

              <div className="checkout-order-total-sec1">
                <div className="checkout-order-total-label">{placeholders?.orderTotalLabel}</div>
                <div className="checkout-order-total-price">
                  {grandTotalFormatted}
                </div>
              </div>
              <div className="checkout-order-total-sec2">
                <label className="excluding_label" aria-label="excluding">{placeholders.excludingDelivery}</label>
                {taxesTotal > 0 && <label className="excluding_label">{placeholders.inclusiveVat}</label>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
