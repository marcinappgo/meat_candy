import React , {Component} from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import styles from '../containers/styles'
import Pos from '../containers/pos'

export default class GroupedPosList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab : ''
        }
    }

    toggleTab(currentTab) {
        this.setState({currentTab})
    }


    render() {
        let ret;

        let posList;

        let groups = [];

        for(let tab of Object.keys(this.props.groups)) {
            let posList;


            if (this.state.currentTab == tab) {
                posList = this.props.groups[tab].map((pos) => <Pos
                    key={pos.pos_id}
                    pos={pos}
                    day={this.props.day}
                    week={this.props.week}
                    month={this.props.month}
                    togglePos={this.props.togglePos}
                    aplus={this.props.aplus}
                    locked={this.props.closedVisits}
                />)
            }

            groups.push(
                <View key={tab} style={styles.accordion}>
                    <TouchableHighlight

                        style={styles.buttonAccordion}

                        onPress={() => this.toggleTab(tab)}
                    >
                        <Text style={[styles.pos, styles.buttonText]}> {tab} </Text>
                    </TouchableHighlight>
                    {posList}
                </View>
            )
        }



        if(this.props.groups) {
            ret = (
                <View>
                {groups}
                </View>
            )
        }else{
            ret = (
                <Text>Brak danych</Text>
            )
        }



        return ret;
    }
}