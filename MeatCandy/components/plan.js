import React, {Component} from 'react'
import {ScrollView, View, TouchableHighlight, Text, AsyncStorage} from 'react-native'
import styles from '../containers/styles'
import Visit from '../containers/visit'
import Button from '../containers/button'
import {connect, dispatch} from 'react-redux';

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class Plan extends Component {

    static navigationOptions = {
        title: 'Plan wizyt na obecny miesiąc',
    };

    constructor(props) {
        super(props)

        this.state = {
            plan: [],
            visibleWeek: 0
        }

        this.selectVisit = this.selectVisit.bind(this);
    }

    loadData() {

        return AsyncStorage.getItem('@CandyMerch:plan').then((plan) => {
            if(plan) {
                this.setState({
                    plan: JSON.parse(plan)
                })
            }else{
                return fetch('https://candy.meatnet.pl/api/new-visit.php', {
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


                        } else {

                        }
                    }).catch((err) => alert(err))
            }
        })


    }

    componentWillMount() {
        this.loadData();
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

    navigateBack() {
        this.setState({state: this.state});
    }

    selectVisit(visit) {
        const {navigate} = this.props.navigation;
        navigate('Visit', {visit: visit, navigateBack: this.navigateBack.bind(this)});
    }

    render() {
        const {navigate, state} = this.props.navigation;
        var weeks = new Array();

        let month = new Date().getMonth();
        let year = new Date().getFullYear();

        for (let i = 1; i <= this.weekCount(month + 1); i++) {

            let days;

            if (this.state.visibleWeek == i) {

                let dayList = [];

                for(let j=1; j<=this.getWorkingDays(month, i); j++) {
                    let k = year + '-' + (month + 1) + '-' + i + '-' + j;

                    let plan = [];

                    if(k in this.state.plan) {
                        plan = this.state.plan[k]
                    }


                    dayList.push(
                        <Button key={k} title={"Dzień " + j}
                                onPress={() => navigate('DayPlan', {month: month, week: i, day: j, plan: plan} )}/>
                    )
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
                        //onPress={() => navigate('CalendarWeek', {month:month, week: i})}
                        onPress={() => this.setWeek(i)}
                    >
                        <Text style={[styles.pos, styles.buttonText]}> Tydzień {i}: {this.getMonday(month, i)} - {this.getSunday(month, i)} </Text>
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

    _render() {
        let plan = this.state.plan.map((visit) => <Visit key={visit.visit_plan_id} visit={visit}
                                                         selectVisit={this.selectVisit}/>)

        return (
            <ScrollView>
                {plan}
            </ScrollView>
        )
    }
}

export default connect()(Plan)
