import React, { Component } from 'react'
import { View, StyleSheet, TouchableHighlight, Text, ScrollView, Button } from 'react-native';
import { connect } from 'react-redux';
import Pos from '../containers/pos'


const mapStateToProps = (state) => {
  return {
    token : state.authReducer.token
  }
}

class CalendarWeek extends Component {

  static navigationOptions = ({navigation}) => {

    let months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ]

    //title: 'Harmonogram ' + (new Date().getYear()) + ' ' + this.months[this.props.navigation.params.month]
    return {
        title: (months[navigation.state.params.month] + ' ' + (new Date().getFullYear()) + ' Tydzień ' + navigation.state.params.week),
        headerRight : (<Button onPress={navigation.state.params.handleSubmit} title="Zapisz" />)
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      posList: [],
      posToSend: [],
      month: this.props.navigation.state.params.month + 1,
      week: this.props.navigation.state.params.week
    }

    this.save = this.save.bind(this);
    this.togglePos = this.togglePos.bind(this);

  }

  save() {

    let year = new Date().getFullYear();
    let month = this.state.month;
    let week = this.state.week;

    let fd = new FormData();
    fd.append('ids', JSON.stringify(this.state.posToSend));
    fd.append('week', week);
    fd.append('month', month);

    fetch('https://candy.meatnet.pl/api/calendar.php?month=' + month + '&week' + week, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "User-Token": this.props.token
      },
      body: fd

    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status == 'success') {
        alert('Zapisano zmiany');
      }else if(responseJson.status == 'error') {
        alert(responseJson.message);
      }
    })
    .catch((err) => {
      alert(JSON.stringify(err))
    })
  }

  togglePos(id) {
    posToSend = this.state.posToSend;
    if(posToSend.indexOf(id) === -1) {
      posToSend.push(id)
    }else{
      posToSend.splice(posToSend.indexOf(id),1);
    }

    this.setState({posToSend});
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSubmit: this.save });
  }

  componentWillMount() {
    let year = new Date().getFullYear();
    let month = this.state.month;
    let week = this.state.week;

    fetch('https://candy.meatnet.pl/api/calendar.php?month=' + month + '&week' + week, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "User-Token": this.props.token
      }

    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status == 'success') {
        //alert(JSON.stringify(responseJson.response.pos));
        let posToSend = [];

        for(let pos of responseJson.response.pos) {
          if(pos.visit_plan_week == this.state.week && pos.visit_plan_month == this.state.month) {
            posToSend.push(pos.pos_id);
          }
        }

        this.setState({
          posList: responseJson.response.pos,
          posToSend: posToSend
        });
      }
    }).catch((err) => {
      alert(JSON.stringify(err))
    })
  }




  render() {
    let posList = this.state.posList.filter((pos) => {
      if(pos.visit_plan_week && pos.visit_plan_month) {
        if(
          pos.visit_plan_week != this.props.navigation.state.params.week
          && pos.visit_plan_month == this.props.navigation.state.params.month + 1
        ){
          return false;
        }

      }
      return true;
    })

    let posListFiltered = posList.map((pos) => <Pos
     pos={pos}
     week={this.props.navigation.state.params.week}
     month={this.props.navigation.state.params.month + 1}
     togglePos={this.togglePos}
     />)

    return (
        <ScrollView>
        {posListFiltered}
        </ScrollView>
    )
  }

}

export default connect(mapStateToProps, null)(CalendarWeek);
