import React , { Component } from 'react'
import { ScrollView, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import styles from '../containers/styles'
import VisitDetails from './visit/details'
import VisitCompetition from './visit/competition'
import VisitTraining from './visit/training'
import VisitPosMaterial from './visit/pos_material'

const mapStateToProps = (state) => {
  return {
    token : state.token
  }
}

class Visit extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title : navigation.state.params.visit.pos_category + ' - ' + navigation.state.params.visit.pos_number + ' - ' + navigation.state.params.visit.pos_name
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      visit : {
        details : {
          visit_contact_person : '',
          visit_start_time : Date.now(),
          visit_end_time : '',
          visit_obligatory : this.props.navigation.state.params.visit.visit_plan_visit_type,
          visit_remarks : ''
        },
        competition : [],
        exposition : {},
        order_product : {},
        pos_material : {},
        training : {}
      },
      visit_id : this.props.navigation.state.params.visit.visit_plan_id
    }
  }

  componentWillMount() {
    this.loadVisitFromStorage();
  }



  loadVisitFromStorage() {
    AsyncStorage.getItem('@CandyMerch:visitDetails' + this.state.visit_id)
    .then((visit) => {
      if(visit) {
        visit = JSON.parse(visit);
        this.setState({visit : visit})
      }

    });
  }

  saveVisitToStorage() {
    let data = JSON.stringify(this.state.visit);
    AsyncStorage.setItem('@CandyMerch:visitDetails' + this.state.visit_id, data);
  }

  updateDetails(details) {
    this.setState({
      visit : {
        ...this.state.visit,
        details : details
      }
    }, () =>  this.saveVisitToStorage());
  }

  updateCompetition(competition) {
    this.setState({
      visit : {
        ...this.state.visit,
        competition : competition
      }
    }, () =>  this.saveVisitToStorage());
  }

  updateTraining(training) {
    this.setState({
      visit : {
        ...this.state.visit,
        training : training
      }
    }, () =>  this.saveVisitToStorage());
  }

  updatePosMaterial(pos_material) {
    this.setState({
      visit : {
        ...this.state.visit,
        pos_material : pos_material
      }
    }, () =>  this.saveVisitToStorage());
  }

  render() {
    return (
      <ScrollView>
        <VisitDetails details={this.state.visit.details} updateDetails={this.updateDetails.bind(this)} />
        <VisitCompetition competition={this.state.visit.competition} updateCompetition={this.updateCompetition.bind(this)} />
        <VisitTraining training={this.state.visit.training} updateTraining={this.updateTraining.bind(this)} />
        <VisitPosMaterial pos_material={this.state.visit.pos_material} updatePosMaterial={this.updatePosMaterial.bind(this)} />
      </ScrollView>
    )
  }

}

export default connect(mapStateToProps, null)(Visit)
