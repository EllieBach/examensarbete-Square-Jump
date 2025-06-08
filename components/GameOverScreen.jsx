import React, {useEffect} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from "react-native";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GameOverScreen({ navigation, route }) {
  const [savedHighScore, setSavedHighScore] = React.useState(null);
  
    const { finalScore, highScore } = route.params;
    useEffect(() => {
      const loadHighScore = async () => {
        const saved = await AsyncStorage.getItem("highScore");
        setSavedHighScore(saved);
      };
      loadHighScore();
    }, []);
    return (
      <View style={styles.container}>
        <Animatable.Text 
          animation="fadeInDown"      // fade in & slide from top
          duration={800}
          style={[styles.title, { marginBottom: 16 }]}
        >
          Game Over
        </Animatable.Text>
        <Animatable.Text animation="fadeIn" delay={200} style={[styles.score, { marginBottom: 16 }]}>
          Your Score: {finalScore}
        </Animatable.Text>
        {finalScore > highScore ? (
          <Text style={[styles.score, { marginBottom: 16 }]}>HighScore: {finalScore}</Text>
        ) : (
          <Text style={[styles.score, { marginBottom: 16 }]}>Previous Highscore: {highScore}</Text>
        )}
       
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("GameScreen")}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MainMenu")}
          >
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#c0e0fc',
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#333',
  },
  score: {
    fontSize: 15,
    marginVertical: 10,
    color: '#333',
  },

  buttonColumn: {
    height: 90,
    justifyContent: "space-between",
    width: 150,
   
  },
  button: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom:10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
