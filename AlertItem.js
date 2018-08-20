import React from 'react';
import PropTypes from "prop-types";
import { Button, Dimensions, Modal, Slider, StyleSheet, Text, View, ViewPropTypes, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { MapView, Svg } from 'expo';
import { AsyncStorage } from "react-native";
import AlertItemModal from "./AlertItemModal"
import { Ionicons } from '@expo/vector-icons';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const numberWithCommas = (x="") => {
  if (!x) return ""
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
export default class AlertItem extends React.Component {
  state = {
    isExpanded: false,
  }

  static propTypes = {
    location: PropTypes.array,
    distance: PropTypes.number,
    onUpdate: PropTypes.func,
  }

  static defaultProps = {
    color: "#666"
  }

  componentDidMount() {
  }

  onDistanceChange = newValue => {
    this.props.onUpdate({
      distance: newValue,
    });
  }

  onResetLocation = () => {
    this.props.onUpdate({
      latitude: null,
      longitude: null,
    })
  }

  onModalToggle = (newState) => () => {
    if (newState && !this.props.distance) this.createAlert();
    if (!newState) this.props.onCenterOnAlert();
    this.setState({ isExpanded: newState });
  }

  createAlert = () => {
    this.props.onUpdate({
      distance: 20,
    })
  }

  render() {
    const { index, label, latitude, longitude, distance, color, onUpdate, onDelete, ...props } = this.props
    const { isExpanded } = this.state
    const isNewAlert = !distance;

    return (
      <TouchableNativeFeedback onPress={this.onModalToggle(true)}>
          <View style={styles.container} {...props}>
            {isExpanded && (
              <AlertItemModal
                label={label}
                latitude={latitude}
                longitude={longitude}
                distance={distance}
                color={color}
                isVisible={true}
                onDistanceChange={this.onDistanceChange}
                onUpdate={onUpdate}
                onResetLocation={this.onResetLocation}
                onClose={this.onModalToggle(false)}
                onDelete={onDelete}
              />
            )}

            {isNewAlert ? (
                <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "center", width: "100%", paddingTop: 12, paddingBottom: 12,}}>

                  <View style={{marginRight: 8}}>
                    <Svg height={25} width={25}>
                      <Svg.Circle cx={12} cy={12} r={10} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                      <Svg.Line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                      <Svg.Line x1="12" y1="8" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                    </Svg>
                  </View>
                  <View>
                    <Text style={styles.label}>
                      Add new alert
                    </Text>
                  </View>
                </View>
            ) : (
              <View>
                {label && (
                  <View style={{flexDirection: "row"}}>
                    <Svg height={30} width={30}>
                      <Svg.Circle
                        cx={12}
                        cy={10}
                        r={3}
                        strokeWidth={2.5}
                        stroke={color}
                        fill="none"
                      />
                      <Svg.Path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        strokeWidth={2}
                        stroke={color}
                        fill="none"
                      />
                    </Svg>

                    <Text style={styles.label}>
                      { label || `Alert ${ index }` }
                    </Text>
                  </View>
                )}
                <View style={styles.content}>
                  <View style={styles.text}>
                    {!latitude && (
                      <Text style={styles.location}>
                        Near me
                      </Text>
                    )}
                    {false && latitude && (
                      <Text style={styles.location}>
                        { latitude }, { longitude }
                      </Text>
                    )}
                    {distance && (
                      <Text style={styles.distance}>
                        within { numberWithCommas(Math.round(distance)) } feet
                      </Text>
                    )}

                    <Slider
                      style={styles.slider}
                      value={distance}
                      minimumValue={10}
                      thumbTintColor={color}
                      minimumTrackTintColor={color}
                      maximumValue={5000}
                      onValueChange={this.onDistanceChange}
                    />
                </View>
              </View>
              <View style={{marginTop: 1}}>
                <Text style={{opacity: 0.4}}>
                  Drag marker to move location
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: "100%",
    flexDirection: "column",
    // height: 80,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    paddingTop: 17,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 12,
  },
  containerExpanded: {
    flexDirection: "column",
    height: viewportHeight * 0.9,
    width: viewportWidth * 0.9,
    marginTop: -viewportHeight * 0.8,
    marginBottom: 20,
    padding: 20,
    paddingTop: 17,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 12,

  },
  content: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flexDirection: "row",
    flex: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  location: {
    // paddingLeft: 6,
    paddingRight: 6,
    opacity: 0.4,
  },
  slider: {
    flex: 1,
  },
  link: {
    flex: 0,
    width: 50,
  },
  linkText: {
    fontSize: 10,
  },
});