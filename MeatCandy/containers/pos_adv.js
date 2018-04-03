import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Image, Text, View, PermissionsAndroid } from 'react-native';
import styles from './styles'
import ButtonSmall from './button_small'
import Permissions from 'react-native-permissions'


class PosAdv extends Component {

  constructor(props) {
    super(props);

    this.state = props.pos

  }

  shootPhoto() {

    Permissions.request('camera').then(response => {
      if(response == 'authorized') {
        let ImagePicker = require('react-native-image-picker')

        ImagePicker.launchCamera({
          title: 'Zrób zdjęcie',
          storageOptions : {
            skipBackup: true,
            path: 'images'
          }
        }, (response) => {
          if(response.didCancel) {

          }else if(response.error) {

          }else{
            let source = { uri : 'data:image/jpeg;base64,' + response.data };
            this.setState({
              photo : source
            })
          }
        })
      }else{
        alert('Proszę wyrazić zgodę na użycie kamery');
      }
    })

    return;

  }

  render() {

    const pos = this.state;

    let image;

    if(this.state.status != "Brak") {
      if(!this.state.photo) {
        image = (
          <View style={{flex: 1}}>
          <ButtonSmall selected={false} onPress={this.shootPhoto.bind(this)} title="Zrób zdjęcie" />
          </View>
        )
      }else{
        image = (
          <View style={{flex: 1}}>
          <Image style={{width: 100, height: 100}} source={this.state.photo} />
          </View>
        )
      }
    }

    let reason;

    return (
      <View style={styles.borderedView}>
          <View style={styles.unborderedList}>
            <Text style={{flex: 6}}>{pos.title}</Text>

            <View style={{flex: 2}}>
            <ButtonSmall selected={this.state.status!="Tak"} title="Tak" onPress={() => this.setState({status : "Tak"})} />
            </View>
            <View style={{flex: 2}}>
            <ButtonSmall selected={this.state.status!="Nie"} title="Nie" onPress={() => this.setState({status : "Nie"})} />
            </View>
            <View style={{flex: 2}}>
            <ButtonSmall selected={this.state.status!="Brak"} title="Brak" onPress={() => this.setState({status : "Brak"})} />
            </View>
          </View>

        {image}
        {reason}
      </View>
    )
  }

}

export default PosAdv;
