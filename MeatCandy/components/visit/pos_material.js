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

class VisitPosMaterial extends Component {

  constructor(props) {
      super(props)

      this.state = {
        pos_material : this.props.pos_material,
        modalVisible : false,
        categories : []
      }

      this.toggleModal = this.toggleModal.bind(this)
      this.updatePosMaterial = this.updatePosMaterial.bind(this)
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

  updatePosMaterial() {
    this.props.updatePosMaterial(this.state.pos_material);
    this.toggleModal();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.pos_material) {
      this.setState({
        pos_material : nextProps.pos_material
      })
    }
  }

  updatePosAdv(pos) {

    let pos_material = this.state.pos_material
    pos_material[pos.id] = pos;
    this.setState({pos_material})

  }

  render() {

    let categories = this.state.categories.map((category) => {

      let value = '0';
      let pos_material = this.state.pos_material

      value = {
        id : category.id,
        title : category.title,
        status : 'Brak',
        reason : '',
        photo : ''
      }

      if(category.id in pos_material) {
        value = pos_material[category.id]
      }

      return (
        <PosAdv pos={value} key={category.id} updatePosAdv={this.updatePosAdv} />
      )



      return (
          <View key={category.id} style={styles.list}>
            <View style={{flex: 10}}>
              <Text>{category.title}</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput onChangeText={(text) => {
                let pos_material = this.state.pos_material
                pos_material[category.id] = text;
                this.setState({pos_material});
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
      onRequestClose={() => this.updatepos_material()}
      >
        <View style={{flex:1}}>
        <Text style={styles.modalTitle}>Materiały POS</Text>
          <ScrollView style={{flex: 12}}>
          {categories}
          </ScrollView>
        <CloseModal closeModal={this.updatePosMaterial} />
        </View>
      </Modal>
      <Stage openModal={this.toggleModal} title="Materiały POS" />
      </View>
    )
  }
}

export default connect(mapStateToProps)(VisitPosMaterial)
