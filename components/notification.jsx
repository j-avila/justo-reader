import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Notification = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.paragraph}>You're working offline</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'red',
  },
  paragraph: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 6,
  },
})

export default Notification
