import React from 'react';
import PropTypes from "prop-types";
import { BackHandler, Dimensions, Modal, Slider, StyleSheet, Text, TextInput, View, ViewPropTypes, TouchableHighlight, TouchableOpacity } from 'react-native';
import Button from "./Button"
import { Svg } from 'expo';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const numberWithCommas = (x="") => {
  if (!x) return ""
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
export default class AlertItemModal extends React.Component {
  state = {
    isEditingTitle: false,
    newTitle: "",
  }

  static propTypes = {
    location: PropTypes.array,
    distance: PropTypes.number,
    onUpdate: PropTypes.func,
    onResetLocation: PropTypes.func,
  }

  static defaultProps = {
    distance: 10,
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onTitleUpdate = newTitle => {
    this.setState({ newTitle });
  }

  onBackPress = () => {

    this.props.onClose()
    return true
  }

  onDelete = () => {
    this.props.onDelete()
    this.onClose()
  }

  onClose = () => {
    const { newTitle } = this.state
    this.props.onClose()
  }

  onToggleEdit = () => {
    const { newTitle } = this.state
    if (newTitle && this.state.isEditingTitle) {
      this.props.onUpdate({
        label: newTitle,
      })
    }
    this.setState({ isEditingTitle: !this.state.isEditingTitle })
  }

  render() {
    const { index, label, latitude, longitude, distance, color, isVisible, onDistanceChange, onResetLocation, onDelete, onClose,...props } = this.props
    const { newTitle, isEditingTitle } = this.state
    const isNewAlert = !latitude && !distance && !label

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        style={{margin: 50}}
        presentationStyle="pageSheet"
        onRequestClose={() => {}}>
        <View style={{padding: 20, paddingTop: 40, flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%"}}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: "flex-start", height: 50}}>

            <View>
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
                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                  {isEditingTitle ? (
                    <TextInput
                      style={{fontSize: 32, height: 47, lineHeight: 50, marginBottom: 8, flex: 1, marginRight: 10, borderColor: "#fff",}}
                      onChangeText={this.onTitleUpdate}
                      value={newTitle}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.title}>
                      { label || `Alert ${ (index || 0) + 1 }` }
                    </Text>
                  )}


                  <TouchableOpacity onPress={this.onToggleEdit}>
                    {isEditingTitle ? (
                      newTitle ? (
                        <Svg height={25} width={25}>
                          <Svg.Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                          <Svg.Path d="M22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                        </Svg>
                      ) : (
                        <Svg height={25} width={25}>
                          <Svg.Circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                          <Svg.Line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                          <Svg.Line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} stroke={color} fill="none" />
                        </Svg>
                      )
                    ) : (
                      <Svg height={25} width={25}>
                        <Svg.Polygon
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="18 2 22 6 12 16 8 16 8 12 18 2"
                          strokeWidth={2.5}
                          stroke={color}
                          fill="none"
                        />
                        <Svg.Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
                          strokeWidth={2}
                          stroke={color}
                          fill="none"
                        />
                      </Svg>
                    )}
                  </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "flex-start"}}>
                  <View style={{marginRight: 6, paddingTop: 12}}>
                    <Svg height={25} width={25}>
                      <Svg.Circle
                        cx={12}
                        cy={10}
                        r={3}
                        strokeWidth={2.5}
                        stroke="#666"
                        fill="none"
                      />
                      <Svg.Path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        strokeWidth={2}
                        stroke="#666"
                        fill="none"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.label}>
                    Location
                  </Text>
                </View>
                { latitude ? (
                  <Text style={[styles.location, styles.value]}>
                    { latitude.slice(0, 7) }, { longitude.slice(0, 7) }
                  </Text>
                ) : (
                  <Text style={[styles.location, styles.value]}>
                    Near me
                  </Text>
                )}
              </View>
              {!!latitude ? (
                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',}}>
                  <Button
                    title={
                      <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',}}>
                      <Svg height={25} width={25}>
                        <Svg.Circle cx="12" cy="12" r="10" strokeWidth={2.5} stroke={color} fill="none" />
                        <Svg.Circle cx={12} cy={12} r={2} strokeWidth={2.5} stroke={color} fill="none" />
                        <Svg.Line x1="22" y1="12" x2="18" y2="12" strokeWidth={2.5} stroke={color} fill="none" />
                        <Svg.Line x1="6" y1="12" x2="2" y2="12" strokeWidth={2.5} stroke={color} fill="none" />
                        <Svg.Line x1="12" y1="6" x2="12" y2="2" strokeWidth={2.5} stroke={color} fill="none" />
                        <Svg.Line x1="12" y1="22" x2="12" y2="18" strokeWidth={2.5} stroke={color} fill="none" />
                      </Svg>

                        <Text style={{
                          color: "#fff",
                          fontWeight: 'bold',
                          letterSpacing: 1,
                          marginLeft: 8,
                        }}>
                            SET TO NEAR ME
                        </Text>
                      </View>
                    }
                    onPress={onResetLocation}
                  />
                </View>
              ) : (
                <Text style={{opacity: 0.5}}>
                  Set a location by dragging the marker on the map view
                </Text>
              )}
            </View>
            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "flex-start"}}>
                  <View style={{marginRight: 6, paddingTop: 12}}>
                    <Svg height={25} width={25}>
                      <Svg.Circle cx={12} cy={12} r={10} strokeWidth={2.5} stroke="#666" fill="none" />
                      <Svg.Circle cx={12} cy={12} r={6} strokeWidth={2.5} stroke="#666" fill="none" />
                      <Svg.Circle cx={12} cy={12} r={2} strokeWidth={2.5} stroke="#666" fill="none" />
                    </Svg>
                  </View>
                  <Text style={styles.label}>
                    Distance
                  </Text>
                </View>
                {distance && (
                  <Text style={styles.value}>
                    within { numberWithCommas(Math.round(distance)) } feet
                  </Text>
                )}
              </View>

              <Slider
                style={{width: "100%"}}
                value={distance}
                minimumValue={10}
                maximumValue={5000}
                onSlidingComplete={onDistanceChange}
              />
            </View>

        </View>

        <View style={{marginTop: "auto"}}>
          <View style={{marginBottom: 16,}}>
          <Button
            color="grey"
            title={
              <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',}}>
                <Svg height={25} width={25}>
                  <Svg.Path
                    d="M3 6 5 6 21 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    stroke="#fff"
                    fill="none"
                  />
                  <Svg.Path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    stroke="#fff"
                    fill="none"
                  />
                </Svg>
                <Text style={{
                  color: "#fff",
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  marginLeft: 8,
                }}>
                    DELETE ALERT
                </Text>
              </View>
            }
            onPress={this.onDelete}
          />
          </View>
          <Button
            title={
              <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',}}>

                <Svg height={25} width={25}>
                  <Svg.Path
                    d="M12 19 5 12 12 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    stroke="#fff"
                    fill="none"
                  />
                  <Svg.Line
                    x1="19" y1="12" x2="5" y2="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    stroke="#fff"
                    fill="none"
                  />
                </Svg>
                <Text style={{
                  color: "#fff",
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  marginLeft: 8,
                }}>
                    BACK TO MAP
                </Text>
              </View>
            }
            onPress={this.onClose}
          />
        </View>
      </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: "100%",
    flexDirection: "column",
    height: 80,
    marginTop: 40,
    marginBottom: 20,
    padding: 20,
    paddingTop: 52,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 12,
  },
  title: {
    fontSize:32,
    fontWeight: 'bold',
    // letterSpacing: 0.5,
    marginBottom: 12,
  },
  section: {
    marginTop: 20,
    marginBottom: 40,
    // flex: 1,
    // height: 60,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'baseline',
    paddingBottom: 10,
  },
  location: {
    // paddingLeft: 6,
    paddingRight: 6,
    opacity: 0.4,
  },
  value: {
    fontSize: 18,
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