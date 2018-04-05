import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import styles from '../containers/styles'
import Visit from '../containers/visit'
import { connect, dispatch } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token
  }
}

class Plan extends Component {

  static navigationOptions = {
    title: 'Plan wizyt na obecny tydzień',
  };

  constructor(props) {
    super(props)

    this.state = {
      plan : []
    }

    this.selectVisit = this.selectVisit.bind(this);
  }

  loadData() {
    return fetch('https://candy.meatnet.pl/api/new-visit.php', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "User-Token": this.props.token
      }
    }).then((response) => response.json())
    .then((responseJson) => {

      if(responseJson.status == 'success') {
        this.setState({
          plan: responseJson.response.plan
        })


      }else{

      }
    }).catch((err) => alert(err))
  }

  componentWillMount() {
      this.loadData();
  }

  navigateBack() {
    this.setState({state : this.state});
  }

  selectVisit(visit) {
    const { navigate } = this.props.navigation;
    navigate('Visit', { visit: visit, navigateBack : this.navigateBack.bind(this) });
  }

  render() {
    let plan = this.state.plan.map((visit) => <Visit key={visit.visit_plan_id} visit={visit} selectVisit={this.selectVisit} />)

    return (
      <ScrollView>
      {plan}
      </ScrollView>
    )
  }
}

export default connect()(Plan)
