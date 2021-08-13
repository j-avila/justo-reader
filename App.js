import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HeadLogo } from './components/HeadLogo'
import ArticlesList from './components/List'

export default function App() {
  return (
    <View style={styles.container}>
      <HeadLogo />
      <Text style={styles.sub}>Keep in touch with the latest!</Text>
      <ArticlesList />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7c7c7',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  sub: {
    textAlign: 'center',
    padding: 5,
    backgroundColor: '#ffffff',
  },
})
