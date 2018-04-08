import React, {Component} from 'react'
import {AsyncStorage, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native'
import {connect} from 'react-redux'
import Button from '../../containers/button'
import styles from '../../containers/styles'
import HomeNav from '../../containers/home-nav'

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class Sync extends Component {

    static navigationOptions = {
        title: <HomeNav title="Synchronizacja i dane" />
    };


    constructor(props) {
        super(props);

        this.state = {
            visits: {},
            synced: {},
            workTimeState: []
        }
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {
            if (list) {
                list = JSON.parse(list);

                this.setState({
                    visits: list
                })


            }
        }).catch((err) => console.warn(err))

        AsyncStorage.getItem('@CandyMerch:visitSynced').then((list) => {
            if (list) {
                list = JSON.parse(list);

                this.setState({
                    synced: list
                })


            }
        }).catch((err) => console.warn(err))

        AsyncStorage.getItem('@CandyMerch:workTimeState').then((state) => {
            if(state) {
                state = JSON.parse(state);
            }else{
                state = [];
            }

            this.setState({
                workTimeState : state
            })
        });
    }

    componentDidMount() {

    }

    syncVisit() {
        if (Object.keys(this.state.visits).length > 0) {
            let key = Object.keys(this.state.visits)[0];
            let visits = this.state.visits;
            let synced = this.state.synced;

            let visit = visits[key];
            synced[key] = visit;
            delete visits[key];

            this.setState({
                visits: visits,
                synced: synced
            }, () => {
                this.syncVisit();
            })
        } else {
            AsyncStorage.setItem('@CandyMerch:visitToSync', JSON.stringify(this.state.visits));
            AsyncStorage.setItem('@CandyMerch:visitSynced', JSON.stringify(this.state.synced));
        }

    }

    sync() {

        this.syncVisit();
    }

    clearStorage() {

        Alert.alert('Czyszczenie danych zapisanych', 'Czy na pewno chcesz usunąć zapisane dane?',[
            {text: 'Tak', onPress: () => {
                AsyncStorage.getAllKeys().then((keys) => {
                    for (let key of keys) {
                        if (/^@CandyMerch:visit/.test(key) && key != '@CandyMerch:userToken') {
                            AsyncStorage.removeItem(key).then(() => {
                                this.loadData()
                            })
                        }
                    }
                });
            }},
            {text: 'Nie', onPress: () => {}}
        ])


    }

    render() {

        let visits = Object.keys(this.state.visits).map((i) => <Text key={i}>{this.state.visits[i].visit_obj.pos_name}</Text>);
        let synced = Object.keys(this.state.synced).map((i) => <Text key={i}>{this.state.synced[i].visit_obj.pos_name}</Text>);
        let workTime = this.state.workTimeState.map((state, i) => {

            let date = new Date(state.date);
            let text = state.state == 'start'?'Rozpoczęcie':'Zakończenie';
            return (
                <Text key={i}>{text}{"\n"}{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}{"\n"}{date.getHours()}:{date.getMinutes()}</Text>
            )

        })

        return (
            <View style={{flex: 1}}>
                <View style={{flex: 8}}>
                    <ScrollView>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.panel}>
                                <Text style={styles.boldText}>Do synchornizacji</Text>
                                {visits}
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.panel}>
                                <Text style={styles.boldText}>Zsynchronizowane</Text>
                                {synced}
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.panel}>
                                <Text style={styles.boldText}>Czas pracy</Text>
                                {workTime}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>
                    <Button onPress={this.sync.bind(this)} title="Synchronizacja"/>
                </View>
                <View style={{flex: 2}}>

                    <Button onPress={this.clearStorage.bind(this)} title="Wyczyść zapisane dane"/>
                </View>
            </View>
        )
    }

}

export default connect(mapStateToProps)(Sync);
