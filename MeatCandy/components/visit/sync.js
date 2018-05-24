import React, {Component} from 'react'
import {
    AsyncStorage, ScrollView, View, Text, TouchableOpacity, Alert, NativeModules,
    TouchableHighlight, Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import Button from '../../containers/button'
import styles from '../../containers/styles'
import HomeNav from '../../containers/home-nav'
import RNFS from 'react-native-fs'
import {API_URL} from "../../misc/Conf";
import * as Progress from 'react-native-progress';

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class Sync extends Component {

    static navigationOptions = {
        title: <HomeNav title="Synchronizacja i dane"/>
    };


    constructor(props) {
        super(props);

        this.state = {
            visits: {},
            synced: {},
            error: {},
            syncForce: {},
            visitStack: {},
            workTimeState: [],
            downloading: false,
            downloaded: 0,
            visitsInPlan: [],
            visitsInSync: []
        }

    }

    componentWillMount() {
        this.loadData();
    }

    async loadData() {
        await AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {
            if (list) {
                list = JSON.parse(list);

                this.setState({
                    visits: list
                })


            }
        }).catch((err) => console.warn(err))

        await AsyncStorage.getItem('@CandyMerch:visitSynced').then((list) => {
            if (list) {
                list = JSON.parse(list);

                this.setState({
                    synced: list
                })


            }
        }).catch((err) => console.warn(err))

        await AsyncStorage.getItem('@CandyMerch:visitErrorSync').then((list) => {
            if (list) {
                list = JSON.parse(list);

                this.setState({
                    error: list
                })


            }
        }).catch((err) => console.warn(err))

        await AsyncStorage.getItem('@CandyMerch:workTimeState').then((state) => {
            if (state) {
                state = JSON.parse(state);
            } else {
                state = [];
            }

            this.setState({
                workTimeState: state
            })
        });

        // await AsyncStorage.getAllKeys()

        await fetch(API_URL + 'api/visit-info.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        })
            .then((r) => r.json())
            .then(async (r) => {

                if (r.status == "success") {

                    let visits = [];

                    for (let i in r.response.plan) {

                        await AsyncStorage.getItem('@CandyMerch:visitDetails' + i).then((details) => {
                            if (details) {
                                let visit = JSON.parse(details);

                                if (visit.visit_obj.visit_plan_visit_id < 0) {

                                    if (r.response.plan[i] > 0) {
                                        visit.visit_obj.visit_plan_visit_id = r.response.plan[i]
                                    }
                                    visits.unshift(visit);
                                }

                            }
                        })
                    }

                    this.setState({
                        visitsInPlan: visits
                    })
                } else {
                    console.error(r.message);
                }


            });
    }

    async componentDidMount() {


    }

    async sendSingleVisit(visit) {
        if (visit.visit_obj.visit_plan_visit_id > 0) {
            Alert.alert("Wizyta zsynchronizowana")
        } else {
            Alert.alert("Wizyta do synchronizacji", "Czy zsynchronizować wizytę?", [
                {
                    text: 'Tak', onPress: async () => {

                    let vis = this.state.visitsInSync;

                    if (vis.indexOf(visit.visit_obj.visit_plan_id) == -1) {
                        vis.push(visit.visit_obj.visit_plan_id)
                        this.setState({
                            visitsInSync: vis
                        })
                    }


                    let ret = await this.sendVisit(visit);
                    if (vis.indexOf(visit.visit_obj.visit_plan_id) > -1) {
                        vis.splice(vis.indexOf(visit.visit_obj.visit_plan_id), 1)
                        this.setState({
                            visitsInSync: vis
                        })
                    }

                    if (ret) {

                        Alert.alert("Wizyta zsynchronizowana")
                    } else {
                        Alert.alert("Błąd synchronizacji")
                        visit.visit_obj.visit_plan_visit_id = -3;
                        await AsyncStorage.setItem('@CandyMerch:visitDetails' + visit.visit_obj.visit_plan_id, JSON.stringify(visit));
                    }


                    await this.loadData()
                }
                },
                {
                    text: 'Nie', onPress: () => {
                }
                }
            ])
        }
    }

    async sendVisit(visit) {

        let fd = new FormData();

        fd.append('visit', JSON.stringify(visit));

        for (let i in visit.images) {
            fd.append('files[' + visit.images[i].source + ']', {
                uri: visit.images[i].source,
                type: 'image/jpeg',
                name: visit.images[i].source.replace(/^.*[\\\/]/, '')
            });
        }


        let $ret = false;

        await fetch(API_URL + 'api/new-visit.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            },
            body: fd
        })
            .then(async (r) => {
                return r.json();
            })
            .then((r) => {

                if (r.status == 'success') {
                    $ret = true;
                }
                else {
                    $ret = false;
                }


            })
            .catch((err) => {
                $ret = false;
                console.warn(err);
            })

        return $ret;
    }

    async syncVisit() {
        if (Object.keys(this.state.visits).length > 0) {
            let key = Object.keys(this.state.visits)[0];
            let visits = this.state.visits;
            let synced = this.state.synced;
            let error = this.state.error;

            let visit = visits[key];

            let success = await this.sendVisit(visit);

            if (success) {
                synced[key] = visit;
                delete visits[key];
            } else {
                error[key] = visit;
                delete visits[key];
                visit.visit_obj.visit_plan_visit_id = -3;
                await AsyncStorage.setItem('@CandyMerch:visitDetails' + visit.visit_obj.visit_plan_id, JSON.stringify(visit));
            }

            this.setState({
                visits: visits,
                synced: synced,
                error: error
            }, () => {
                this.syncVisit();
            })
        } else {
            AsyncStorage.setItem('@CandyMerch:visitToSync', JSON.stringify(this.state.visits));
            AsyncStorage.setItem('@CandyMerch:visitSynced', JSON.stringify(this.state.synced));
            AsyncStorage.setItem('@CandyMerch:visitErrorSync', JSON.stringify(this.state.error));

        }

    }

    syncWorkTime() {
        AsyncStorage.getItem('@CandyMerch:workTimeState').then(state => {
            if (state) {

                let fd = new FormData;
                fd.append('work-time', state);

                fetch(API_URL + 'api/work-time.php', {
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'User-Token': this.props.token
                    },
                    body: fd
                }).then(() => {
                    state = JSON.parse(state);
                    if (state.length) {
                        state = [state.pop()]
                    } else {
                        state = [];
                    }
                    AsyncStorage.setItem('@CandyMerch:workTimeState', JSON.stringify(state)).then(() => {
                        this.setState({
                            workTimeState: []
                        })
                    });
                }).catch((err) => console.warn(err));

            }
        })
    }

    async syncSku() {
        await fetch(API_URL + 'api/products.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    AsyncStorage.setItem('@CandyMerch:sku', JSON.stringify(responseJson.response.products)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        }, this.syncAlert)
                    });
                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async syncPlan() {
        await fetch(API_URL + 'api/new-visit.php', {
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
                        }, this.syncAlert)
                    })

                } else {

                }
            }).catch((err) => alert(err))
    }

    async syncCompetitionCategories() {
        await fetch(API_URL + 'api/competition.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    AsyncStorage.setItem('@CandyMerch:competitionCategories', JSON.stringify(responseJson.response.categories)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        }, this.syncAlert)
                    });
                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async syncExtendedCompetitionCategories() {
        await fetch(API_URL + 'api/competition_categories.php', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    AsyncStorage.setItem('@CandyMerch:extendedCompetitionCategories', JSON.stringify(responseJson.response.categories)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        }, this.syncAlert)
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

    async syncTrainings() {
        await fetch(API_URL + 'api/trainings.php', {
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
                        for (let ind2 in trainings[ind].materials) {
                            let src = trainings[ind].materials[ind2].source;

                            var path = RNFS.ExternalDirectoryPath + '/' + ind + '-' + ind2 + '-' + src.replace(/^.*[\\\/]/, '');

                            this.download(src, path);

                            trainings[ind].materials[ind2].source = 'file://' + RNFS.ExternalDirectoryPath + '/' + ind + '-' + ind2 + '-' + src.replace(/^.*[\\\/]/, '');

                        }
                    }

                    AsyncStorage.setItem('@CandyMerch:trainings', JSON.stringify(trainings)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        }, this.syncAlert)
                    });

                } else if (responseJson.status == 'error') {
                    alert(responseJson.message)
                }
            }).catch((err) => alert(err));
    }

    async syncTarget() {
        await fetch(API_URL + 'api/targets.php', {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'User-Token': this.props.token
            }
        }).then((r) => r.json())
            .then((r) => {
                if (r.status == 'success') {
                    let targets = r.response.targets;

                    AsyncStorage.setItem('@CandyMerch:targets', JSON.stringify(targets)).then(() => {
                        this.setState({
                            downloaded: this.state.downloaded + 1
                        }, this.syncAlert)
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
            this.syncExtendedCompetitionCategories();
            this.syncTrainings();
            this.syncTarget();
            this.loadData();
        })

    }


    async syncForce() {
        await AsyncStorage.getAllKeys().then(async (keys) => {
            let synced = this.state.synced;
            let visits = this.state.visits;
            let error = this.state.error;
            let forced = 0;
            for (let key of keys) {
                if (/^@CandyMerch:visitDetails/.test(key)) {
                    await AsyncStorage.getItem(key).then(async (v) => {
                        if (v) {

                            visit = JSON.parse(v);

                            let vid = visit.visit_obj.visit_plan_id;

                            if (visit.visit_obj.visit_plan_visit_id < 0) {


                                let success = await this.sendVisit(visit);


                                if (success) {
                                    forced++;

                                    if (vid in error) {
                                        synced[vid] = visit;
                                        delete error[vid];
                                    } else if (vid in visits) {
                                        synced[vid] = visit;
                                        delete visits[vid];
                                    } else {
                                        synced[vid] = visit;
                                    }

                                }

                            }

                        }
                    })
                }
            }

            this.setState({
                synced: synced,
                visits: visits,
                error: error
            }, () => {
                AsyncStorage.setItem('@CandyMerch:visitToSync', JSON.stringify(this.state.visits));
                AsyncStorage.setItem('@CandyMerch:visitSynced', JSON.stringify(this.state.synced));
                AsyncStorage.setItem('@CandyMerch:visitErrorSync', JSON.stringify(this.state.error));
            })

            alert('Wykonano próbę synchronizacji (' + forced + ')');

        })
    }

    async clearStorage() {

        Alert.alert('Czyszczenie danych zapisanych', 'Czy na pewno chcesz usunąć zapisane dane?', [
            {
                text: 'Tak', onPress: () => {
                AsyncStorage.getAllKeys().then(async (keys) => {
                    for (let key of keys) {
                        if (/^@CandyMerch:visit/.test(key) && key != '@CandyMerch:userToken') {
                            await AsyncStorage.removeItem(key).then(() => {
                                this.loadData()


                            })
                        }
                    }
                    Alert.alert("Zakończono czyszczenie danych")
                });
            }
            },
            {
                text: 'Nie', onPress: () => {
            }
            }
        ])


    }

    syncAlert() {
        if (this.state.downloaded == 6) {

            this.setState({
                downloaded: 0,
                downloading: false
            })

            /*Alert.alert("Zakończono synchronizację", "", [
                {
                    text: "OK",
                    onPress: () => {
                        this.setState({
                            downloaded : 0,
                            downloading: false
                        })
                    }
                }
            ])*/
        }
    }

    render() {

        let visits = Object.keys(this.state.visits).map((i) => <Text
            key={i}>{this.state.visits[i].visit_obj.pos_name}</Text>);
        let synced = Object.keys(this.state.synced).map((i) => <Text
            key={i}>{this.state.synced[i].visit_obj.pos_name}</Text>);
        let error = Object.keys(this.state.error).map((i) => <Text
            key={i}>{this.state.error[i].visit_obj.pos_name}</Text>);
        let workTime = this.state.workTimeState.map((state, i) => {

            let date = new Date(state.date);
            let text = state.state == 'start' ? 'Rozpoczęcie' : 'Zakończenie';
            return (
                <Text
                    key={i}>{text}{"\n"}{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}{"\n"}{date.getHours()}:{date.getMinutes()}</Text>
            )

        })

        let downloading;

        if (this.state.downloading) {


            downloading = <View style={{alignItems: 'center'}}>
                <Progress.Bar progress={this.state.downloaded / 6} width={Dimensions.get('window').width - 40}/>
            </View>


        }

        let visitsStack = this.state.visitsInPlan.map((visit, index) => {


            let stylesArr = [];
            let status = "do synchronizacji"

            if (visit.visit_obj.visit_plan_visit_id > 0) {
                status = "zsynchornizowana"
                stylesArr.push(styles.selectedButton)

            } else {
                stylesArr.push(styles.button)
                if (visit.visit_obj.visit_plan_visit_id == -2) {
                    status = "odwołana"
                    stylesArr.push(styles.posAplus)
                } else {
                    if (visit.visit_obj.visit_plan_visit_id == -3) {
                        status = "błąd synchronizacji"
                        stylesArr.push(styles.posAplus)
                    }
                }
            }

            let inSync;
            if (this.state.visitsInSync.indexOf(visit.visit_obj.visit_plan_id) > -1) {
                inSync = <Progress.Bar indeterminate={true} width={Dimensions.get('window').width - 100} color="#ffffff"
                                       borderColor="#ffffff"/>
            }


            return (
                <TouchableHighlight
                    key={index}
                    style={[stylesArr, {alignItems: null, padding: 5}]}
                    onPress={() => {
                        this.sendSingleVisit(visit)
                    }}
                >
                    <View>
                        <Text style={[{
                            margin: 0,
                            padding: 0
                        }, styles.pos, visit.visit_obj.visit_plan_visit_id > 0 ? styles.selectedButtonText : styles.buttonText]}>
                            <Text style={styles.posSubtitle}>Status: {status}</Text>{'\n'}
                            {visit.visit_obj.pos_number} - {visit.visit_obj.pos_network}
                            - {visit.visit_obj.pos_name}{"\n"}
                            <Text style={styles.posSubtitle}>{visit.visit_obj.pos_address} - {visit.visit_obj.pos_city}
                                - {(new Date(visit.details.visit_start_time).toISOString().split('T')[0])}</Text>
                        </Text>
                        {inSync}
                    </View>
                </TouchableHighlight>
            )
        })

        return (
            <View style={{flex: 1}}>
                <View style={{flex: 8}}>
                    <ScrollView>
                        {/*<View style={{flex: 1, flexDirection: 'row'}}>*/}
                        {/*<View style={{flex: 1}}>*/}
                        {/*<TouchableOpacity style={styles.panel}>*/}
                        {/*<Text style={styles.boldText}>Do synchornizacji</Text>*/}
                        {/*{visits}*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*<View style={{flex: 1}}>*/}
                        {/*<TouchableOpacity style={styles.panel}>*/}
                        {/*<Text style={styles.boldText}>Zsynchronizowane</Text>*/}
                        {/*{synced}*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*<View style={{flex: 1}}>*/}
                        {/*<TouchableOpacity style={styles.panel}>*/}
                        {/*<Text style={styles.boldText}>Błędy synchronizacji</Text>*/}
                        {/*{error}*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*</View>*/}
                        {visitsStack}
                    </ScrollView>
                    {downloading}

                </View>
                <View style={{flex: 4}}>
                    <Button onPress={this.sync.bind(this)} title="Synchronizacja"/>
                    <Button onPress={this.clearStorage.bind(this)} title="Wyczyść zapisane dane"/>

                    {/*<Button onPress={this.syncForce.bind(this)} title="Wymuś synchronizację"/>*/}
                </View>
            </View>
        )
    }

}

export default connect(mapStateToProps)(Sync);
