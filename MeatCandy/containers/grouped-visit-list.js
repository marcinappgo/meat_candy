import React , {Component} from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import styles from '../containers/styles'
import Visit from '../containers/visit'

export default class GroupedVisitList extends Component {
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

        let groups = [];

        for(let tab of Object.keys(this.props.groups)) {
            let posList;


            if (this.state.currentTab == tab) {
                posList = this.props.groups[tab].map((visit) => <Visit key={visit.visit_plan_id} visit={visit}
                                                                       selectVisit={() => this.props.selectVisit(visit)}/>)
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