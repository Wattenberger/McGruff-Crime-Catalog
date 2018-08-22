import React from 'react';
import { Button, Slider, StyleSheet, Text, View } from 'react-native';
import { MapView, Permissions, Notifications } from 'expo';
import Alerts from './Alerts';
import { MarkerAnimated, Circle } from 'react-native-maps';

import * as firebase from "firebase";

export default class App extends React.Component {
  state = {
    coords: {},
    token: null,
    incidents: []
  }

  componentDidMount() {
    this.grabLocation()
    this.registerForPushNotifications();
    this.initFirebase();
  }

  extractToken(token="") {
    return /\[(.*?)\]/.exec(token)[1];
  }

  initFirebase = async () => {
    firebase.initializeApp({
      apiKey: "",
      authDomain: "mcgruff-crime-catalog.firebaseapp.com",
      databaseURL: "https://mcgruff-crime-catalog.firebaseio.com",
      projectId: "mcgruff-crime-catalog",
      storageBucket: "mcgruff-crime-catalog.appspot.com",
      messagingSenderId: "499674615284"
    });
    const email = "mcgruff@coolguy.com"
    const pw = "" // FILL IN
    firebase.auth().signInWithEmailAndPassword(email, pw)
  }

  grabLocation = () => {
    navigator.geolocation.getCurrentPosition(d => {
      this.setState({ coords: d.coords });
    })
  }

  handleNotification = notification => {
    console.log("notification", notification)
  }

  registerForPushNotifications = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      console.log("notification permission not granted, asking")
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        console.log("notification permission not granted")
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();
    this.subscription = Notifications.addListener(this.handleNotification);
    if (!token) return

    this.setState({
      token: this.extractToken(token),
    });
  }

  render() {
    const { coords, token } = this.state

    return (
      <View style={styles.container}>

        <Alerts currentLocation={coords} token={token} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});


