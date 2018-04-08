import React, {Component} from 'react'
import {View, StyleSheet, TouchableHighlight, Text, ScrollView, Button, TextInput, Alert, Modal} from 'react-native';
import {connect} from 'react-redux';
import Pos from '../containers/pos'
import styles from '../containers/styles'
import ButtonSmall from '../containers/button_small'
import GroupedPosList from '../containers/grouped-pos-list'
import MyButton from '../containers/my-button'
import CloseModal from '../containers/close-modal'


class PosModal extends Component {



    constructor(props) {
        super(props)

        this.state = {
            posList: props.posList,
            aplus: {},
            posToSendExtra: props.posToSendExtra,
            month: props.month + 1,
            week: props.week,
            day: props.day,
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
            posListFiltered = posList.map((pos) => <Pos
                key={pos.pos_id}
                pos={pos}
                day={this.state.day}
                week={this.state.week}
                month={this.state.month + 1}
                togglePos={this.props.togglePos}
                aplus={{}}
            />)

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
                <GroupedPosList groups={groupedPos} togglePos={this.props.togglePos} day={this.state.day}
                                week={this.state.week}
                                month={this.state.month}
                                aplus={{}}
                />
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

}

export default PosModal;
