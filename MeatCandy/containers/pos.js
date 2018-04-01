import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native';

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
        {pos.pos_category} - {pos.pos_name} - {pos.pos_city}
       </Text>
      </TouchableHighlight>
    )
  }

}


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
  },

  selectedButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#00ACEC',
    padding: 30,
    margin: 10
  },
  selectedButtonText: {
    fontSize: 20,
    color: '#00ACEC'
  }
})

export default Pos;
