import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, TextInput, Button, StyleSheet, AsyncStorage, StatusBar, Image } from 'react-native'
import { loginUser, logoutUser } from '../actions/auth'

const mapStateToProps = (state) => {
  return {
    userLoggedIn : state.authReducer.userLoggedIn,
    text : state.authReducer.text
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({loginUser, logoutUser}, dispatch);

const styles = StyleSheet.create({
  loginForm: {
    flex: 1
  },
  logoutDiv: {

  }
})

class LoginForm extends Component {


  componentDidMount = () => {
    AsyncStorage.getItem('@CandyMerch:userToken').then(token => {
      if(token !== null) {
        fetch('https://candy.meatnet.pl/api/auth.php', {
          method: "GET",
          headers: {
            Accept: 'application/json',
            "User-Token": token
          }

        })
        .then((response) => response.json())
        .then((responseJson) => {

          if(responseJson.status == "success") {
            this.props.loginUser(responseJson.response.user, responseJson.response.token, responseJson.response.PHPSESSID)
          }else{
            this.props.logoutUser();
            alert(responseJson.message)
          }

        })
        .catch(err => {
          this.props.logoutUser();
          alert("Error: " + err.message + "\n" + err.stack);
        })
      }else{
        this.props.logoutUser();

      }
    });

  }

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
            this.props.logoutUser()
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

  login = (user, password) => {

    let fd = new FormData();
    fd.append('username', user);
    fd.append('password', password);

    fetch('https://candy.meatnet.pl/api/auth.php', {
      method: "POST",
      headers: {
        Accept: 'application/json'
      },
      body: fd

    })
    .then((response) => response.json())
    .then((responseJson) => {

      if(responseJson.status == "success") {
        AsyncStorage.setItem('@CandyMerch:userToken', responseJson.response.token).then(() => {
            this.props.loginUser(responseJson.response.user, responseJson.response.token, responseJson.response.PHPSESSID)
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
    this.state = {
      username: '',
      userpassword: ''
    }

  }

  componentWillReceiveProps(nextProps) {
    this.props.updateUser(nextProps.userLoggedIn);
    this.setState({
      user: nextProps.text
    });
  }

  render() {
    const {loginUser, logoutUser, userLoggedIn, text} = this.props;



    if(userLoggedIn===false) {
      return (
          <View style={{flex: 1}}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../assets/img/rsz_1rsz_1rsz_1candy.jpg')}
                  resizeMode="contain"
                />

                <TextInput
                    style={{height: 40, width: 200, marginBottom: 50, borderColor: 'gray'}}
                    onChangeText={(username) => this.setState({username})}
                    placeholder="Adres email"
                    value={this.state.username}
                    />

                <TextInput
                    style={{ height: 40, width: 200, marginBottom: 50, borderColor: 'gray'}}
                    onChangeText={(userpassword) => this.setState({userpassword})}
                    placeholder="Hasło"
                    secureTextEntry={true}
                    />

                <Button
                  onPress={() => this.login(this.state.username, this.state.userpassword)}
                  title="Login"
                                  />

              </View>
          </View>
      );
    }else if(userLoggedIn===true){
      return (
        <View>
        <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
         />
          <Text>Loggged as: {text}</Text>
          <Button
            onPress={() => this.logout()}
            title="Logout"

          />

        </View>
      )
    }else{
      return (
        <View></View>
      )
    }



  }
}



export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
