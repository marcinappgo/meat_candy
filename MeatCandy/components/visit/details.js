import React , { Component } from 'react'
import { View, Modal, Text, TextInput, ScrollView } from 'react-native'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import styles from '../../containers/styles'

export default class VisitDetails extends Component {

  constructor(props) {
      super(props)

      this.state = {
        details : this.props.details,
        modalVisible : false
      }

      this.toggleModal = this.toggleModal.bind(this)
      this.updateDetails = this.updateDetails.bind(this)
  }

  toggleModal() {
      this.setState({
        modalVisible : !this.state.modalVisible
      })
  }

  updateDetails() {
    this.props.updateDetails(this.state.details);
    this.toggleModal();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.details) {
      this.setState({
        details : nextProps.details
      })
    }
  }

  render() {
    return (
      <View >
      <Modal
      style={styles.modal}
      animation="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => this.updateDetails()}
      >
      <View style={{flex: 1}}>
        <Text style={styles.modalTitle}>Szczegóły wizyty</Text>
        <ScrollView style={{flex: 12}}>
          <TextInput
          placeholder="Osoba kontaktowa"
          value={this.state.details.visit_contact_person}
          onChangeText={(text) => this.setState({
            details : {
              ...this.state.details,
              visit_contact_person : text
            }
          })}
          />
        </ScrollView>
        <CloseModal closeModal={this.updateDetails} />
        </View>
      </Modal>
      <Stage openModal={this.toggleModal} title="Szczegóły" />
      </View>
    )
  }
}
