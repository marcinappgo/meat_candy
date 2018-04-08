import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class MyButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {onPress, title} = this.props;

    return (
      <TouchableHighlight
       style={styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => onPress()}
      >
       <Text style={styles.buttonText}>
        {title}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default MyButton;
