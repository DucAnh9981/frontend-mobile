import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { Colors } from '@/constants/Colors'

type Props = {}

const Header = (props: Props) => {
  return (
    <View style={styles.container}>
        <View style={styles.userInfo}>
      <Image style={styles.avatarUser}  source={require("@/assets/images/background-welcome.jpg")}/>
        <View style={{gap:3}}>
        <Text style={styles.welcomeTxt}>Xin chào</Text>
        <Text style={styles.userName}>Nguyễn Đức Anh</Text>
        </View>
        </View>
      <TouchableOpacity onPress={()=>{}}>

      <Ionicons name='notifications-outline' size={24} color={'black'}/>
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:20
    },
    userInfo:{
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },
    avatarUser:{
        width:50,
        height:50,
        borderRadius:30
    },
    welcomeTxt:{
        fontSize:12,
        color: Colors.darkGrey,
    },
    userName:{
        fontSize:14,
        fontWeight:'700',
        color: Colors.black
    }
})