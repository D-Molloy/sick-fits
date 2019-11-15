import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import ErrorMessage from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class Stripe extends React.Component {
  // Stripe test credit cards = https://stripe.com/docs/testing
  // normal Visa - 4242424242424242 - any 3 #s for security - any future date
  onToken = res => {
    console.log("res", res);
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick Fits"
            description={`Order of ${totalItems(me.cart)} items.`}
            // select an item image to appear on the stripe checkout.  Could be a site logo. Wes shows an item from the cart
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_hrdarMCPT2iY6Uu8CflnyFP800n8hI02Gu"
            currency="USD"
            email={me.email}
            // what to do when we get the token back
            token={res => this.onToken(res)}
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default Stripe;
