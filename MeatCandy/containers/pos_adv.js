import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Linking, TextInput, Image, Text, View, PermissionsAndroid } from 'react-native';
import styles from './styles'
import ButtonSmall from './button_small'
import Permissions from 'react-native-permissions'


class PosAdv extends Component {


  constructor(props) {
    super(props);

    this.state = {
      pos: props.pos,
    }

  }

  showPhoto() {
    Linking.canOpenURL(this.state.photo.uri).then(supported => {
      if(supported) {
          return Linking.openURL(this.state.photo.uri);
      }else{
        alert('Nie mogę otworzyć zdjęcia')
      }
    }).catch((err) => alert(err))
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
            // let source = { uri : 'data:image/jpeg;base64,' + response.data };
            let source = { uri : response.uri};
            this.setState({
              pos : {...this.state.pos, photo : source}
            }, () => {this.props.updatePosAdv(this.state.pos)})
          }
        })
      }else{
        alert('Proszę wyrazić zgodę na użycie kamery');
      }
    })

    return;

  }

  render() {

    const {pos} = this.state;

    let image;

    if(pos.status != "Brak") {
      if(!pos.photo) {
        image = (
          <View style={{flex: 1}}>
          <ButtonSmall selected={false} onPress={this.shootPhoto.bind(this)} title="Zrób zdjęcie" />
          </View>
        )
      }else{
        image = (
          <View style={{flex: 1}}>
          <Image style={{width: 150, height: 150}} resizeMode="center" source={pos.photo} />
          </View>
        )
      }
    }

    let reason;

    if(pos.status != "Brak") {
      reason = (
        <View style={{flex: 1}}>
          <TextInput
            placeholder="opis"
            multiline={true}
            value={this.state.pos.reason}
            onChangeText={(text) => this.setState({pos : {...this.state.pos, reason : text}})}
            onBlur={() => {this.props.updatePosAdv(this.state.pos)}}
          />
        </View>
      )
    }

    return (
      <View style={styles.borderedView}>
          <View style={styles.unborderedList}>
            <Text style={{flex: 6}}>{pos.title}</Text>

            <View style={{flex: 2}}>
            <ButtonSmall selected={pos.status!="Tak"} title="Tak" onPress={() => this.setState({pos : {...this.state.pos, status : "Tak"}}, () => {this.props.updatePosAdv(this.state.pos)})} />
            </View>
            <View style={{flex: 2}}>
            <ButtonSmall selected={pos.status!="Nie"} title="Nie" onPress={() => this.setState({pos : {...this.state.pos, status : "Nie"}}, () => {this.props.updatePosAdv(this.state.pos)})} />
            </View>
            <View style={{flex: 2}}>
            <ButtonSmall selected={pos.status!="Brak"} title="Brak" onPress={() => this.setState({pos : {...this.state.pos, status : "Brak", photo: '', reason : ''}},() => {this.props.updatePosAdv(this.state.pos)})} />
            </View>
          </View>

        {image}
        {reason}
      </View>
    )
  }

}

export default PosAdv;
