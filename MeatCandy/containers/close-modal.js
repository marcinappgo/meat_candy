import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class CloseModal extends Component {

  constructor(props) {
    super(props);
  }

  render() {


    return (
      <TouchableHighlight
       style={styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => this.props.closeModal()}
      >
       <Text style={styles.buttonText}>
        Zamknij
       </Text>
      </TouchableHighlight>
    )
  }

}

export default CloseModal;
