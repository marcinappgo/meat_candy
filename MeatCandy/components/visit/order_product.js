import React, {Component} from 'react'
import {View, Modal, Text, ScrollView, TextInput, TouchableHighlight, Linking, Button, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import Stage from '../../containers/stage'
import CloseModal from '../../containers/close-modal'
import MyButton from '../../containers/my-button'
import styles from '../../containers/styles'
import SkuAdv from '../../containers/sku_adv'
import {API_URL} from "../../misc/Conf";

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token
    }
}

class VisitOrderProduct extends Component {

    constructor(props) {
        super(props)

        this.state = {
            order_product: this.props.order_product,
            modalVisible: false,
            modalProductsVisible: false,
            products: [],
            filter: "",
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.updateOrderProduct = this.updateOrderProduct.bind(this)
    }

    componentWillMount() {
        AsyncStorage.getItem('@CandyMerch:sku').then((sku) => {
            if(sku) {
                this.setState({
                    products: JSON.parse(sku)
                })
            }else{
                fetch(API_URL + 'api/products.php', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'User-Token': this.props.token
                    }
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status == 'success') {
                            this.setState({
                                products: responseJson.response.products
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

    toggleModalProduct() {
        this.setState({
            modalProductsVisible: !this.state.modalProductsVisible
        })
    }

    updateOrderProduct() {
        this.props.updateOrderProduct(this.state.order_product);
        this.toggleModal();
    }

    updateSkuAdv(sku) {
        let order_product = this.state.order_product
        order_product[sku.id] = sku;
        this.setState({order_product})

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.order_product) {
            this.setState({
                order_product: nextProps.order_product
            })
        }
    }

    updateFilter(text) {
        this.setState({
            filter: text
        })
    }

    clearFilter() {
        this.setState({
            filter: ""
        })
    }

    render() {

        panelFilter = (
            <View style={styles.panelFilter}>
                <View style={{flex: 9}}>
                    <TextInput onChangeText={(text) => this.updateFilter(text)} value={this.state.filter}
                               placeholder="Filtruj"/>
                </View>

                <View style={{flex: 3}}>
                    <Button onPress={this.clearFilter.bind(this)} title="Czyść"/>
                </View>
            </View>
        )

        /*let products_ = this.state.products.map((product) => {

            return (
                <TouchableHighlight
                    key={product.product_id}
                    style={styles.button}
                    // onPress={() => navigate('CalendarWeek', {month:state.params.month, week: i})}
                    onPress={() => {

                        let order_product = this.state.order_product;
                        order_product[product.product_id] = {
                            id: product.product_id,
                            model: product.product_model,
                            description: product.product_description,
                            category: product.product_category_name + ' / ' + product.product_subcategory_name,
                            is_ordered: 0,
                            remarks: ''
                        }

                        this.setState({order_product}, () => {
                            this.toggleModalProduct()
                        })
                    }}
                >
                    <Text style={styles.buttonText}>
                        {product.product_model} / {product.product_category_name} / {product.product_subcategory_name},
                    </Text>
                </TouchableHighlight>
            )

        })*/

        // let ordered = Object.keys(this.state.order_product).map((key) => {
        //
        //   let product = this.state.order_product[key];


        let filtered = this.state.products.filter((sku) => {
            let str = "";
            for(let value in sku) {
                str = str + sku[value] + "";
            }

            if((str.toLowerCase()).indexOf(this.state.filter.toLowerCase()) >= 0) {
                return true;
            }
            return false
        })

        let products = filtered.map((product) => {
            let ordered = this.state.order_product[product.product_id];
            if(!ordered) {
                ordered = {
                    is_ordered: -1,
                    remarks: "",
                    id: product.product_id
                }
            }

            return (
                <SkuAdv product={product} sku={ordered} key={product.product_id} updateSkuAdv={this.updateSkuAdv.bind(this)}/>
            )
        })

        // let ordered;
        // alert(JSON.stringify(this.state.order_product));


        // let productModal = (
        //     <Modal
        //         style={styles.modal}
        //         animation="slide"
        //         transparent={false}
        //         visible={this.state.modalProductsVisible}
        //         onRequestClose={() => {
        //         }}
        //     >
        //         <View style={{flex: 1}}>
        //             <Text style={styles.modalTitle}>Wybierz produkt</Text>
        //             <ScrollView style={{flex: 12}}>
        //                 {products}
        //             </ScrollView>
        //             <CloseModal closeModal={this.toggleModalProduct.bind(this)}/>
        //         </View>
        //     </Modal>
        // )

        // {productModal}
        // <Button title="Wybierz produkt" onPress={this.toggleModalProduct.bind(this)}/>

        return (
            <View>
                <Modal
                    style={styles.modal}
                    animation="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
                >
                    <View style={{flex: 1}}>
                        <Text style={styles.modalTitle}>Zamówienie produktu</Text>
                        {panelFilter}
                        <ScrollView style={{flex: 12}}>
                            {products}
                        </ScrollView>
                        <CloseModal closeModal={this.updateOrderProduct.bind(this)}/>
                    </View>
                </Modal>
                <Stage openModal={this.toggleModal} title="Zamówienie produktu"/>
            </View>
        )

    }
}

export default connect(mapStateToProps)(VisitOrderProduct)
