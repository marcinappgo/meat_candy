import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'


class Visit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active : 1
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('@CandyMerch:visitDetails' + this.props.visit.visit_plan_id)
    .then((visit) => {
      if(visit) {
        visit = JSON.parse(visit);
        if('visit_obj' in visit && visit.visit_obj.visit_plan_visit_id != 0) {
          this.setState({
            active : 0
          })
        }
      }

    });
  }

  selectVisit() {

    if(this.state.active == 1) {
        let { visit } = this.props;
        this.props.selectVisit(visit);
    }


  }

  render() {

    const {visit} = this.props;

    return (
      <TouchableHighlight
       style={!this.state.active?styles.selectedButton:styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={this.selectVisit.bind(this)}
      >
       <Text style={!this.state.active?styles.selectedButtonText:styles.buttonText}>
        {visit.pos_category} - {visit.pos_number} - {visit.pos_name}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Visit;
