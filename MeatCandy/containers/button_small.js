import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class ButtonSmall extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {onPress, title, selected} = this.props;

    return (
      <TouchableHighlight
       style={selected?styles.buttonSmallSelected:styles.buttonSmall}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => onPress()}
      >
       <Text style={selected?styles.buttonSmallSelectedText:styles.buttonSmallText}>
        {title}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default ButtonSmall;
