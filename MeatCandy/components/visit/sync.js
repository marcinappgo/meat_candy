import React , { Component } from 'react'
import { AsyncStorage, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    token : state.authReducer.token
  }
}

class Sync extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visits : [],
      synced : []
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {
      if(list) {
        list = JSON.parse(list);

        this.setState({
          visits : list
        })

      }
    }).catch((err) => console.warn(err))
  }

  componentDidMount() {

  }

  render() {

    let visits = this.state.visits.map((visit, i) => <Text key={i}>{visit.visit_obj.pos_name}</Text>);
    let synced = this.state.synced.map((visit, i) => <Text key={i}>{visit.visit_obj.pos_name}</Text>);

    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.boldText}>Do synchornizacji</Text>
            {visits}
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.boldText}>Zsynchornizowane</Text>
            {synced}
          </View>
        </View>
      </ScrollView>
    )
  }

}

export default connect(mapStateToProps)(Sync);
