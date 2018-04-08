import React, {Component} from 'react'
import {View, Modal, Text, ScrollView, TextInput, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import styles from '../../containers/styles'

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class VisitCompetition extends Component {

    constructor(props) {
        super(props)

        this.state = {
            competition: this.props.competition,
            modalVisible: false,
            categories: []
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateCompetition = this.updateCompetition.bind(this)
    }

    componentWillMount() {

        AsyncStorage.getItem('@CandyMerch:competitionCategories').then((cats) => {
            if(cats) {
                this.setState({
                    categories: JSON.parse(cats)
                })
            }else{
                fetch('https://candy.meatnet.pl/api/competition.php', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'User-Token': this.props.token
                    }
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status == 'success') {
                            this.setState({
                                categories: responseJson.response.categories
                            })
                        } else if (responseJson.status == 'error') {
                            alert(responseJson.message)
                        }
                    }).catch((err) => alert(err));
            }
        })



    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    updateCompetition() {
        this.props.updateCompetition(this.state.competition);
        this.toggleModal();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.competition) {
            this.setState({
                competition: nextProps.competition
            })
        }
    }

    render() {

        let categories = this.state.categories.map((category) => {

            let valueCandy = '0';
            let valueHoover = '0';
            let valueGeneral = '0';
            let competition = this.state.competition
            if (category.id in competition) {
                let {candy, hoover, general} = competition[category.id]
                valueCandy = parseInt(candy?candy:0)
                valueHoover = parseInt(hoover?hoover:0)
                valueGeneral = parseInt(general?general:0)
            } else {
                competition[category.id] = {
                    candy: valueCandy,
                    hoover: valueHoover,
                    general: valueGeneral
                }
            }

            return (
                <View key={category.id} style={styles.list}>
                    <View style={{flex: 6}}>
                        <Text>{category.title}</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={styles.smallTitle}>Candy</Text>
                        <TextInput onChangeText={(text) => {
                            let competition = this.state.competition
                            competition[category.id].candy=parseInt(text)
                            this.setState({competition});
                        }}
                                   keyboardType='numeric'
                                   value={valueCandy + ""}
                        />
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={styles.smallTitle}>Hoover</Text>
                        <TextInput onChangeText={(text) => {
                            let competition = this.state.competition
                            competition[category.id].hoover=parseInt(text)
                            ;
                            this.setState({competition});
                        }}
                                   keyboardType='numeric'
                                   value={valueHoover + ""}
                        />
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={styles.smallTitle}>Ogółem</Text>
                        <TextInput onChangeText={(text) => {
                            let competition = this.state.competition
                            competition[category.id].general = parseInt(text)
                            this.setState({competition});
                        }}
                                   keyboardType='numeric'
                                   value={valueGeneral + ""}
                        />
                    </View>
                </View>
            )

        })

        return (
            <View>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.updateCompetition()}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.modalTitle}>Badanie konkurencji</Text>
                        <ScrollView style={{flex: 12}}>
                            {categories}
                        </ScrollView>
                        <CloseModal closeModal={this.updateCompetition}/>
                    </View>
                </Modal>
                <Stage openModal={this.toggleModal} title="Badanie konkurencji"/>
            </View>
        )
    }
}

export default connect(mapStateToProps)(VisitCompetition)
