import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, } from 'react-native';
import { Icon } from 'expo';

class ConnectedButton extends Component{
    render(){
        return(
            <View style={styles.connectedItem}>
                <View style={styles.user}>
                    <Text style={styles.userText}>ID: User</Text>
                </View>
                <TouchableOpacity style={styles.kickButton} onPress={() => {}}>
                        <Icon.Ionicons name={'md-hourglass'} size={50} color="#282828" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.banButton} onPress={() => {}}>
                        <Icon.Ionicons name={'md-hand'} size={50} color="#282828" />
                </TouchableOpacity>
          </View>
        );
    }


}

const styles = StyleSheet.create({
    connectedItem: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#282828',
        margin: 3,
    },
    user: {
        flex: 4,
        justifyContent: 'center',
        backgroundColor: '#282828',
    },
    userText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 20,
    },
    kickButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF8C00',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    banButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DC143C',
    },
  });

export default ConnectedButton