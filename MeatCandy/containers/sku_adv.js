import React, {Component} from 'react'
import {StyleSheet, TouchableHighlight, Linking, TextInput, Image, Text, View, PermissionsAndroid} from 'react-native';
import styles from './styles'
import ButtonSmall from './button_small'


class SkuAdv extends Component {


    constructor(props) {
        super(props);

        this.state = {
            skuObj: props.product,
            sku: props.sku
        }

    }

    render() {

        const {sku, skuObj} = this.state;

        let reason;

        if (sku.is_ordered != -1) {
            reason = (
                <View style={{flex: 1}}>
                    <TextInput
                        placeholder="opis"
                        multiline={true}
                        value={sku.remarks}
                        onChangeText={(text) => this.setState({sku: {...this.state.sku, remarks: text}})}
                        onBlur={() => {
                            this.props.updateSkuAdv(this.state.sku)
                        }}
                    />
                </View>
            )
        }


        return (
            <View style={styles.borderedView}>
                <View style={styles.unborderedList}>
                    <Text style={{flex: 8}}>{skuObj.product_model} / {skuObj.product_category_name} / {skuObj.product_subcategory_name}</Text>

                    <View style={{flex: 2}}>
                        <ButtonSmall selected={sku.is_ordered == 1} title="Tak"
                                     onPress={() => this.setState({sku: {...this.state.sku, is_ordered: 1}}, () => {
                                         this.props.updateSkuAdv(this.state.sku)
                                     })}/>
                    </View>
                    <View style={{flex: 2}}>
                        <ButtonSmall selected={sku.is_ordered == 0} title="Nie"
                                     onPress={() => this.setState({sku: {...this.state.sku, is_ordered: 0}}, () => {
                                         this.props.updateSkuAdv(this.state.sku)
                                     })}/>
                    </View>
                    <View style={{flex: 2}}>
                        <ButtonSmall selected={sku.is_ordered == -1} title="Brak"
                                     onPress={() => this.setState({sku: {...this.state.sku, is_ordered: -1}}, () => {
                                         this.props.updateSkuAdv(this.state.sku)
                                     })}/>
                    </View>
                </View>

                {reason}
            </View>
        )
    }

}

export default SkuAdv;
