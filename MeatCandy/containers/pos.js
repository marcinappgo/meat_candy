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

    const {pos} = this.props;

    return (
      <TouchableHighlight
       style={this.state.selected?styles.selectedButton:styles.button}
       // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
       onPress={() => this.updateSelected(!this.state.selected)}
      >
       <Text style={this.state.selected?styles.selectedButtonText:styles.buttonText}>
        {pos.pos_category} - {pos.pos_number} - {pos.pos_name}
       </Text>
      </TouchableHighlight>
    )
  }

}

export default Pos;
