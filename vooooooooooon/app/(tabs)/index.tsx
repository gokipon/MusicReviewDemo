import React, { useState, useRef, createContext } from 'react';
import { StyleSheet, ImageBackground, View, PanResponder, Text, Button } from 'react-native';
import { TabOneParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import {Audio} from 'expo-av';

type TabOneScreenRouteProp = RouteProp<TabOneParamList, 'TabOneScreen'>;

type Props = {
  route: TabOneScreenRouteProp;
};

// 背景画像の読み込み
const image = require('vooooooooooon/assets/images/background.gif');

type MusicFeelingDataRef = [{ tension: number; elapsedTime: number; }];
const musicFeelingDataRef = useRef<MusicFeelingDataRef>([{ tension: 0, elapsedTime: 0 }]);
export const musicFeelingDataContext = createContext(musicFeelingDataRef.current);

export default function TabOneScreen({ route }: Props) {

  const musicPath = require('vooooooooooon/assets/sampleMusic/rota.mp3');
  const sound = new Audio.Sound();
  sound.loadAsync(musicPath);
  //音楽再生ハンドラ
  const onPlayMusicButtonHandler = async() =>{
    await sound.playAsync();
  }
  // 円の位置を管理する状態として初期値 { x: 0, y: 0 } を設定
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

  // 再生ボタンを押した時の時間を保持するための ref を作成
  const playbackStartTimeRef = useRef(Date.now());

  // 前回の位置情報を保持するための ref を作成
  const prevPositionRef = useRef({ x: 0, y: 0 });
  // 前回の位置情報を保持するための ref を作成
  const prevElapsedTimeRef = useRef(0);

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

      // // 振動
      // if (
      //   //10px毎に振動
      //   Math.floor(prevPositionRef.current.x / 10) !== Math.floor((prevPositionRef.current.x + dx) / 10) ||
      //   Math.floor(prevPositionRef.current.y / 10) !== Math.floor((prevPositionRef.current.y + dy) / 10)
      // ) {
      //    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      // }

      //気持ちのテンションを求めるalgorithm
      if (
        //10px毎に振動
        Math.floor(prevPositionRef.current.x / 50) !== Math.floor((prevPositionRef.current.x + dx) / 50) ||
        Math.floor(prevPositionRef.current.y / 50) !== Math.floor((prevPositionRef.current.y + dy) / 50)
      ) {
        const elapsedTime = (Date.now() - playbackStartTimeRef.current) /(1000);
        const tension = 50 / (elapsedTime - prevElapsedTimeRef.current);
        
        musicFeelingDataRef.current.push({ tension: tension, elapsedTime: elapsedTime });

        console.log("tension : "+tension+", elapsedTime : " + elapsedTime)
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
      <Button title="音楽再生" onPress={onPlayMusicButtonHandler} />
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
