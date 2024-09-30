import React from 'react';
import Icon from '../../../../library/icon/icon.jsx';

function DeliveryInformationHeader({
  shippingAddress, placeholders, handleChangeClick, handleSelectClick, handleEditClick,
}) {
  const {
    changeDeliveryAddressCta,
    addressSelectButton,
    // addressSelectedButton
  } = placeholders;
  const renderFullName = () => <span className="delivery-information__customer-name">{`${shippingAddress?.firstname} ${shippingAddress?.lastname}`}</span>;

  const renderEmail = () => (shippingAddress?.email ? (
    <span className="mobile-only">{shippingAddress.email}</span>
  ) : null);

  const renderTelephone = () => (shippingAddress?.telephone ? (
    <span className="mobile-only">{shippingAddress.telephone}</span>
  ) : null);

  const renderAddress = () => {
    const addressDetails = {
      city: shippingAddress?.city,
      street: shippingAddress?.street?.join(', '),
      building: shippingAddress?.custom_attributes?.find((attribute) => attribute.attribute_code === 'address_building_segment')?.value,
      address: shippingAddress?.custom_attributes?.find((attribute) => attribute.attribute_code === 'address')?.value,
    };
    const address = Object.keys(addressDetails).map((key) => addressDetails[key]).filter((value) => value?.trim()).join(', ');
    return address ? <span>{address}</span> : null;
  };

  return (
    <div className="delivery-information__header">
      <div className="delivery-information__header__customer-info">
        {renderFullName()}
        <div className="delivery-information__header__customer-address">
          {renderEmail()}
          {renderTelephone()}
          {renderAddress()}
        </div>
      </div>
      <div className="delivery-information__header__action">
        {
          handleChangeClick
            ? <button type="button" className="secondary" onClick={handleChangeClick}>{changeDeliveryAddressCta}</button>
            : (
              <>
                <button type="button" className="secondary" onClick={handleSelectClick}>{addressSelectButton}</button>
                {
                  handleEditClick
                    ? (
                      <button
                        type="button"
                        className="secondary edit-btn"
                        onClick={handleEditClick}
                        aria-label="Edit address"
                      >
                        <Icon name="edit-bottom-border" className="edit-address" />
                      </button>
                    ) : null
                }
              </>
            )
        }
      </div>
    </div>
  );
}

export default DeliveryInformationHeader;
