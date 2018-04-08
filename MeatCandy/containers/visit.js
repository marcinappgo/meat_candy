import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'


class Visit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active : 1,
        canceled: false
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('@CandyMerch:visitDetails' + this.props.visit.visit_plan_id)
    .then((visit) => {
      if(visit) {
        visit = JSON.parse(visit);
        if('visit_obj' in visit && visit.visit_obj.visit_plan_visit_id != 0) {
          this.setState({
            active : 0,
              canceled: visit.visit_obj.visit_plan_visit_id == -2
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

    let stylesArr = [];
    if(this.state.active) {
      stylesArr.push(styles.button)
    }else{
      stylesArr.push(styles.selectedButton)

      if(this.state.canceled) {
        stylesArr.push(styles.posAplus)
      }
    }

    return (
      <TouchableHighlight
       style={stylesArr}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={this.selectVisit.bind(this)}
      >
       <Text style={[styles.pos,!this.state.active?styles.selectedButtonText:styles.buttonText]}>
           {visit.pos_category} - {visit.pos_number} - {visit.pos_network} - {visit.pos_city} - {visit.pos_name}{"\n"}
         <Text style={styles.posSubtitle}>{visit.pos_address}</Text>
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Visit;
