import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import "./Payment.css";

class Payments extends Component {

  render() {
    return (
      <StripeCheckout
        name="Cao-Ni-Car"
        currency="THB"
        description={this.props.price + " Baht"}
        amount={this.props.price * 100}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="paybtn">
          Pay with creditcard
          {process.env}
        </button>
      </StripeCheckout>
    );
  }
}

export default Payments;