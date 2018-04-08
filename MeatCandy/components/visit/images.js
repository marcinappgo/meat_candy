import React, {Component} from 'react'
import {View, Modal, Text, TextInput, ScrollView, Image} from 'react-native'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import styles from '../../containers/styles'
import Button from '../../containers/button'
import ButtonSmall from '../../containers/button_small'
import Permissions from 'react-native-permissions'

export default class VisitImages extends Component {

    constructor(props) {
        super(props)

        this.state = {
            images: props.images,
            modalVisible: false
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateImages = this.updateImages.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.images) {
            this.setState({images: nextProps.images});
        }

    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    updateImages() {
        this.props.updateImages(this.state.images);
        this.toggleModal();
    }


    shootPhoto(category) {

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
                        // let source = { uri : response.uri};

                        let images = this.state.images;
                        images.push({
                            source: response.uri,
                            category: category
                        })

                        this.setState({ images })
                    }
                })
            }else{
                alert('Proszę wyrazić zgodę na użycie kamery');
            }
        })

        return;

    }

    render() {

        let images = this.state.images.map((image, i) => {
            return (
                <View key={i} style={{flexDirection: 'row', margin: 10}}>
                    <View style={{flex:1}}>
                        <Image source={{uri: image.source}} style={{width: 100, height: 100}} />
                    </View>
                    <View style={{flex:1}}>

                        <Text>{image.category}</Text>
                        <ButtonSmall title="Usuń" onPress={() => {
                            let images = this.state.images;
                            images.splice(i,1);

                            this.setState({images});
                        }}/>
                    </View>
                </View>
            )
        });



        return (
            <View>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.updateImages()}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.modalTitle}>Zdjęcia z wizyty</Text>
                        <ScrollView style={{flex: 12}}>
                            <Button title="Konkurencja" onPress={() => {this.shootPhoto("Konkurencja")}} />
                            <Button title="Grupowanie ekspozycji" onPress={() => {this.shootPhoto("Grupowanie ekspozycji")}} />
                            <Button title="POS Konkurencji" onPress={() => {this.shootPhoto("POS Konkurencji")}} />
                            <Button title="POS Candy" onPress={() => {this.shootPhoto("POS Candy")}} />

                            {images}

                        </ScrollView>
                        <CloseModal closeModal={this.updateImages}/>
                    </View>
                </Modal>
                <Stage openModal={this.toggleModal} title="Zdjęcia"/>
            </View>
        )
    }
}
