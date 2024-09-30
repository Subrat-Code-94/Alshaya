import React, { useContext, useEffect } from 'react';
import './login.css';
import CartContext from '../../../../context/cart-context';

function Login() {
  const { placeholders } = useContext(CartContext);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('react:loadFragment', { detail: { path: '/en/user/login', targetSelector: '.cart__login-container' } }));

    const container = document.getElementById('cart__login-container');

    const observer = new MutationObserver((mutationsList) => {
      Array.from(mutationsList).forEach((mutation) => {
        if (mutation.type === 'childList') {
          const h2TitleRef = container.querySelector('.default-content-wrapper');
          if (h2TitleRef) {
            h2TitleRef.remove();
          }
          const loginFormWrapper = container.querySelector('.commerce-login-wrapper');
          if (loginFormWrapper) {
            const htmlContent = `<legend class="cart__login-legend"><span>${placeholders?.signInEmail}</span></legend>`;
            loginFormWrapper.insertAdjacentHTML('afterbegin', htmlContent);
          }

          const socialLoginWrapper = container.querySelector('.social-login-wrapper');
          if (socialLoginWrapper) {
            const htmlContent = `<legend class="cart__login-legend"><span>${placeholders?.signInSocial}</span></legend>`;
            socialLoginWrapper.insertAdjacentHTML('afterbegin', htmlContent);
          }

          const accTxtRef = container.querySelector('.social-login .account-text');
          accTxtRef.innerHTML = '';
          const signRef = container.querySelector('.sign-up');
          signRef.innerHTML = placeholders?.checkoutAsGuest;
          signRef.href = `/${document.documentElement.lang}/checkout`;

          const commWrapperRef = container.querySelector('.commerce-login-wrapper');
          const anchorElement = document.createElement('a');
          anchorElement.href = `/${document.documentElement.lang}/cart`;
          anchorElement.innerHTML = placeholders?.backToBasket;
          anchorElement.classList = ['back-to-basket'];
          commWrapperRef.appendChild(anchorElement);
        }
      });
    });

    observer.observe(container, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cart__login-checkout-mobile-container">
        <a className="cart__login-btn-mobile" href={`/${document.documentElement.lang}/checkout`}>{placeholders?.checkoutAsGuest}</a>
        <div className="cart__login-mobile-separator">
          <span>{placeholders?.sepratorOrLabel}</span>
        </div>
      </div>
      <div id="cart__login-container" className="cart__login-container" />
    </>
  );
}

export default Login;
