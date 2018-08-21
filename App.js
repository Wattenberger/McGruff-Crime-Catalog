import React from 'react';
import { Button, Slider, StyleSheet, Text, View } from 'react-native';
import { MapView, Permissions, Notifications } from 'expo';
import Alerts from './Alerts';
import { MarkerAnimated, Circle } from 'react-native-maps';
import * as rssParser from 'react-native-rss-parser';
import buildIncidents from './IncidentBuilder'
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
    this.grab911Messages();
  }

  extractToken(token){
    return /\[(.*?)\]/.exec(token)[1]; 
  }

  fireBaseDBTest =  (token)=>{

    firebase.initializeApp({
      apiKey: "",
      databaseURL: "https://mcgruff-crime-catalog.firebaseio.com",
     });

     const pushToken = this.extractToken(token); 

     let userPath = "/user/" + pushToken + "/details";

    return firebase.database().ref(userPath).set({
         token: pushToken,
         alerts :[
           {
             cords : [43.161030, -77.610924],
             range : 1 , 
             name : 'alert1'
           }
         ]
     })


  }

  grabLocation = () => {
    navigator.geolocation.getCurrentPosition(d => {
      this.setState({ coords: d.coords });
    })
  }

  grab911Messages = ()=> {
    fetch('https://www2.monroecounty.gov/911/rss.php')
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => buildIncidents( rss.items.map(x => {
        return { link: x.id,title: x.title }; 
      }))).then(inc => {
         this.setState({incidents: inc}); 
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

    this.setState({
      token,
    });

    try{
      await this.fireBaseDBTest(token); 

    }catch(error){
      console.log(error); 
    }

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


