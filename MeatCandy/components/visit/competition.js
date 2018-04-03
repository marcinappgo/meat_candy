import React , { Component } from 'react'
import { View, Modal, Text, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import styles from '../../containers/styles'

const mapStateToProps = (state) => {
  return {
    token : state.authReducer.token
  }
}

class VisitCompetition extends Component {

  constructor(props) {
      super(props)

      this.state = {
        competition : this.props.competition,
        modalVisible : false,
        categories : []
      }

      this.toggleModal = this.toggleModal.bind(this)
      this.updateCompetition = this.updateCompetition.bind(this)
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

  updateCompetition() {
    this.props.updateCompetition(this.state.competition);
    this.toggleModal();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.competition) {
      this.setState({
        competition : nextProps.competition
      })
    }
  }

  render() {

    let categories = this.state.categories.map((category) => {

      let value = '0';
      let competition = this.state.competition
      if(category.id in competition) {
        value = competition[category.id]
      }

      return (
          <View key={category.id} style={styles.list}>
            <View style={{flex: 10}}>
              <Text>{category.title}</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput onChangeText={(text) => {
                let competition = this.state.competition
                competition[category.id] = text;
                this.setState({competition});
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
      onRequestClose={() => this.updateCompetition()}
      >
        <View style={{flex:1}}>
        <Text style={styles.modalTitle}>Badanie konkurencji</Text>
          <ScrollView style={{flex: 12}}>
          {categories}
          </ScrollView>
        <CloseModal closeModal={this.updateCompetition} />
        </View>
      </Modal>
      <Stage openModal={this.toggleModal} title="Badanie konkurencji" />
      </View>
    )
  }
}

export default connect(mapStateToProps)(VisitCompetition)
