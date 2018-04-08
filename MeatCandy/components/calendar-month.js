import React, {Component} from 'react'
import { connect } from 'react-redux'
import {View, StyleSheet, TouchableHighlight, Text, ScrollView, Alert} from 'react-native';
import styles from '../containers/styles'
import Button from '../containers/button'

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class CalendarMonth extends Component {

    static navigationOptions = ({navigation}) => {

        let months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ]

        //title: 'Harmonogram ' + (new Date().getYear()) + ' ' + this.months[this.props.navigation.params.month]
        return {
            title: ("Harmonogram " + months[navigation.state.params.month] + ' ' + (new Date().getFullYear()))
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            visibleWeek: 0,
            dayOff: {}
        }

        this.loadDayOff = this.loadDayOff.bind(this)
    }

    componentWillMount() {
        this.loadDayOff();
    }

    loadDayOff() {
        return fetch('https://candy.meatnet.pl/api/day-off.php?month=' + (this.props.navigation.state.params.month + 1), {
            method: "GET",
            headers: {
                Accept : 'application/json',
                'User-Token' : this.props.token
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if(json.status == 'success') {

                    let dayOffList = {};

                    for(let d of json.response.day_off) {
                        let k = d.visit_day_off_month + '-' + d.visit_day_off_week + '-' + d.visit_day_off_day

                        dayOffList[k] = d.id_visit_day_off;
                    }

                    this.setState({
                        dayOff : dayOffList
                    })
                }else{
                    throw new Error(json.message);
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err));
            })
    }


    weekCount(month_number) {

        let year = new Date().getFullYear();
        // month_number is in the range 1..12

        var firstOfMonth = new Date(year, month_number - 1, 1);
        var day = firstOfMonth.getDay() || 6;
        day = day === 1 ? 0 : day;
        if (day) {
            day--
        }
        var diff = 7 - day;
        var lastOfMonth = new Date(year, month_number, 0);
        var lastDate = lastOfMonth.getDate();
        if (lastOfMonth.getDay() === 1) {
            diff--;
        }
        var result = Math.ceil((lastDate - diff) / 7);
        return result + 1;
    }

    getBoundries(month) {
        let year = new Date().getFullYear();

        let boundries = {};
        let week = 1;
        let currentDay = 1;
        let startDate = new Date(year, month, currentDay);
        let currentDate = new Date(year, month, currentDay);

        while (currentDate.getMonth() == month) {
            if (currentDate.getDay() == 0) {
                boundries[week] = {
                    startDay: startDate,
                    endDay: currentDate
                }
                startDate = null;
                week++;
            } else if (!startDate) {
                startDate = new Date(year, month, currentDay);
            }

            currentDay++;
            currentDate = new Date(year, month, currentDay);
        }

        if (currentDate.getDay() != 1) {
            currentDate = new Date(year, month, currentDay - 1);
            boundries[week] = {
                startDay: startDate,
                endDay: currentDate
            }
        }

        return boundries;
    }

    getMonday(month, week) {

        Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
        }

        let monday = this.getBoundries(month)[week].startDay;
        return monday.getDate().pad(2) + '.' + ((month + 1)).pad(2)
     }

    getSunday(month, week) {
        Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
        }

        let monday = this.getBoundries(month)[week].endDay;
        return monday.getDate().pad(2) + '.' + ((month + 1)).pad(2)
    }

    setWeek(i) {

        this.setState({
            visibleWeek: this.state.visibleWeek == i ? 0 : i
        })
    }

    getWorkingDays(month, week) {
        let weekCount = this.weekCount(month + 1);

        if(week == 1) {
            let year = new Date().getFullYear();
            let firstDay = new Date(year, month, 1).getDay();

            if(firstDay == 0 || firstDay == 6) {
                return 0;
            }else{
                return 6 - firstDay;
            }


        }else if(week == weekCount) {
            let year = new Date().getFullYear();
            let lastDay = new Date(year, month + 1, 0).getDay();



            if(lastDay == 0 || lastDay == 6) {
                return 5;
            }else{
                return lastDay;
            }

        }else {
            return 5;
        }
    }

    toggleDayOff(k, dayOff={}) {
        if(k in this.state.dayOff) {
            let id = this.state.dayOff[k]
            Alert.alert('Dzień wolny','Czy chcesz odwołać dzień wolny?',[
                {text: 'Tak', onPress: () => {
                    fetch('https://candy.meatnet.pl/api/day-off.php?id=' + id, {
                        method: "GET",
                        headers: {
                            Accept : 'application/json',
                            'User-Token' : this.props.token
                        }
                    }).then(() => {
                        this.loadDayOff()
                    })
                }},
                {text: 'Nie', onPress: () => {}}
            ])
        }else{

            let fd = new FormData();
            fd.append('month', dayOff.month);
            fd.append('week', dayOff.week);
            fd.append('day', dayOff.day);
            fd.append('reason', dayOff.reason);

            return fetch('https://candy.meatnet.pl/api/day-off.php', {
                method: "POST",
                headers: {
                    Accept : 'application/json',
                    'User-Token' : this.props.token
                },
                body : fd
            })

                .then((response) => response.json())

            .then((json) => {
                if(json.status == 'success')
                    return this.loadDayOff()
                else
                    throw new Error(json.message)
            }).catch((err) => {
                console.error(err)
            })
        }
    }


    render() {
        const {navigate, state} = this.props.navigation;
        var weeks = new Array();

        for (let i = 1; i <= this.weekCount(state.params.month + 1); i++) {

            let days;

            if (this.state.visibleWeek == i) {

                let dayList = [];

                for(let j=1; j<=this.getWorkingDays(state.params.month, i); j++) {
                    let k = (state.params.month + 1) + '-' + i + '-' + j;

                    if(k in this.state.dayOff) {
                        dayList.push(<Button key={k} title={"Dzień " + j + " (Dzień wolny)"}
                                onPress={() => this.toggleDayOff(k)}/>);
                    }else{
                        dayList.push(
                            <Button key={k} title={"Dzień " + j}
                                    onPress={() => navigate('CalendarWeek', {month: state.params.month, week: i, day: j, toggleDayOff:this.toggleDayOff.bind(this)})}/>
                        )
                    }
                }

                days = (
                    <View>
                        {dayList}
                    </View>
                )
            }

            weeks.push(
                <View key={i} style={styles.accordion}>
                    <TouchableHighlight

                        style={styles.buttonAccordion}
                        //onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
                        onPress={() => this.setWeek(i)}
                    >
                        <Text style={[styles.pos, styles.buttonText]}> Tydzień {i}: {this.getMonday(state.params.month, i)} - {this.getSunday(state.params.month, i)} </Text>
                    </TouchableHighlight>
                    {days}
                </View>
            )
        }

        return (
            <ScrollView>
                {weeks}
            </ScrollView>
        )

    }
}

export default connect(mapStateToProps)(CalendarMonth);
