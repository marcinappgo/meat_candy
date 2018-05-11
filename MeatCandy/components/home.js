import React, {Component} from 'react'
import {
    View, Button, AsyncStorage, TouchableHighlight, StyleSheet, Text, ScrollView, Modal, TextInput
} from 'react-native'

import {connect, dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logoutUser} from '../actions/auth'
import styles from '../containers/styles'
import CloseModal from '../containers/close-modal'
import {API_URL} from "../misc/Conf";

const mapStateToProps = (state) => {
    return {
        userLoggedIn: state.userLoggedIn
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({logoutUser}, dispatch);

class Home extends Component {

    static navigationOptions = {
        title: 'CandyMerch',
    };

    logout = () => {
        fetch(API_URL + 'api/auth.php?a=logout', {
            method: "GET",
            headers: {
                Accept: 'application/json'
            }

        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == "success") {
                    AsyncStorage.removeItem('@CandyMerch:userToken').then(() => {
                        this.props.logoutUser();
                        // this.props.navigation.state.params.updateUser(false);
                    })

                    ;
                } else {
                    alert(responseJson.message)
                }

            })
            .catch(err => {
                alert("Error: " + err.message + "\n" + err.stack);
            })
    }

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);

        this.state = {
            state : 'end',
            startTimeModalVisible: false,
            endTimeModalVisible: false,
            startTimeDistance : ""
        }
    }

    setDistance(distance) {
        this.setState({
            startTimeDistance : (distance + "")
        })
    }

    async startTracking() {
        if(!this.state.startTimeDistance)return;


        await AsyncStorage.getItem('@CandyMerch:workTimeState').then((state) => {
            if(state) {
                state = JSON.parse(state);
            }else{
                state = [{
                    state : 'end',
                    date : Date.now()
                }];
            }

            let newState = {
                state : 'start',
                date : Date.now(),
                distance : this.state.startTimeDistance
            }

            state.push(newState);

            this.setState({
                state : newState.state,
                startTimeModalVisible : false,
                startTimeDistance: ""
            }, () => {
                AsyncStorage.setItem('@CandyMerch:workTimeState', JSON.stringify(state))
            })

        })
    }

    startTrackingModal() {
        this.setState({
            startTimeModalVisible: true
        })
    }

    endTrackingModal() {
        this.setState({
            endTimeModalVisible: true
        })
    }

    async endTracking() {
        if(!this.state.startTimeDistance)return;

        await AsyncStorage.getItem('@CandyMerch:workTimeState').then((state) => {
            if(state) {
                state = JSON.parse(state);
            }else{
                state = [{
                    state : 'end',
                    date : Date.now(),
                    distance : ""
                }];
            }

            let newState = {
                state : 'end',
                date : Date.now(),
                distance : this.state.startTimeDistance
            }

            state.push(newState);

            this.setState({
                state : newState.state,
                endTimeModalVisible : false,
                startTimeDistance: ""
            }, () => {
                AsyncStorage.setItem('@CandyMerch:workTimeState', JSON.stringify(state))
            })

        })
    }

    async componentWillMount() {
        await AsyncStorage.getItem('@CandyMerch:workTimeState').then((state) => {
            if(state) {
                state = JSON.parse(state);

                //console.warn(state);

                if(state.length == 0) {
                    state = [{
                        state : 'end',
                        date : Date.now()
                    }];
                }
            }else{
                state = [{
                    state : 'end',
                    date : Date.now()
                }];
            }

            currentState = state[state.length - 1];

            this.setState({
                state : currentState.state
            })

        })
    }

    render() {
        const {navigate} = this.props.navigation;

        let topButton;

        if(this.state.state == 'end') {
            topButton = <TouchableHighlight style={styles.button} onPress={() => {this.startTrackingModal()}}>
                <Text style={styles.buttonText}> Start pracy </Text>
            </TouchableHighlight>;
        }else{
            topButton = <TouchableHighlight style={styles.button} onPress={() => {this.endTrackingModal()}}>
                <Text style={styles.buttonText}> Koniec pracy </Text>
            </TouchableHighlight>;
        }

        return (
            <ScrollView>
                <Modal
                    visible={this.state.startTimeModalVisible}
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    onRequestClose={() => {}}
                >

                    <View style={{flex:1}}>
                        <Text style={styles.modalTitle}>Podaj stan licznika</Text>
                        <TextInput onChangeText={(value) => {
                            this.setDistance(value)
                        }} placeholder="Podaj stan licznika" keyboardType="numeric"/>
                        <CloseModal closeModal={this.startTracking.bind(this)} />
                    </View>
                </Modal>

                <Modal
                    visible={this.state.endTimeModalVisible}
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    onRequestClose={() => {}}
                >

                    <View style={{flex:1}}>
                        <Text style={styles.modalTitle}>Podaj stan licznika</Text>
                        <TextInput onChangeText={(value) => {
                            this.setDistance(value)
                        }} placeholder="Podaj stan licznika" keyboardType="numeric"/>
                        <CloseModal closeModal={this.endTracking.bind(this)} />
                    </View>
                </Modal>

                {topButton}

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => navigate('Calendar')}
                >
                    <Text style={styles.buttonText}> Harmonogram </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => navigate('Plan')}
                >
                    <Text style={styles.buttonText}> Nowa wizyta </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => navigate('Sync')}
                >
                    <Text style={styles.buttonText}> Synchronizacja i dane </Text>
                </TouchableHighlight>


                <TouchableHighlight
                    style={styles.button}
                    onPress={() => navigate('Target')}
                >
                    <Text style={styles.buttonText}> Targety </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => this.logout()}
                >
                    <Text style={styles.buttonText}> Wyloguj się </Text>
                </TouchableHighlight>
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
