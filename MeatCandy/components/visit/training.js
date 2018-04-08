import React, {Component} from 'react'
import {View, Modal, Text, ScrollView, TextInput, TouchableHighlight, Linking, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import Button from '../../containers/button'
import styles from '../../containers/styles'

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class VisitTraining extends Component {

    constructor(props) {
        super(props)

        this.state = {
            training: this.props.training,
            modalVisible: false,
            trainings: [],
            showMaterials:false
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateTraining = this.updateTraining.bind(this)
    }

    componentWillMount() {

        AsyncStorage.getItem('@CandyMerch:trainings').then((trainings) => {
            if(trainings) {
                this.setState({
                    trainings: JSON.parse(trainings)
                })
            }else{
                fetch('https://candy.meatnet.pl/api/trainings.php', {
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
            this.setState({
                training: nextProps.training
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

            stylesA.push(styles.button);

            return (
                <TouchableHighlight
                    key={training.id}
                    style={stylesA}
                    // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
                    onPress={() => this.setState({
                        training: {
                            ...training,
                            count: "",
                            names: "",
                            subject: training.title
                        }
                    })}
                >
                    <Text style={styles.buttonText}>
                        {training.title}
                    </Text>
                </TouchableHighlight>
            )

        })

        let materials;



        if(this.state.showMaterials && (this.state.training.materials)) {

            // console.warn(this.state.training.materials);//

            materials = this.state.training.materials.map((material, i) => {
                return (
                    <Button key={i} title={material.name} onPress={() => this.showMaterials(material.source)} />
                )
            })
        }

        if ("undefined" == typeof this.state.training.id) {
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
                            <CloseModal closeModal={this.updateTraining}/>
                        </View>
                    </Modal>
                    <Stage openModal={this.toggleModal} title="Szkolenie"/>
                </View>
            )
        } else {

            let title = "Szkolenie: " + this.state.training.title

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
                                <Button title="Wybierz inne szkolenie" onPress={() => this.setState({
                                    training: {}
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
