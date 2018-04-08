import React, {Component} from 'react'
import {View, StyleSheet, TouchableHighlight, Text, ScrollView, Button, TextInput, Alert, Modal} from 'react-native'
import Visit from '../containers/visit'
import styles from '../containers/styles'
import ButtonSmall from '../containers/button_small'
import GroupedVisitList from '../containers/grouped-visit-list'

export default class DayPlan extends Component {

    static navigationOptions = {
        title: 'Plan dzienny',
    };


    selectVisit(visit) {
        const {navigate} = this.props.navigation;
        navigate('Visit', {visit: visit, navigateBack: this.navigateBack.bind(this)});
    }

    navigateBack() {
        this.setState({state: this.state});
    }


    constructor(props) {
        super(props)

        this.state = {
            posList: props.navigation.state.params.plan,
            posFilter: "",
            option: 'filter'
        }


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



    render() {
        let posList = this.state.posList;

        if(this.state.posFilter.length > 3) {
            posList = posList.filter((pos) => {

                let str = "";
                for(let value in pos) {
                    str = str + pos[value] + "";
                }

                if((str.toLowerCase()).indexOf(this.state.posFilter.toLowerCase()) >= 0) {
                    return true;
                }
                return false
            })
        }

        let posListFiltered;

        let panelFilter;

        if(this.state.option == 'filter') {
            posListFiltered = posList.map((visit) => <Visit key={visit.visit_plan_id} visit={visit}
                                                            selectVisit={this.selectVisit.bind(this)}/>)

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
        }else{
            let groupField = 'pos_' + this.state.option;

            let groupedPos = {};
            for(let pos of posList) {
                let groupValue = pos[groupField] + " ";
                if(!(groupValue in groupedPos)) {
                    groupedPos[groupValue] = [];
                }

                groupedPos[groupValue].push(pos)
            }

            posListFiltered = (
                <GroupedVisitList groups={groupedPos} selectVisit={this.selectVisit.bind(this)} />
            )




        }


        return (
            <View style={{flex: 1}}>

                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Sieć" onPress={() => {this.setOption('network')}}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Kategoria" onPress={() => {this.setOption('category')}}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Miasto" onPress={() => {this.setOption('city')}}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ButtonSmall title="Filtruj" onPress={() => {this.setOption('filter')}}/>
                    </View>

                </View>
                {panelFilter}
                <View style={{flex: this.state.option=='filter'?10:11}}>
                    <ScrollView>
                        {posListFiltered}
                    </ScrollView>
                </View>
            </View>
        )
    }

    _render() {
        let plan = this.state.plan.map((visit) => <Visit key={visit.visit_plan_id} visit={visit}
                                                         selectVisit={this.selectVisit.bind(this)}/>)

        return (
            <ScrollView>
                {plan}
            </ScrollView>
        )
    }
}