import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class Stage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {openModal, title} = this.props;

    return (
      <TouchableHighlight
       style={styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => openModal()}
      >
       <Text style={styles.buttonText}>
        {title}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Stage;
