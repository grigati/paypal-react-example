import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

class PaypalButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showButton: false
        };
    }

    componentDidMount() {
        const {
            isScriptLoaded,
            isScriptLoadSucceed
        } = this.props;

        if (isScriptLoaded && isScriptLoadSucceed) {
            this.setState({ showButton: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            isScriptLoaded,
            isScriptLoadSucceed,
        } = nextProps;

        const isLoadedButWasntLoadedBefore =
            !this.state.showButton &&
            !this.props.isScriptLoaded &&
            isScriptLoaded;

        if (isLoadedButWasntLoadedBefore) {
            if (isScriptLoadSucceed) {
                this.setState({ showButton: true });
            }
        }
    }

    createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '0.01'
                }
            }]
        });
    }

    onApprove (data, actions) {
        actions.order.capture()
        .then(() => {
            const payment = {
                paid: true,
                cancelled: false,
                payerID: data.payerID,
                paymentID: data.paymentID,
                paymentToken: data.paymentToken,
                returnUrl: data.returnUrl,
            };

            this.props.onSuccess(payment);
        })
    }


    render() {
        if (!this.state.showButton)
            return null;

        const paypal = window.paypal;
        const PayPalBtn = paypal.Buttons.driver('react', { React, ReactDOM });

        return (
            <div>
                <PayPalBtn
                    createOrder={(data, actions) => this.createOrder(data, actions)}
                    onApprove={(data, actions) => this.onApprove(data, actions)}
                    onSuccess={this.props.onSuccess}
                    onCancel={this.props.onCancel}
                    onError={this.props.onError}
                />
            </div>
        );
    }
}

export default scriptLoader('https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID')(PaypalButton);
