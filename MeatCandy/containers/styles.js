import React from 'react'
import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#00ACEC',
        padding: 20,
        margin: 5,
        borderRadius: 5
    },

    buttonAccordion: {
        alignItems: 'center',
        backgroundColor: '#00ACEC',
        padding: 20,

        borderRadius: 5
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'left'
    },
    buttonSmall: {
        alignItems: 'center',
        backgroundColor: '#00ACEC',
        padding: 5,
        margin: 5,
        borderRadius: 5
    },
    buttonSmallText: {
        fontSize: 10,
        color: '#FFFFFF'
    },

    buttonSmallSelected: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#00ACEC',
        borderWidth: 1,
        padding: 4,
        margin: 5,
        borderRadius: 5
    },
    buttonSmallSelectedText: {
        fontSize: 10,
        color: '#00ACEC'
    },

    selectedButton: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 5,
        borderColor: '#00ACEC',
        padding: 15,
        margin: 5,
        borderRadius: 5
    },
    selectedButtonText: {
        fontSize: 20,
        color: '#00ACEC'
    },
    modal: {
        margin: 40
    },
    modalTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20
    },
    smallTitle: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 0
    },
    list: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00ACEC',
        margin: 5,
        borderRadius: 5,
        padding: 5
    },
    borderedView: {
        borderWidth: 1,
        borderColor: '#00ACEC',
        margin: 5,
        borderRadius: 5,
        padding: 5
    },
    unborderedList: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        padding: 5
    },
    boldText: {
        fontWeight: 'bold'
    },
    panel: {
        backgroundColor: '#FFFFFF',
        padding: 3,
        margin: 3
    },
    panelFilter: {
        backgroundColor: '#FFFFFF',
        padding: 3,
        margin: 3,
        flexDirection: 'row'
    },
    pos : {
        textAlign: 'left',
        fontSize: 16,
        width: '100%'
    },
    posAplus : {
        borderColor: "#ff0000",
        borderWidth: 5
    },

    posSubtitle : {
        fontSize: 12
    },

    accordion: {
        borderWidth: 1,
        borderColor: '#00ACEC',
        margin: 5,
        borderRadius: 6,

    }


})
