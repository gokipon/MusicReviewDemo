import { StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Text, View } from '../../components/Themed';
import {musicFeelingDataContext } from './index';
import { VictoryChart, VictoryLine } from 'victory-native';

export default function TabTwoScreen() {

  // useContextでvibrationDataRefを参照する
  const data = useContext(musicFeelingDataContext);
  console.log(data)

  //x軸:経過時間
  //y軸:ポジティブな気持ち
  const sampleData = [
    { tension: 1, elapsedTime: 100 },
    { tension: 2, elapsedTime: 200 },
    { tension: 3, elapsedTime: 250 },
    { tension: 4, elapsedTime: 400 },
    { tension: 5, elapsedTime: 500 }
  ];

  return (
    <View style={styles.container}>
      <VictoryChart>
        <VictoryLine
          interpolation="linear"
          data={data}
          style={{ data: { stroke: "#c43a31" } }}
          x="elapsedTime"
          y="tension"
        />
      </VictoryChart>
      <Text style={styles.title}>Yesterday / Beatles</Text>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
