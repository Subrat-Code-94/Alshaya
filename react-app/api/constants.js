const CART_QUERY__SHIPPING_ADDRESSES = `
    shipping_addresses {
        firstname
        lastname
        available_shipping_methods {
        amount {
            currency
            value
        }
        available
        carrier_code
        carrier_title
        method_code
        method_title
        error_message
        price_excl_tax {
            value
            currency
        }
        price_incl_tax {
            value
            currency
        }
        }
        selected_shipping_method {
        amount {
            value
            currency
        }
        carrier_code
        carrier_title
        method_code
        method_title
        }
    }
`;
const CART_QUERY__EXTENSION_ATTRIBUTE = `
    extension_attributes {
            delivery_matrix {
            product_sku
                applicable_shipping_methods {
                    available
                    carrier_code
                    carrier_title
                    cart_page_title
                    error_message
                    method_code
                    method_title
                }
            }
            cart {
                id
                applied_rule_ids
                billing_address {
                    firstname
                    lastname
                    email
                    telephone
                    street
                    city
                    region
                    postcode
                    region_id
                    region_code
                    country_id
                    custom_attributes {
                        attribute_code
                        value
                        name
                    }
                }
                items {
                    item_id
                    sku
                    qty
                    name
                    price
                    product_type
                    quote_id
                    extension_attributes {
                        item_name_en
                        parent_product_sku
                        error_message
                        style_code
                        color
                        size
                        season_code
                        is_aura_free_item
                        is_free_gift
                        brand_full_name
                        original_price
                        egift_options {
                            hps_giftcard_amount
                            hps_giftcard_sender_name
                            hps_giftcard_recipient_name
                            hps_giftcard_sender_email
                            hps_giftcard_recipient_email
                            hps_giftcard_message
                        }
                        hps_style_msg
                        image_url
                        is_egift
                        is_topup
                        product_media {
                            id
                            media_type
                            label
                            position
                            disabled
                            types
                            file
                        }
                    }
                }
                extension_attributes {
                    free_shipping_text
                    attempted_payment
                    applied_rule_ids
                    applied_rule_ids_with_discount
                    is_locked
                    is_multi_brand_cart
                    applied_hm_offer_code
                    hm_voucher_discount
                    applied_hm_voucher_codes
                    surcharge {
                        is_applied
                        amount
                    }
                    member_price_discount
                    aura_promotion_discount
                    has_exclusive_coupon
                    shipping_assignments {
                        shipping {
                            address {
                                firstname
                                lastname
                                email
                                telephone
                                street
                                city
                                region
                                postcode
                                region_id
                                region_code
                                country_id
                                custom_attributes {
                                    attribute_code
                                    value
                                    name
                                }
                            }
                            method
                        }
                    }
                }
            }
            totals {
            total_segments{
                    code
                    title
                    value
                }
               shipping_incl_tax
                coupon_code
                extension_attributes {
                    coupon_label
                    reward_points_balance
                    reward_currency_amount
                    base_reward_currency_amount
                    is_hm_applied_voucher_removed
                    is_all_items_excluded_for_adv_card
                }
                items {
                    extension_attributes {
                        adv_card_applicable
                    }
                }
            }
        }
`;
const CART_QUERY__ITEMS = `
    items {
        id
        uid
        quantity
        product {
            promotions {
                context
                url
                label
                type
            }
            reserve_and_collect
            ship_to_store
            ... on commerce_SimpleProduct {
                sku
                dynamicAttributes(fields:["color","size"])
                stock_data {
                    qty
                    max_sale_qty
                    max_sale_qty_parent
                }
                stock_status
            }
            url_key
            assets_cart
            name
            brand_full_name
            sku
            gtm_attributes{
                id
                name
                variant
                price
                brand
                category
                dimension2
                dimension3
                dimension4
            }
        }
        ... on commerce_ConfigurableCartItem {
            configured_variant {
                dynamicAttributes(fields:["color","size"])
                reserve_and_collect
                ship_to_store
                name
                sku
                brand
                price_range {
                    maximum_price {
                        regular_price {
                            value
                            currency
                        }
                        final_price {
                            value
                            currency
                        }
                        discount {
                            percent_off
                        }
                    }
                }
                stock_data {
                    qty
                    max_sale_qty
                    max_sale_qty_parent
                }
                stock_status
                color_label
                size
            }
            configurable_options {
                option_label
                value_id
                value_label
            }
        }
        prices {
            row_total_including_tax {
                value
                currency
            }
        }
    }
`;
const CART_QUERY__PRICES = `
    prices {
        grand_total {
            value
            currency
        }
        subtotal_excluding_tax {
            value
            currency
        }
        subtotal_including_tax {
            value
            currency
        }
        applied_taxes {
            amount {
                value
                currency
            }
        }
        discount {
            amount {
                value
                currency
            }
            label
        }
    }
`;

const CART_QUERY = `
    {
        id
        total_quantity
        ${CART_QUERY__EXTENSION_ATTRIBUTE}
        ${CART_QUERY__ITEMS}
        ${CART_QUERY__PRICES}
        available_payment_methods{
          code
          title
        }
        selected_payment_method{
          code
        }
    }
`;

const CHECKOUTCOM_CONFIG_QUERY = `
    {
        public_key
        environment
        allowed_card_types
        mada_bin_numbers
        display_card_number_type
        apple_pay_merchant_id
        apple_pay_merchant_capabilities
        apple_pay_supported_networks
        vault_enabled
        cvv_check
        api_url
        fawry_expiry_time
        benefit_pay_expiry_time
    }
`;

const Constants = {
  CART_QUERY__SHIPPING_ADDRESSES,
  CART_QUERY__EXTENSION_ATTRIBUTE,
  CART_QUERY__ITEMS,
  CART_QUERY__PRICES,
  CART_QUERY,
  CHECKOUTCOM_CONFIG_QUERY,
};

export default Constants;
