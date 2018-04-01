import React, { Component } from 'react'
import {
  View, Button, AsyncStorage, TouchableHighlight, StyleSheet, Text, ScrollView
} from 'react-native'

import { connect, dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../actions/auth'

const mapStateToProps = (state) => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({logoutUser}, dispatch);

class Home extends Component {

  static navigationOptions = {
    title: 'CandyMerch',
  };

  logout = () => {
    fetch('https://candy.meatnet.pl/api/auth.php?a=logout', {
      method: "GET",
      headers: {
        Accept: 'application/json'
      }

    })
    .then((response) => response.json())
    .then((responseJson) => {

      if(responseJson.status == "success") {
        AsyncStorage.removeItem('@CandyMerch:userToken').then(() => {
            this.props.logoutUser();
            // this.props.navigation.state.params.updateUser(false);
        })

        ;
      }else{
        alert(responseJson.message)
      }

    })
    .catch(err => {
      alert("Error: " + err.message + "\n" + err.stack);
    })
  }

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <TouchableHighlight
         style={styles.button}
         onPress={() => navigate('Calendar')}
        >
         <Text style={styles.buttonText}> Harmonogram </Text>
        </TouchableHighlight>

        <TouchableHighlight
         style={styles.button}

        >
         <Text style={styles.buttonText}> Nowa wizyta </Text>
        </TouchableHighlight>

        <TouchableHighlight
         style={styles.button}

        >
         <Text style={styles.buttonText}> Lista wizyt </Text>
        </TouchableHighlight>

        <TouchableHighlight
         style={styles.button}
         onPress={() => this.logout()}
        >
         <Text style={styles.buttonText}> Wyloguj się </Text>
        </TouchableHighlight>

        <TouchableHighlight
         style={styles.button}
         onPress={() => navigate('Target')}
        >
         <Text style={styles.buttonText}> Targety </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#00ACEC',
    padding: 30,
    margin: 10
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF'
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  countText: {
    color: '#FF00FF'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
