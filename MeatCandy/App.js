import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, ScrollView, ToolbarAndroid, Image
} from 'react-native';
import { connect } from 'react-redux';
import LoginForm from './components/login';
import Home from './components/home'
import Target from './components/target'
import Calendar from './components/calendar'
import CalendarMonth from './components/calendar-month'
import CalendarWeek from './components/calendar-week'
import Plan from './components/plan'
import Visit from './components/visit'
import { StackNavigator } from 'react-navigation'

const mapStateToProps = (state) => {
  return {
    updateUserState: state.authReducer.updateUserState
  }
}



class App extends Component {


  componentWillReceiveProps(nextProps) {
    if(nextProps.updateUserState === true) {
      this.setState({
        userLoggedIn: false
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn : 0,
      updateUserState : false
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
        <Navigator />
      )
    }else if(this.state.userLoggedIn === false) {
      return (
        <View style={{flex: 1}}>
          <LoginForm updateUser={this.updateUser} />
        </View>
      );
    }else{
      return (
        <View style={{flex: 1}}>
          <Image
            source={require('./assets/img/candy.jpg')}
            resizeMode="contain"
            style={{flex:1, height: undefined, width: undefined}}
          />
          <LoginForm updateUser={this.updateUser} />
        </View>
      )
    }

  }
};



const Navigator = StackNavigator({
  Home: { screen : Home },
  Target: { screen : Target },
  Calendar: { screen : Calendar},
  CalendarMonth: { screen : CalendarMonth},
  CalendarWeek: { screen : CalendarWeek},
  Plan: { screen : Plan },
  Visit : { screen : Visit }
});

export default connect(mapStateToProps)(App);
