import React, {Component} from 'react'
import {View, Modal, Text, ScrollView, TextInput, TouchableHighlight, Linking, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import Button from '../../containers/button'
import styles from '../../containers/styles'
import {API_URL} from "../../misc/Conf";

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class VisitTraining extends Component {

    constructor(props) {
        super(props)

        let training = this.props.training;
        if(!training['ids'])
            training.ids = [];

        this.state = {
            training: training,
            modalVisible: false,
            modalTrainingsVisible: (training.ids.length > 0),
            trainings: [],
            showMaterials:false,
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateTraining = this.updateTraining.bind(this)


    }



    componentWillMount() {

        if(this.state.training.ids.length == 0 ) {
            console.log()

            this.setState({
                modalTrainingsVisible: true
            })
        }


        AsyncStorage.getItem('@CandyMerch:trainings').then((trainings) => {
            if(trainings) {
                this.setState({
                    trainings: JSON.parse(trainings)
                })
            }else{
                fetch(API_URL + 'api/trainings.php', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'User-Token': this.props.token
                    }
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status == 'success') {
                            this.setState({
                                trainings: responseJson.response.trainings
                            })
                        } else if (responseJson.status == 'error') {
                            alert(responseJson.message)
                        }
                    }).catch((err) => alert(err));
            }


        })



    }

    toggleTraining(training) {
        let ids = this.state.training.ids;
        let ind = ids.indexOf(training.id);

        if(ind == -1) {
            ids.push(training.id)
        }else{
            ids.splice(ind, 1);
        }


        this.setState({
            training : {
                ...training,
                ids: ids
            }
        });
    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    updateTraining() {
        this.props.updateTraining(this.state.training);
        this.toggleModal();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.training) {

            let training = nextProps.training;

            if(!training.ids)
                training.ids = []

            this.setState({
                training: training
            })
        }
    }

    showMaterials(uri) {
        Linking.canOpenURL(uri).then(supported => {
            if (supported) {
                return Linking.openURL(uri);
            } else {
                alert('Nie mogę otworzyć materiałów')
            }
        }).catch((err) => alert(err))
    }

    toggleMaterials() {
        this.setState({showMaterials:!this.state.showMaterials})
    }

    render() {

        let trainings = this.state.trainings.map((training) => {

            let stylesA = [];

            if(training.recommended) {
                stylesA.push(styles.posAplus);
            }

            let ind = -1;

            if(this.state.training.ids) {
                ind = this.state.training.ids.indexOf(training.id);
            }

            let stylesText = [];

            if(ind == -1) {
                stylesA.push(styles.button);
                stylesText.push(styles.buttonText)
            }else{
                stylesA.push(styles.selectedButton);
                stylesText.push(styles.selectedButtonText)
            }


            return (
                <TouchableHighlight
                    key={training.id}
                    style={stylesA}
                    // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
                    onPressNoLonger={() => this.setState({
                        training: {
                            ...training,
                            count: "",
                            names: "",
                            subject: training.title
                        }
                    })}
                    onPress={() => this.toggleTraining(training)}
                >
                    <Text style={stylesText}>
                        {training.title}
                    </Text>
                </TouchableHighlight>
            )

        })

        let materials;


        if(this.state.showMaterials) {

            materials =
                this.state.trainings.map((training) => {
                    if(this.state.training.ids.indexOf(training.id) > -1) {
                        return training.materials.map((material) => {
                            return (
                                <Button key={material.source} title={material.name?material.name:material.source.split('/').pop()} onPress={() => this.showMaterials(material.source)} />
                            )
                        })
                    }else{
                        return null
                    }
                })


        }

        if (this.state.modalTrainingsVisible) {
            return (
                <View>
                    <Modal
                        style={styles.modal}
                        animation="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.updateCompetition()}
                    >
                        <View style={{flex: 1}}>
                            <Text style={styles.modalTitle}>Wybierz Szkolenie</Text>
                            <ScrollView style={{flex: 12}}>
                                {trainings}
                            </ScrollView>
                            <CloseModal closeModal={() => this.setState({modalTrainingsVisible: false})}/>
                        </View>
                    </Modal>
                    <Stage openModal={this.toggleModal} title="Szkolenie"/>
                </View>
            )
        } else {

            let title = "Szkolenie"

            return (
                <View>
                    <Modal
                        style={styles.modal}
                        animation="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.updateTraining()}
                    >
                        <View style={{flex: 1}}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <ScrollView style={{flex: 12}}>
                                <Button title="Wybierz szkolenia" onPress={() => this.setState({
                                    modalTrainingsVisible: true
                                })} style={{margin: 5}}/>
                                <Button title="Materiały" onPress={() => this.toggleMaterials()} style={{margin: 5}}/>
                                {materials}
                                <TextInput
                                    placeholder="Temat szkolenia"
                                    onChangeText={(text) => this.setState({
                                        training: {
                                            ...this.state.training,
                                            subject: text
                                        }
                                    })}
                                    value={this.state.training.subject}
                                />
                                <TextInput
                                    placeholder="Ilość uczestników"
                                    keyboardType="numeric"
                                    onChangeText={(text) => this.setState({
                                        training: {
                                            ...this.state.training,
                                            count: text
                                        }
                                    })}
                                    value={this.state.training.count}
                                />
                                <TextInput
                                    placeholder="Nazwiska uczestników"
                                    multiline={true}
                                    onChangeText={(text) => this.setState({
                                        training: {
                                            ...this.state.training,
                                            names: text
                                        }
                                    })}
                                    value={this.state.training.names}
                                />
                            </ScrollView>
                            <CloseModal closeModal={this.updateTraining}/>
                        </View>
                    </Modal>
                    <Stage openModal={this.toggleModal} title={title}/>
                </View>
            )
        }


    }
}

export default connect(mapStateToProps)(VisitTraining)
