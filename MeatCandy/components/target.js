import React, { Component } from 'react'
import {
  View, Text, AsyncStorage
} from 'react-native'
import styles from '../containers/styles'

export default class Target extends Component {
  static navigationOptions = {
    title: 'Twoje Targety',
  };

  constructor(props) {
    super(props);

    this.state = {
      target_visits: 0,
        visits: 0,
        target_trainings: 0,
        trainings: 0,
        target_trained: 0,
        trained: 0
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('@CandyMerch:targets').then((targets) => {
      let t = JSON.parse(targets);

      this.setState({
          target_visits: t.target_visits,
          visits: t.visits,
          target_trainings: t.target_trainings,
          trainings: t.trainings,
          target_trained: t.target_trained,
          trained: t.trained
      })
    })
  }

  render() {
    return (
      <View>
        <View style={styles.panel}>
          <Text>Przeprowadzone wizyty: {this.state.visits} z {this.state.target_visits}</Text>
        </View>
        <View style={styles.panel}>
          <Text>Przeprowadzone szkolenia: {this.state.trainings} z {this.state.target_trainings}</Text>
        </View>
        <View style={styles.panel}>
          <Text>Przeszkolone osoby: {this.state.trained} z {this.state.target_trained}</Text>
        </View>
      </View>
    )
  }
}
