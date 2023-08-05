import React, { useState, useRef } from 'react';
import { StyleSheet, ImageBackground, View, PanResponder, Text } from 'react-native';
import { TabOneParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

type TabOneScreenRouteProp = RouteProp<TabOneParamList, 'TabOneScreen'>;

type Props = {
  route: TabOneScreenRouteProp;
};

// 背景画像の読み込み
const image = require('vooooooooooon/assets/images/background.gif');

export default function TabOneScreen({ route }: Props) {
  // 円の位置を管理する状態として初期値 { x: 0, y: 0 } を設定
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

  // 前回の位置情報を保持するための ref を作成
  const prevPositionRef = useRef({ x: 0, y: 0 });

  // パンジェスチャーのイベントハンドラを作成
  const panResponder = PanResponder.create({
    // パンジェスチャーを開始する条件
    onStartShouldSetPanResponder: () => true,
    // パンジェスチャー中の処理
    onPanResponderMove: (event, gesture) => {
      const { dx, dy } = gesture;
      // ビューの位置を更新する
      setCirclePosition(prevPosition => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));
      // 振動させる
      if (
        Math.floor(prevPositionRef.current.x / 10) !== Math.floor((prevPositionRef.current.x + dx) / 10) ||
        Math.floor(prevPositionRef.current.y / 10) !== Math.floor((prevPositionRef.current.y + dy) / 10)
      ) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      // prevPositionを更新する
      prevPositionRef.current.x += dx;
      prevPositionRef.current.y += dy;
    },
    // パンジェスチャーの終了時の処理
    onPanResponderRelease: () => {
      // 中央の位置に戻す
      setCirclePosition({ x: 0, y: 0 });
      // prevPositionをリセットする
      prevPositionRef.current.x = 0;
      prevPositionRef.current.y = 0;
    },
  });

  return (
    <View style={styles.container}>
      {/* 背景画像 */}
      <ImageBackground source={image} resizeMode="cover" style={styles.image}></ImageBackground>
      {/* ドラッグ可能な円 */}
      <View
        style={[
          styles.circle,
          { transform: [{ translateX: circlePosition.x }, { translateY: circlePosition.y }] },
        ]}
        {...panResponder.panHandlers}
      ></View>
      {/* x軸とy軸の値を表示するテキスト */}
      <Text style={styles.text}>{`x: ${circlePosition.x.toFixed(2)}, y: ${circlePosition.y.toFixed(2)}`}</Text>
    </View>
  );
}

// スタイルシート
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: 'gray',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    position: 'absolute',
    top: '50%', // 画面の中央に配置するために '50%' を指定
    marginTop: -50, // 高さの半分をマイナスマージンで調整して中央揃え
  },
  text: {
    position: 'absolute',
    top: '50%', // 画面の中央に配置するために '50%' を指定
    left: 0,
    right: 0,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
