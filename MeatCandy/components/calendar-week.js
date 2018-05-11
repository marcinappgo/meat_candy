import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    ScrollView,
    Button,
    TextInput,
    Alert,
    Modal,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import Pos from '../containers/pos'
import styles from '../containers/styles'
import ButtonSmall from '../containers/button_small'
import GroupedPosList from '../containers/grouped-pos-list'
import MyButton from '../containers/my-button'
import CloseModal from '../containers/close-modal'
import PosModal from '../containers/pos-modal'
import {API_URL} from "../misc/Conf";

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class CalendarWeek extends Component {

    static navigationOptions = ({navigation}) => {

        let months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ]

        //title: 'Harmonogram ' + (new Date().getYear()) + ' ' + this.months[this.props.navigation.params.month]
        return {
            title: (months[navigation.state.params.month] + ' ' + (new Date().getFullYear()) + ' Tydzień ' + navigation.state.params.week),
            headerRight: (<Button onPress={() => navigation.state.params.handleSubmit()} title="Zapisz"/>)
        }
    };

    constructor(props) {
        super(props)

        this.state = {
            posList: [],
            allPosList: [],
            aplus: {},
            posToSend: [],
            posToSendExtra: [],
            month: this.props.navigation.state.params.month + 1,
            week: this.props.navigation.state.params.week,
            day: this.props.navigation.state.params.day,
            posFilter: "",
            option: 'filter',
            modalVisible: false,
            modalExtraVisible: false,
            panelGroup: false,
            closedVisits: []
        }

        this.save = this.save.bind(this);
        this.saveExtra = this.saveExtra.bind(this);
        this.togglePos = this.togglePos.bind(this);
        this.togglePosExtra = this.togglePosExtra.bind(this);

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

                    AsyncStorage.setItem('@CandyMerch:plan', JSON.stringify(responseJson.response.plan))

                } else {

                }
            }).catch((err) => alert(err))
    }

    save() {



        let year = new Date().getFullYear();
        let month = this.state.month;
        let week = this.state.week;
        let day = this.state.day;

        let posToSend = this.state.posToSend;

        for (let i in this.state.closedVisits) {

            let pos_id = this.state.closedVisits[i].visit_obj.visit_plan_pos_id;

            let ind = posToSend.indexOf(pos_id)
            if(ind != -1) {
                posToSend.splice(ind,1)
            }

        }

        let fd = new FormData();
        fd.append('ids', JSON.stringify(posToSend));
        fd.append('week', week);
        fd.append('month', month);
        fd.append('day', day);
        fd.append('type', 'obligatory')
        fd.append('locked', JSON.stringify(Object.keys(this.state.closedVisits)))

        fetch(API_URL + 'api/calendar.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "User-Token": this.props.token
            },
            body: fd

        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    this.syncPlan();
                    Alert.alert('Gotowe!', 'Zapisane pozycje w ' + this.state.week + ' tygodniu ' + this.state.month + ' miesiąca: ' + this.state.posToSend.length);
                } else if (responseJson.status == 'error') {
                    Alert.alert('Błąd',responseJson.message);
                }
            })
            .catch((err) => {

                Alert.alert('Wyjątek',JSON.stringify(err));

                // alert('Error');
                // alert(JSON.stringify(err))
            })
    }

    saveExtra() {

        let year = new Date().getFullYear();
        let month = this.state.month;
        let week = this.state.week;
        let day = this.state.day;


        let fd = new FormData();
        fd.append('ids', JSON.stringify(this.state.posToSendExtra));
        fd.append('week', week);
        fd.append('month', month);
        fd.append('day', day);
        fd.append('type', 'additional')

        fetch(API_URL + 'api/calendar.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "User-Token": this.props.token
            },
            body: fd

        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    let len = this.state.posToSendExtra.length
                    this.setState({
                        posToSendExtra: []
                    })
                    this.syncPlan();
                    Alert.alert('Gotowe!', 'Zapisane pozycje dodatkowe w ' + this.state.week + ' tygodniu ' + this.state.month + ' miesiąca: ' + len);
                } else if (responseJson.status == 'error') {
                    alert(responseJson.message);
                }
            })
            .catch((err) => {
                alert(JSON.stringify(err))
            })
    }

    togglePos(id) {
        posToSend = this.state.posToSend;
        if (posToSend.indexOf(id) === -1) {
            posToSend.push(id)
        } else {
            posToSend.splice(posToSend.indexOf(id), 1);
        }

        this.setState({posToSend});
    }

    togglePosExtra(id) {
        posToSendExtra = this.state.posToSendExtra;
        if (posToSendExtra.indexOf(id) === -1) {
            posToSendExtra.push(id)
        } else {
            posToSendExtra.splice(posToSendExtra.indexOf(id), 1);
        }

        this.setState({posToSendExtra});
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSubmit: this.save});
    }

    componentWillMount() {
        let year = new Date().getFullYear();
        let month = this.state.month;
        let week = this.state.week;
        let day = this.state.day;

        fetch(API_URL + 'api/calendar.php?month=' + month + '&week' + week + '&day' + day, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "User-Token": this.props.token
            }

        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    //alert(JSON.stringify(responseJson.response.pos));
                    let posToSend = [];

                    for (let pos of responseJson.response.pos) {
                        if (pos.visit_plan_week == this.state.week && pos.visit_plan_month == this.state.month && pos.visit_plan_day == this.state.day) {
                            posToSend.push(pos.pos_id);
                        }
                    }

                    this.setState({
                        posList: responseJson.response.pos,
                        aplus: responseJson.response.aplus,
                        allPosList: responseJson.response.all,
                        posToSend: posToSend
                    });
                }
            }).catch((err) => {
            alert(JSON.stringify(err))
        })

        AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {
            if (list) {
                list = JSON.parse(list)
            } else {
                list = {};
            }

            this.setState({
                closedVisits: list
            })

        })
    }

    updateFilter(text) {
        this.setState({
            posFilter: text
        })
    }

    clearFilter() {
        this.setState({
            posFilter: ""
        })
    }

    setOption(option) {
        this.setState({option});
    }

    setDayOff(reason) {

        let {month, week, day} = this.props.navigation.state.params;
        let k = month + '-' + week + '-' + day

        let dayOff = {
            month: month + 1,
            week: week,
            day: day,
            reason: reason
        }

        this.props.navigation.state.params.toggleDayOff(k, dayOff).then(() => {
            this.toggleModal();
            this.props.navigation.goBack();
        });
    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    toggleModalExtra() {
        this.setState({
            modalExtraVisible: !this.state.modalExtraVisible
        })
    }

    togglePanelGroup() {
        this.setState({
            panelGroup: !this.state.panelGroup
        })
    }

    render() {
        let posList = this.state.posList.filter((pos) => {
            if (pos.pos_id in this.state.aplus) {
                if (
                    (pos.visit_plan_day != this.props.navigation.state.params.day
                        || pos.visit_plan_week != this.props.navigation.state.params.week)
                    && pos.visit_plan_month == this.props.navigation.state.params.month + 1
                )
                    pos.visit_plan_id = 0;
                return true
            }
            else if (pos.visit_plan_week && pos.visit_plan_month) {
                if (
                    (pos.visit_plan_day != this.props.navigation.state.params.day
                        || pos.visit_plan_week != this.props.navigation.state.params.week)
                    && pos.visit_plan_month == this.props.navigation.state.params.month + 1
                ) {
                    return false;
                }

            }
            return true;
        })

        if (this.state.posFilter.length > 3) {
            posList = posList.filter((pos) => {

                let str = "";
                for (let value in pos) {
                    str = str + pos[value] + "";
                }

                if ((str.toLowerCase()).indexOf(this.state.posFilter.toLowerCase()) >= 0) {
                    return true;
                }
                return false
            })
        }

        let posListFiltered;

        let panelFilter;

        let panelGroup;

        if (this.state.panelGroup) {
            panelGroup = (
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Sieć" onPress={() => {
                            this.setOption('network')
                        }}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Kategoria" onPress={() => {
                            this.setOption('category')
                        }}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Miasto" onPress={() => {
                            this.setOption('city')
                        }}/>
                    </View>
                </View>
            )
        }

        if (this.state.option == 'filter') {
            posListFiltered = posList.map((pos) => {
                return <Pos
                    key={pos.pos_id}
                    pos={pos}
                    day={this.props.navigation.state.params.day}
                    week={this.props.navigation.state.params.week}
                    month={this.props.navigation.state.params.month + 1}
                    togglePos={this.togglePos}
                    aplus={this.state.aplus}
                    locked={this.state.closedVisits}
                />
            })

            panelFilter = (
                <View style={styles.panelFilter}>
                    <View style={{flex: 9}}>
                        <TextInput onChangeText={(text) => this.updateFilter(text)} value={this.state.posFilter}
                                   placeholder="Filtruj"/>
                    </View>

                    <View style={{flex: 3}}>
                        <Button onPress={this.clearFilter.bind(this)} title="Czyść"/>
                    </View>
                </View>
            )
        } else {
            let groupField = 'pos_' + this.state.option;

            let groupedPos = {};
            for (let pos of posList) {
                let groupValue = pos[groupField] + " ";
                if (!(groupValue in groupedPos)) {
                    groupedPos[groupValue] = [];
                }

                groupedPos[groupValue].push(pos)
            }

            posListFiltered = (
                <GroupedPosList groups={groupedPos} togglePos={this.togglePos}
                                day={this.props.navigation.state.params.day}
                                week={this.props.navigation.state.params.week}
                                month={this.props.navigation.state.params.month + 1}
                                aplus={this.state.aplus}
                                locked={this.state.closedVisits}
                />
            )


        }


        return (
            <View style={{flex: 1}}>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.modalTitle}>Ustaw dzień wolny</Text>
                        <MyButton onPress={() => this.setDayOff('Wydarzenie')} title="Wydarzenie"/>
                        <MyButton onPress={() => this.setDayOff('Urlop')} title="Urlop"/>
                        <MyButton onPress={() => this.setDayOff('Zwolnienie')} title="Zwolnienie"/>
                        <MyButton onPress={() => this.setDayOff('Biuro')} title="Biuro"/>

                        <CloseModal closeModal={() => this.toggleModal()}/>
                    </View>
                </Modal>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalExtraVisible}
                    onRequestClose={() => {
                    }}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.modalTitle}>Ustaw wizytę dodatkową</Text>
                        <PosModal togglePos={this.togglePosExtra} day={this.props.navigation.state.params.day}
                                  week={this.props.navigation.state.params.week}
                                  month={this.props.navigation.state.params.month + 1}
                                  aplus={{}}
                                  posList={this.state.allPosList}
                        />

                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <CloseModal closeModal={() => this.toggleModalExtra()}/>
                            </View>
                            <View style={{flex: 1}}>
                                <MyButton title="Zapisz wizyty" onPress={() => this.saveExtra()}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Grupuj" onPress={() => this.togglePanelGroup()}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Filtruj" onPress={() => {
                            this.setOption('filter')
                        }}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Wolne" onPress={() => {
                            this.toggleModal()
                        }}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Dodatkowa" onPress={() => {
                            this.toggleModalExtra()
                        }}/>
                    </View>
                </View>
                {panelGroup}
                {panelFilter}
                <View style={{flex: this.state.option == 'filter' ? 10 : 11}}>
                    <ScrollView>
                        {posListFiltered}
                    </ScrollView>
                </View>
            </View>
        )
    }

}

export default connect(mapStateToProps, null)(CalendarWeek);
