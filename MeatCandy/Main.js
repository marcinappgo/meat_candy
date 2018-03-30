import React, { Component } from 'react';
import { createStore } from 'redux';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import rootReducer from './reducers';

export default class Main extends Component {
  render() {
    const store = createStore(rootReducer);

    return (
        <Provider store={store}>
          <App />
        </Provider>
    );
  }
}
