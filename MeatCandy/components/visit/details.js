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

        <Text>
          <Text style={styles.boldText}>Numer POS</Text> {this.props.visit.pos_number} (Kategoria {this.props.visit.pos_category})
        </Text>

        <Text>
          <Text style={styles.boldText}>Nazwa POS</Text> {this.props.visit.pos_name}
        </Text>

        <Text>
          <Text style={styles.boldText}>Sieć</Text> {this.props.visit.pos_network}
        </Text>

        <Text>
          <Text style={styles.boldText}>Adres POS</Text> {this.props.visit.pos_address}, {this.props.visit.pos_postal} {this.props.visit.pos_city}
        </Text>



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

          <TextInput
              placeholder="Numer telefonu"
              value={this.state.details.visit_contact_person_phone}
              onChangeText={(text) => this.setState({
                  details : {
                      ...this.state.details,
                      visit_contact_person_phone : text
                  }
              })}
          />

        <TextInput
        placeholder="Uwagi"
        value={this.state.details.visit_remarks}
        multiline={true}
        onChangeText={(text) => this.setState({
          details : {
            ...this.state.details,
            visit_remarks : text
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
