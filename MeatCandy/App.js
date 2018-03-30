import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, ScrollView, ToolbarAndroid
} from 'react-native';
import { connect } from 'react-redux';
import LoginForm from './components/login';

const mapStateToProps = (state) => {return {
  userLoggedIn: state.userLoggedIn,
  text: state.text
}}



export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn : false
    }
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(userLoggedIn) {
    this.setState({
      userLoggedIn: userLoggedIn
    });
  }

  render() {
    if(this.state.userLoggedIn === true) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>INNN</Text>
          <LoginForm updateUser={this.updateUser} />
        </View>
      )
    }else{
      return (
        <View style={{flex: 1}}>
          <LoginForm updateUser={this.updateUser} />
        </View>
      );
    }

  }
}
