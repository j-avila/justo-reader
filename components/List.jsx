import React, { useState, useEffect } from 'react'
import { Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import * as WebBrowser from 'expo-web-browser'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { SwipeListView } from 'react-native-swipe-list-view'
import Notification from './notification'
import { removeDuplicates } from './helplers'

const API_URL = 'https://hn.algolia.com/api/v1/search_by_date'

export default ArticlesList = () => {
  const [articles, setArticles] = useState()
  const [connected, setConnected] = useState()

  const networkDetector = () => {
    NetInfo.fetch().then(state => {
      console.log(`Is connected? ${state.isConnected}`)
      setConnected(state.isConnected)
    })
  }

  // handling the articles state and storing in localStorage
  const apiData = async () =>
    fetch(API_URL)
      .then(resp => resp.json())
      .then(list => {
        const artList = list.hits
        const itemsList = artList
          .filter(
            (post, index) => post.story_title && post.story_url
            // artList.indexOf(post.story_id) === index
          )
          .map((item, index) => ({
            text:
              item.story_title.length > 50
                ? item.story_title.substring(0, 50 - 3) + '...'
                : item.story_title,
            url: item.story_url,
            key: `item-${index}`,
          }))
        const cleanedList = removeDuplicates(itemsList, item => item.url)

        // setting state and storing cached data
        setArticles(cleanedList)
        storeData(cleanedList)
      })

  // offline managment
  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@articles', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }
  const getOffLineData = async () => {
    try {
      const value = await AsyncStorage.getItem('@articles')
      if (value !== null) {
        const data = await JSON.parse(value)
        setArticles(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // list managing
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey)
    const newData = [...articles]
    const prevIndex = articles.findIndex(item => item.key === rowKey)
    newData.splice(prevIndex, 1)
    setArticles(newData)
  }

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  const renderItem = data => (
    <TouchableHighlight
      onPress={e => WebBrowser.openBrowserAsync(data.item.url)}
      style={styles.rowFront}
      underlayColor={'#AAA'}
    >
      <View>
        <Text>{data.item.text}</Text>
      </View>
    </TouchableHighlight>
  )

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <Text>Left</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  )

  useEffect(() => {
    apiData()
    networkDetector()
  }, [])

  useEffect(() => {
    if (!connected) {
      getOffLineData()
    }
  }, [connected])

  return (
    <View style={styles.container}>
      {!articles ? (
        <Ionicons
          style={styles.spinner}
          name="ios-sync-sharp"
          size={54}
          color="black"
        />
      ) : articles.length <= 0 ? (
        <Text>There's no articles</Text>
      ) : (
        <SwipeListView
          data={articles}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
        />
      )}
      {!connected && <Notification />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  spinner: {
    textAlign: 'center',
    marginVertical: 120,
    justifyContent: 'center',
  },
})
