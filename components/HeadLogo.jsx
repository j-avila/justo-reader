import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

export const HeadLogo = () => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../assets/hackernews.jpeg')}
        style={styles.logo}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#f36522',
  },
  logo: {
    width: 250,
    height: 150,
  },
})
