import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import styles from './styles'

class Pos extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: (props.pos.visit_plan_id > 0)
    }

    this.updateSelected = this.updateSelected.bind(this);
  }

  updateSelected(selected) {
    this.setState({selected});
    this.props.togglePos(this.props.pos.pos_id);
  }

  render() {

    const {pos, aplus} = this.props;

    let stylesArr = [];
    let stylesArrT = [];




    if(this.state.selected){
        stylesArr.push(styles.pos);
        stylesArr.push(styles.selectedButtonText);
        stylesArrT.push(styles.selectedButton);
    }else{
        stylesArr.push(styles.pos);
        stylesArr.push(styles.buttonText);
        stylesArrT.push(styles.button);
    }

    if(pos.pos_id in this.props.aplus && pos.visit_plan_id == 0)
      stylesArrT.push(styles.posAplus)




    return (
      <TouchableHighlight
       style={stylesArrT}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => this.updateSelected(!this.state.selected)}
      >
       <Text style={stylesArr}>
        {pos.pos_category} - {pos.pos_number} - {pos.pos_network} - {pos.pos_city} - {pos.pos_name}{"\n"}
        <Text style={styles.posSubtitle}>{pos.pos_address}</Text>
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Pos;
