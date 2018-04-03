import React , {Component} from 'react';
import { View, StyleSheet, TouchableHighlight, Text, ScrollView } from 'react-native';
import styles from '../containers/styles'

class Calendar extends Component {
  static navigationOptions = {
    title: 'Harmonogram ' + (new Date().getFullYear())
  };


  render() {
    const { navigate } = this.props.navigation;
    let months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ]

    let renderedMonths = months.map(
      (month, i) =>
        <TouchableHighlight
        key={i}
         style={styles.button}
         onPress={() => navigate('CalendarMonth', {month:i})}
        >
         <Text style={styles.buttonText}> {month} </Text>
        </TouchableHighlight>
    )


    // for(let i = 1; i<=12; i++) {
    //
    //
    //   let locale = "pl";
    //   let month = new Date(i+'/1/2018').toLocaleString(locale, {month: "long"});
    //
    //   months.push(
    //     <TouchableHighlight
    //      style={styles.month}
    //      onPress={() => navigate('CalendarMonth', {month:i})}
    //     >
    //      <Text style={{color: '#FFFFFF'}}> {month} </Text>
    //     </TouchableHighlight>
    //   )
    // }

    return (
      <ScrollView>
      {renderedMonths}
      </ScrollView>
    )

  }
}

export default Calendar;
