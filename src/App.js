import React from 'react';
import './App.css';
import PaypalButton from './PaypalButton';

class App extends React.Component {
    onSuccess(payment) {
        console.log('Successful payment!', payment);
    }

    onError(error) {
        console.log('Erroneous payment OR failed to load script!', error);
    }

    onCancel(data) {
        console.log('Cancelled payment!', data);
    }

    render() {
        return (
            <div>
                <PaypalButton
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                    onCancel={this.onCancel}
                />
            </div>
        );
    }
}

export default App;
