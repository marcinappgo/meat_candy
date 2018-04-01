import React, { Component } from 'react'
import { View, StyleSheet, TouchableHighlight, Text, ScrollView } from 'react-native';

class CalendarMonth extends Component {



  static navigationOptions = ({navigation}) => {

    let months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ]

    //title: 'Harmonogram ' + (new Date().getYear()) + ' ' + this.months[this.props.navigation.params.month]
    return {
        title: ("Harmonogram " + months[navigation.state.params.month] + ' '  + (new Date().getFullYear()))
    }
  };

  weekCount(month_number) {

    let year = new Date().getFullYear();
    // month_number is in the range 1..12

    var firstOfMonth = new Date(year, month_number - 1, 1);
    var day = firstOfMonth.getDay() || 6;
    day = day === 1 ? 0 : day;
    if (day) { day-- }
    var diff = 7 - day;
    var lastOfMonth = new Date(year, month_number, 0);
    var lastDate = lastOfMonth.getDate();
    if (lastOfMonth.getDay() === 1) {
        diff--;
    }
    var result = Math.ceil((lastDate - diff) / 7);
    return result + 1;
  }

  render() {
    const { navigate, state } = this.props.navigation;
    var weeks = new Array();

    for(let i = 1; i<=this.weekCount(state.params.month+1); i++) {



      weeks.push(
        <TouchableHighlight
         style={styles.button}
         onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
        >
         <Text style={styles.buttonText}> Tydzień {i} </Text>
        </TouchableHighlight>
      )
    }

    return (
      <ScrollView>
      {weeks}
      </ScrollView>
    )

  }
}

export default CalendarMonth;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#00ACEC',
    padding: 30,
    margin: 10
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF'
  }
})
