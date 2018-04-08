import React, {Component} from 'react'
import {ScrollView, AsyncStorage, View, Modal, TextInput, Text} from 'react-native'
import {connect} from 'react-redux'
import styles from '../containers/styles'
import Button from '../containers/button'
import VisitDetails from './visit/details'
import VisitCompetition from './visit/competition'
import VisitTraining from './visit/training'
import VisitPosMaterial from './visit/pos_material'
import VisitExposition from './visit/exposition'
import VisitOrderProduct from './visit/order_product'
import VisitImages from './visit/images'
import {NavigationActions} from 'react-navigation'
import CloseModal from '../containers/close-modal'

const mapStateToProps = (state) => {
    return {
        token: state.token
    }
}

class Visit extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.visit.pos_category + ' - ' + navigation.state.params.visit.pos_number + ' - ' + navigation.state.params.visit.pos_name
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            visit: {
                details: {
                    visit_contact_person: '',
                    visit_start_time: Date.now(),
                    visit_end_time: '',
                    visit_obligatory: this.props.navigation.state.params.visit.visit_plan_visit_type,
                    visit_remarks: ''
                },
                competition: [],
                exposition: {},
                order_product: {},
                pos_material: {},
                training: {},
                images: [],
                visit_obj: this.props.navigation.state.params.visit
            },
            visit_id: this.props.navigation.state.params.visit.visit_plan_id,
            remarks: "",
            modalVisible: false
        }
    }

    async componentWillMount() {
        await this.loadVisitFromStorage();
    }


    loadVisitFromStorage() {
        return AsyncStorage.getItem('@CandyMerch:visitDetails' + this.state.visit_id)
            .then((visit) => {
                if (visit) {
                    visit = JSON.parse(visit);
                    this.setState({visit: visit})
                }

            });
    }

    saveVisitToStorage() {

        let data = JSON.stringify(this.state.visit);
        return AsyncStorage.setItem('@CandyMerch:visitDetails' + this.state.visit_id, data);
    }

    updateDetails(details) {
        this.setState({
            visit: {
                ...this.state.visit,
                details: details
            }
        }, () => this.saveVisitToStorage());
    }

    updateCompetition(competition) {
        this.setState({
            visit: {
                ...this.state.visit,
                competition: competition
            }
        }, () => this.saveVisitToStorage());
    }

    updateTraining(training) {
        this.setState({
            visit: {
                ...this.state.visit,
                training: training
            }
        }, () => this.saveVisitToStorage());
    }

    updateOrderProduct(order_product) {

        this.setState({
            visit: {
                ...this.state.visit,
                order_product: order_product
            }
        }, () => this.saveVisitToStorage());
    }


    updatePosMaterial(pos_material) {
        this.setState({
            visit: {
                ...this.state.visit,
                pos_material: pos_material
            }
        }, () => this.saveVisitToStorage());
    }

    updateExposition(exposition) {
        this.setState({
            visit: {
                ...this.state.visit,
                exposition: exposition
            }
        }, () => this.saveVisitToStorage());
    }

    updateImages(images) {
        this.setState({
            visit: {
                ...this.state.visit,
                images: images
            }
        }, () => this.saveVisitToStorage());
    }

    closeVisit() {
        if (!"visit_obj" in this.state.visit) {
            this.setState({
                visit: {
                    ...this.state.visit,
                    visit_obj: this.props.navigation.state.params.visit
                }
            }, () => {
                this.setClosedVisit()
            })
        } else {
            this.setClosedVisit()
        }
    }

    cancelVisit() {
        if (!"visit_obj" in this.state.visit) {
            this.setState({
                visit: {
                    ...this.state.visit,
                    visit_obj: this.props.navigation.state.params.visit
                }
            }, () => {
                this.setClosedVisit(-2, this.state.remarks)
            })
        } else {
            this.setClosedVisit(-2, this.state.remarks)
        }
    }

    setClosedVisit(visitState = -1, remarks = "") {
        this.setState({
                visit: {
                    ...this.state.visit,
                    details: {
                        ...this.state.visit.details,
                        visit_end_time: Date.now()
                    },
                    visit_obj: {
                        ...this.state.visit.visit_obj,
                        visit_plan_visit_id: visitState,
                        visit_plan_remarks: remarks
                    }
                }
            }, () => {
                this.saveVisitToStorage().then(() => {
                    AsyncStorage.getItem('@CandyMerch:visitToSync').then((list) => {

                        if (list) {
                            list = JSON.parse(list)
                        } else {
                            list = {};
                        }


                        list[this.state.visit_id] = this.state.visit;
                        AsyncStorage.setItem('@CandyMerch:visitToSync', JSON.stringify(list)).then(() => {

                            const resetAction = NavigationActions.reset({
                                index: 1,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Home'}),
                                    NavigationActions.navigate({routeName: 'Plan'})
                                ]
                            })
                            this.props.navigation.dispatch(resetAction)


                        }).catch((err) => {
                            console.warn(err)
                        })
                    }).catch((err) => {
                        console.warn(err)
                    })
                }).catch((err) => {
                    console.warn(err)
                })
            }
        )
    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }



    render() {

        let stare = (
            <View>
                <VisitPosMaterial pos_material={this.state.visit.pos_material}
                                  updatePosMaterial={this.updatePosMaterial.bind(this)}/>
                <VisitExposition exposition={this.state.visit.exposition}
                                    updateExposition={this.updateExposition.bind(this)}/>
            </View>
    )

        return (
            <View>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <View style={{flex:1}}>
                        <Text style={styles.modalTitle}>Odwołaj wizytę</Text>
                        <TextInput onChangeText={(text) => this.setState({remarks: text})} placeholder="Przyczyna" />
                        <Button title="Odwołaj" onPress={() => {if(this.state.remarks.length > 2)this.cancelVisit()}}/>
                        <CloseModal closeModal={() => this.toggleModal()} />
                    </View>
                </Modal>
                <ScrollView>
                    <VisitDetails visit={this.props.navigation.state.params.visit} details={this.state.visit.details}
                                  updateDetails={this.updateDetails.bind(this)}/>
                    <VisitCompetition competition={this.state.visit.competition}
                                      updateCompetition={this.updateCompetition.bind(this)}/>
                    <VisitTraining training={this.state.visit.training}
                                   updateTraining={this.updateTraining.bind(this)}/>
                    <VisitOrderProduct order_product={this.state.visit.order_product}
                                       updateOrderProduct={this.updateOrderProduct.bind(this)}/>
                    <VisitImages images={this.state.visit.images}
                                       updateImages={this.updateImages.bind(this)}/>

                    <View style={styles.borderedView}>
                        <Button title="Zamknij wizytę" onPress={this.closeVisit.bind(this)}/>
                        <Button title="Odwołaj" onPress={() => this.toggleModal()}/>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

export default connect(mapStateToProps, null)(Visit)
