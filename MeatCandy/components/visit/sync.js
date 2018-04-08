import React, {Component} from 'react'
import {AsyncStorage, ScrollView, View, Text, TouchableOpacity, Alert, NativeModules} from 'react-native'
import {connect} from 'react-redux'
import Button from '../../containers/button'
import styles from '../../containers/styles'
import HomeNav from '../../containers/home-nav'
import RNFS from 'react-native-fs'

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
            workTimeState: [],
            downloading: false,
            downloaded: 0
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

    async sendVisit(visit) {

        let fd = new FormData();

        fd.append('visit', JSON.stringify(visit));

        for(let i in visit.images) {
            fd.append('files['+visit.images[i].source+']', {uri : visit.images[i].source, type: 'image/jpeg', name: visit.images[i].source.replace(/^.*[\\\/]/, '')});
        }



        await fetch('https://candy.meatnet.pl/api/new-visit.php',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            },
            body: fd
        }).then((r) => r.json())

            .catch((err) => {
            console.warn(err)
        })
    }

    syncVisit() {
        if (Object.keys(this.state.visits).length > 0) {
            let key = Object.keys(this.state.visits)[0];
            let visits = this.state.visits;
            let synced = this.state.synced;

            let visit = visits[key];

            this.sendVisit(visit);

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

    syncWorkTime() {
        AsyncStorage.getItem('@CandyMerch:workTimeState').then(state => {
            if(state) {

                let fd = new FormData;
                fd.append('work-time', state);

                fetch('https://candy.meatnet.pl/api/work-time.php',{
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'User-Token': this.props.token
                    },
                    body: fd
                }).then(() => {
                    let state = [];
                    AsyncStorage.setItem('@CandyMerch:workTimeState',JSON.stringify(state)).then(() => {
                        this.setState({
                            workTimeState: []
                        })
                    });
                }).catch((err) => console.warn(err));

            }
        })
    }

    async syncSku() {
        await fetch('https://candy.meatnet.pl/api/products.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    AsyncStorage.setItem('@CandyMerch:sku',JSON.stringify(responseJson.response.products)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        })
                    });
                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async syncPlan() {
        await fetch('https://candy.meatnet.pl/api/new-visit.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "User-Token": this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == 'success') {
                    this.setState({
                        plan: responseJson.response.plan
                    })

                    AsyncStorage.setItem('@CandyMerch:plan', JSON.stringify(responseJson.response.plan)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        })
                    })

                } else {

                }
            }).catch((err) => alert(err))
    }

    async syncCompetitionCategories() {
        await fetch('https://candy.meatnet.pl/api/competition.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    AsyncStorage.setItem('@CandyMerch:competitionCategories',JSON.stringify(responseJson.response.categories)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        })
                    });
                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async download(src, path) {
        await RNFS.downloadFile({
            fromUrl: src,
            toFile: path
        });
    }

    async  syncTrainings() {
        await fetch('https://candy.meatnet.pl/api/trainings.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    let trainings = responseJson.response.trainings

                    for (let ind in trainings) {
                        for(let ind2 in trainings[ind].materials) {
                            let src = trainings[ind].materials[ind2].source;

                            var path = RNFS.ExternalDirectoryPath + '/' + ind + '-' + ind2 + '-' + src.replace(/^.*[\\\/]/, '');

                            this.download(src, path);

                            trainings[ind].materials[ind2].source = 'file://' + RNFS.ExternalDirectoryPath + '/' + ind + '-' + ind2 + '-' + src.replace(/^.*[\\\/]/, '');

                        }
                    }

                    AsyncStorage.setItem('@CandyMerch:trainings', JSON.stringify(trainings)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        })
                    });

                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async syncTarget() {
        await fetch('https://candy.meatnet.pl/api/targets.php', {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((r) => r.json())
            .then((r) => {
            if(r.status == 'success') {
                let targets = r.response.targets;

                AsyncStorage.setItem('@CandyMerch:targets', JSON.stringify(targets)).then(() => {
                    this.setState({
                        downloaded: this.state.downloaded + 1
                    })
                });

            }
            }).catch((err) => console.warn(err));
    }

    sync() {
        this.setState({
            downloading: true,
            downloaded: 0
        }, () => {
            this.syncVisit();
            this.syncWorkTime();
            this.syncSku();
            this.syncPlan();
            this.syncCompetitionCategories();
            this.syncTrainings();
            this.syncTarget();
        })

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

        let downloading;

        if(this.state.downloading) {
            downloading = (
                <View>
                    <Text>Pobieram {this.state.downloaded} / 5</Text>
                </View>
            )
        }

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
                    {downloading}
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
