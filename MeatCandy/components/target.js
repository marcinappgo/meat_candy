import React, { Component } from 'react'
import {
  View, Text
} from 'react-native'

export default class Target extends Component {
  static navigationOptions = {
    title: 'Twoje Targety',
  };

  render() {
    return (
      <View>
        <Text>Targety</Text>
      </View>
    )
  }
}
