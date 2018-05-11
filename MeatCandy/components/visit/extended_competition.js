import React, {Component} from 'react'
import {View, Modal, Text, ScrollView, TextInput, AsyncStorage, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import Stage from '../../containers/stage'
import Button from '../../containers/button'
import CloseModal from '../../containers/close-modal'
import styles from '../../containers/styles'
import {API_URL} from "../../misc/Conf";

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class VisitExtendedCompetition extends Component {

    constructor(props) {
        super(props)

        this.state = {
            task: this.props.task,
            modalVisible: false,
            modalCategoryVisible: false,
            categories: []
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateTask = this.updateTask.bind(this)
        this.inputs = [];
    }

    componentWillMount() {

        AsyncStorage.getItem('@CandyMerch:competitionCategories').then((cats) => {
            if (cats) {
                this.setState({
                    categories: JSON.parse(cats)
                })
            } else {
                fetch(API_URL + 'api/competition.php', {
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

    toggleModalCategory() {
        this.setState({
            modalCategoryVisible: !this.state.modalCategoryVisible
        })
    }

    updateTask() {
        this.props.updateTask(this.props.taskObj.additional_task_id, this.state.task);
    }

    componentWillReceiveProps(nextProps) {
        // console.warn(nextProps.task);
        if (nextProps.task) {
            this.setState({
                task: nextProps.task
            })
        }
    }

    render() {

        let taskList;

        if (this.state.task) {


            taskList = this.state.task.map((task, index) => {


                return (
                    <View key={index} style={styles.list}>

                        <View style={{flex: 1}}>
                            <Text style={{lineHeight: 28}}>{task.name}</Text>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flex: 2}}>
                                    <Text style={styles.smallTitle}>Marka</Text>
                                    <TextInput onChangeText={(text) => {

                                        let task = this.state.task;
                                        task[index].visit_extended_competition_brand = text;
                                        this.setState({task})

                                    }}
                                               value={this.state.task[index].visit_extended_competition_brand}
                                    />
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={styles.smallTitle}>Model</Text>
                                    <TextInput onChangeText={(text) => {

                                        let task = this.state.task;
                                        task[index].visit_extended_competition_model = text;
                                        this.setState({task})

                                    }}
                                               value={this.state.task[index].visit_extended_competition_model}
                                    />
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={styles.smallTitle}>Przedział cenowy</Text>
                                    <TextInput onChangeText={(text) => {

                                        let task = this.state.task;
                                        task[index].visit_extended_competition_prices = text;
                                        this.setState({task})

                                    }}
                                               value={this.state.task[index].visit_extended_competition_prices}
                                    />
                                </View>
                            </View>
                        </View>

                    </View>)
            })
        }

        let categories;

        if (this.state.categories) {
            categories = this.state.categories.map((category) => {
                return (
                    <TouchableHighlight
                        key={category.id}
                        style={styles.button}
                        onPress={() => {

                            task = this.state.task;
                            task.push({
                                visit_extended_competition_brand: '',
                                visit_extended_competition_category_id: category.id,
                                name: category.title,
                                visit_extended_competition_model: '',
                                visit_extended_competition_prices: ''
                            })


                            this.setState({
                                task: task,
                                modalCategoryVisible: false
                            }, () => {

                                this.updateTask()
                            })


                        }}
                    >
                        <Text style={styles.buttonText}>
                            {category.title}
                        </Text>
                    </TouchableHighlight>
                )
            })
        }

        if (this.state.modalCategoryVisible) {
            return (
                <View>
                    <Modal
                        style={styles.modal}
                        animation="slide"
                        transparent={false}
                        visible={this.state.modalCategoryVisible}
                        onRequestClose={() => this.updateTask()}
                    >
                        <View style={{flex: 1}}>
                            <Text style={styles.modalTitle}>Wybierz Kategorię</Text>
                            <ScrollView style={{flex: 12}}>
                                {categories}
                            </ScrollView>
                            <CloseModal closeModal={() => this.setState({modalCategoryVisible: false})}/>
                        </View>
                    </Modal>
                </View>
            )
        } else {

            return (
                <View>
                    <Modal
                        style={styles.modal}
                        animation="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.updateTask()}
                    >
                        <View style={{flex: 1}}>
                            <Text style={styles.modalTitle}>Rozszerzone Badanie konkurencji</Text>
                            <Button title="Dodaj wpis" onPress={() => this.setState({
                                modalCategoryVisible: true
                            })} style={{margin: 5}}/>
                            <ScrollView style={{flex: 12}}>

                                {taskList}

                            </ScrollView>
                            <CloseModal closeModal={() => {
                                this.updateTask();
                                this.toggleModal()
                            }}/>
                        </View>
                    </Modal>
                    <Stage openModal={this.toggleModal} title="Rozszerzone badanie konkurencji"/>
                </View>
            )

        }
    }
}

export default connect(mapStateToProps)(VisitExtendedCompetition)
