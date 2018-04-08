import React, { Component } from 'react'
import { Button, NavigationActions, View } from 'react-native'

export default class HomeNav extends Component{

    navigateHome() {
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({routeName: 'Home'})
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    render() {
        return this.props.title;

    }
}