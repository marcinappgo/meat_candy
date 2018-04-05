import React , { Component } from 'react'
import { AsyncStorage, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import Button from '../../containers/button'

const mapStateToProps = (state) => {
  return {
    token : state.authReducer.token
  }
}

class Sync extends Component {

  static navigationOptions = {
    title: 'Lista wizyt',
  };


  constructor(props) {
    super(props);

    this.state = {
      visits : {},
      synced : {}
    }
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {
      if(list) {
        list = JSON.parse(list);

        this.setState({
          visits : list
        })


      }
    }).catch((err) => console.warn(err))

    AsyncStorage.getItem('@CandyMerch:visitSynced').then((list) => {
      if(list) {
        list = JSON.parse(list);

        this.setState({
          synced : list
        })


      }
    }).catch((err) => console.warn(err))
  }

  componentDidMount() {

  }

  syncVisit() {
    if(Object.keys(this.state.visits).length > 0) {
        let key = Object.keys(this.state.visits)[0];
        let visits = this.state.visits;
        let synced = this.state.synced;

        let visit = visits[key];
        synced[key] = visit;
        delete visits[key];

        this.setState({
          visits : visits,
          synced : synced
        }, () => {
          this.syncVisit();
        })
    }else{
      AsyncStorage.setItem('@CandyMerch:visitToSync', JSON.stringify(this.state.visits));
      AsyncStorage.setItem('@CandyMerch:visitSynced', JSON.stringify(this.state.synced));
    }

  }

  sync() {
    this.syncVisit();
  }

  clearStorage() {
    AsyncStorage.getAllKeys().then((keys) => {
      for(let key of keys) {
        if(/^@CandyMerch:visit/.test(key) && key != '@CandyMerch:userToken') {
          AsyncStorage.removeItem(key).then(() => {this.loadData()})
        }
      }
    });
  }

  render() {

    let visits = Object.keys(this.state.visits).map((i) => <Text key={i}>{this.state.visits[i].visit_obj.pos_name}</Text>);
    let synced = Object.keys(this.state.synced).map((i) => <Text key={i}>{this.state.synced[i].visit_obj.pos_name}</Text>);

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 8}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.boldText}>Do synchornizacji</Text>
              {visits}
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.boldText}>Zsynchronizowane</Text>
              {synced}
            </View>
          </View>
        </ScrollView>
        <View style={{flex: 4}}>
          <Button onPress={this.sync.bind(this)} title="Synchronizacja" />
          <Button onPress={this.clearStorage.bind(this)} title="Wyczyść zapisane dane" />
        </View>
      </View>
    )
  }

}

export default connect(mapStateToProps)(Sync);
