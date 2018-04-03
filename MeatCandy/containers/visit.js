import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class Visit extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {visit} = this.props;

    return (
      <TouchableHighlight
       style={styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => this.props.selectVisit(visit)}
      >
       <Text style={styles.buttonText}>
        {visit.pos_category} - {visit.pos_number} - {visit.pos_name}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Visit;
