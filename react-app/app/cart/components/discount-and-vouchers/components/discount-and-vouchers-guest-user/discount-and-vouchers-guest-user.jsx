import React, { useEffect } from 'react';
import './discount-and-vouchers-guest-user.css';
import { getLanguageAttr } from '../../../../../../../scripts/configs';
import useMutationObserver from '../../../../../../utils/hooks/useMutationObserver';

function DiscountAndVouchersGuestUser() {
  const redirectURL = `/${getLanguageAttr()}/cart`;

  const handleAddRedirectURL = (element) => {
    const anchorEl = element.querySelector('a');
    if (anchorEl?.href?.includes('login')) anchorEl.href = `${anchorEl.href}?redirect=${redirectURL}`;
  };

  useMutationObserver('#discount-vouchers-guest ', '.banner-content h3', handleAddRedirectURL);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('react:loadFragment', { detail: { path: `/${getLanguageAttr()}/fragments/banners/offers/banner-membership`, targetSelector: '#discount-vouchers-guest' } }));
  }, []);

  return <div id="discount-vouchers-guest" />;
}

export default DiscountAndVouchersGuestUser;
