import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Easing } from "react-native";

const screenWidth = Dimensions.get("window").width;
const OBSTACLE_START_OFFSET = 600;
const startingObstacleLeft = screenWidth + OBSTACLE_START_OFFSET;

export default function GameScreen({ navigation }) {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const obstacleTimers = useRef([]);

  const obstacleWidth = 50;
  const characterBottom = useRef(new Animated.Value(100)).current;
  const characterBottomRef = useRef(100);

  useEffect(() => {
    const loadHighScore = async () => {
      const savedHighScore = await AsyncStorage.getItem("highScore");
      if (savedHighScore) setHighScore(Number(savedHighScore));
    };
    loadHighScore();
  }, []);

  useEffect(() => {
    const id = characterBottom.addListener(({ value }) => {
      characterBottomRef.current = value;
    });
    return () => characterBottom.removeListener(id);
  }, []);

  const jump = () => {
    if (gameOver) {
      restartGame();
    } else if (!isJumping) {
      setIsJumping(true);
      Animated.sequence([
        Animated.timing(characterBottom, {
          toValue: 250,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(characterBottom, {
          toValue: 110,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start(() => setIsJumping(false));
    }
  };

  const spawnObstacle = () => {
    if (gameOver) return;

    const anim = new Animated.Value(startingObstacleLeft);
    const id = Date.now().toString();

    // Add random color selection
    const colors = ["red", "green", "yellow"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setObstacles((prev) => [...prev, { id, anim, color }]);

    Animated.timing(anim, {
      toValue: -obstacleWidth,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setObstacles((prev) => prev.filter((obs) => obs.id !== id));
        setScore((prev) => prev + 1);
      }
    });

    const nextDelay = Math.random() * 1000 + 1000;
    const timer = setTimeout(() => {
      spawnObstacle();
    }, nextDelay);

    obstacleTimers.current.push(timer);
  };

  const clearAllObstacleTimers = () => {
    obstacleTimers.current.forEach((timer) => clearTimeout(timer));
    obstacleTimers.current = [];
  };
//gameover
  useEffect(() => {
    if (!gameOver) {
      spawnObstacle();
    } else {
      clearAllObstacleTimers();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const id = setInterval(() => setScore((s) => s + 1), 1000);
      return () => clearInterval(id);
    }
  }, [gameOver]);

  const restartGame = () => {
    clearAllObstacleTimers();
    setObstacles([]);
    setGameOver(false);
    setScore(0);
  };

  const saveHighScore = async (newHighScore) => {
    await AsyncStorage.setItem("highScore", newHighScore.toString());
    setHighScore(newHighScore);
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const characterLeft = 50;
      const characterRight = characterLeft + 50;
      const cb = characterBottomRef.current;

      for (const obs of obstacles) {
        const left = obs.anim.__getValue();
        const right = left + 50;

        const horizCollision = characterRight > left && characterLeft < right;
        const vertCollision = cb <= 150 && cb > 50;

        if (horizCollision && vertCollision) {
          setGameOver(true);
          navigation.replace("GameOver", { finalScore: score, highScore });
          obstacles.forEach((o) => o.anim.stopAnimation?.());
          if (score > highScore) saveHighScore(score);
          break;
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [obstacles, gameOver]);

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <View style={styles.ground} />

        {/* Character */}
        <Animated.View
          style={[styles.character, { bottom: characterBottom }]}
        />

        {/* Obstacles */}
        {obstacles.map(({ id, anim, color }) => (
          <Animated.View
            key={id}
            style={[
              styles.obstacle,
              {
                left: anim,
                borderBottomColor: color,
              },
            ]}
          />
        ))}

        {/* UI Elements */}
        <View style={styles.ui}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.highScore}>Highscore: {highScore}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0e0fc",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ground: {
    position: "absolute",
    height: 100,
    width: "100%",
    backgroundColor: "#8B4513",
    bottom: 0,
  },
  character: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#00bfff",
    left: 50,
  },
  obstacle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    bottom: 100,
  },
  ui: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
  },
  instructions: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 75,
    textAlign: "center",
  },
  score: {
    fontSize: 30,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  highScore: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
});
