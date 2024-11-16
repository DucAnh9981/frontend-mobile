import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, Text, View } from 'react-native'
import React from 'react'


const Loading = (props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<ActivityIndicator> & Readonly<ActivityIndicatorProps>) => {
  return (
    <View>
      <ActivityIndicator {...props}/>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})