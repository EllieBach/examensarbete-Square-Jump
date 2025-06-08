import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MainMenuScreen({ navigation }) {
  
    const handleStartGame = async () => {
        navigation.navigate('GameScreen');
    };

    return (
        <View style={styles.container}>
          <Image 
            source={require('../assets/Square_Jump.png')}
            style={styles.logo}
          />
            <TouchableOpacity
                style={styles.mainButton}
                onPress={handleStartGame}
            >
                <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
            <View style={styles.menuGround}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c0e0fc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'pink',
        borderRadius: 10,
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    menuGround: {
        position: 'absolute',
        height: 100,
        width: '100%',
        backgroundColor: '#8B4513',
        bottom: 0,
    },
    logo: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
});
