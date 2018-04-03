import React , { Component } from 'react'
import { View, Modal, Text, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import PosAdv from '../../containers/pos_adv'
import styles from '../../containers/styles'

const mapStateToProps = (state) => {
  return {
    token : state.authReducer.token
  }
}

class VisitExposition extends Component {



  constructor(props) {
      super(props)

      this.state = {
        exposition : this.props.exposition,
        modalVisible : false,
        categories : []
      }

      this.toggleModal = this.toggleModal.bind(this)
      this.updateExposition = this.updateExposition.bind(this)
  }
  componentWillMount() {

    fetch('https://candy.meatnet.pl/api/categories.php', {
      method: 'GET',
      headers: {
        Accept : 'application/json',
        'User-Token' : this.props.token
      }
    }).then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.status == 'success') {
          this.setState({
            categories : responseJson.response.categories
          })
        }else if(responseJson.status == 'error') {
          alert(responseJson.message)
        }
    }).catch((err) => alert(err));
  }

  toggleModal() {
      this.setState({
        modalVisible : !this.state.modalVisible
      })
  }

  updateExposition() {

    this.setState({
      exposition : this.state.exposition
    }, () => {
      this.props.updateExposition(this.state.exposition);
      this.toggleModal();
    })


  }

  componentWillReceiveProps(nextProps) {
    if("undefined" != typeof nextProps.exposition) {
      this.setState({
        exposition : nextProps.exposition
      })
    }
  }

  updatePosAdv(pos) {
    let exposition = this.state.exposition
    exposition[pos.id] = pos;
    this.setState({exposition})

  }

  render() {

    let exposition = this.state.exposition

    let categories = this.state.categories.map((category) => {

      let value = '0';


      value = {
        id : category.id,
        title : category.title,
        status : 'Brak',
        reason : '',
        photo : ''
      }

      if(category.id in exposition) {
        value = exposition[category.id]
      }

      return (
        <PosAdv pos={value} key={category.id} updatePosAdv={this.updatePosAdv.bind(this)} />
      )



      return (
          <View key={category.id} style={styles.list}>
            <View style={{flex: 10}}>
              <Text>{category.title}</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput onChangeText={(text) => {
                let exposition = this.state.exposition
                exposition[category.id] = text;
                this.setState({exposition});
              }}
              keyboardType='numeric'
              value={value}
              />
            </View>
          </View>
        )

    })

    return (
      <View >
      <Modal
      style={styles.modal}
      animation="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => this.updateExposition()}
      >
        <View style={{flex:1}}>
        <Text style={styles.modalTitle}>Grupowanie ekspozycji</Text>
          <ScrollView style={{flex: 12}}>
          {categories}
          </ScrollView>
        <CloseModal closeModal={this.updateExposition} />
        </View>
      </Modal>
      <Stage openModal={this.toggleModal} title="Grupowanie ekspozycji" />
      </View>
    )
  }
}

export default connect(mapStateToProps)(VisitExposition)
