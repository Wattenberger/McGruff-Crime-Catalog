import React from 'react';
import { TouchableNativeFeedback, StyleSheet, Text, View } from 'react-native';

const Button = ({ title, type="full", color="teal", ...props }) => (
    <TouchableNativeFeedback {...props}
    background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={[styles.button, styles[type], styles[color]]}>
            { typeof title == "string" ? (
                <Text style={styles.text}>
                    { title.toUpperCase() }
                </Text>
                ) : title
            }
        </View>
    </TouchableNativeFeedback>
)

export default Button
const styles = StyleSheet.create({
  button: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    // width: "100%",
    borderRadius: 28,
    paddingTop: 10,
    alignSelf: "flex-start",
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#228986",
    },
full: {
        width: "100%",
    },
text: {
    color: "#fff",
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  grey: {
    backgroundColor: "#aaa",
  }
})