import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedProps,
  EasingNode,
  withRepeat,
  withSequence,
  withDelay,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, {Circle, Rect, G} from 'react-native-svg';

const AnimCircle = Animated.createAnimatedComponent(Circle);
const AnimRect = Animated.createAnimatedComponent(Rect);
const AnimG = Animated.createAnimatedComponent(G);

const CircleBias = ({radius}: {radius: number}) => {
  const keliling = 2 * Math.PI * radius;
  const circleRef = useRef(null);
  const offsetNum = useSharedValue(keliling * 3 - 0);

  useEffect(() => {
    offsetNum.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(keliling * 3 - keliling / 3, {
            duration: 1000,
          }),
          withTiming(keliling * 3, {
            duration: 1000,
          }),
        ),
        4,
        false,
      ),
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: offsetNum.value,
    };
  });

  return (
    <G rotation={-150} origin={`150,150`}>
      <AnimCircle
        cx={150}
        cy={150}
        r={radius}
        fill="transparent"
        stroke="yellow"
        strokeWidth={10}
        strokeDasharray={[keliling / 3, (keliling * 2) / 3]}
        strokeOpacity={0.4}
      />
      <AnimCircle
        ref={circleRef}
        cx={150}
        cy={150}
        r={radius}
        fill="transparent"
        stroke="yellow"
        strokeWidth={10}
        strokeDasharray={[keliling / 3, (keliling * 2) / 3, keliling]}
        animatedProps={animatedProps}
      />
    </G>
  );
};

const RectBias = ({width}: {width: number}) => {
  const widthNum = useSharedValue(0);
  const rotationNum = useSharedValue(30);
  const transtX = useSharedValue(0);

  const keliling = 2 * Math.PI * width;

  useEffect(() => {
    transtX.value = withTiming(-width / 2, {duration: 1000});
    widthNum.value = withTiming(width + 5, {duration: 1000});
    rotationNum.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(150, {
            duration: 1000,
          }),
          withTiming(30, {
            duration: 1000,
          }),
        ),
        4,
        false,
        () => {
          transtX.value = withTiming(0, {duration: 1000});
          widthNum.value = withTiming(0, {duration: 1000});
        },
      ),
    );
  }, []);

  const animatedIndicator = useAnimatedStyle(() => {
    return {
      width: widthNum.value,
      transform: [
        {rotate: `${rotationNum.value}deg`},
        {translateX: transtX.value},
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 15,
          backgroundColor: 'yellow',
          position: 'absolute',
          borderRadius: 30,
        },
        animatedIndicator,
      ]}
    />
  );
};

const App: React.FC = () => {
  const radius = 50;
  const radius2 = 70;
  const radius3 = 90;

  const colorOpacity = useSharedValue(0.3);

  const colorOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: colorOpacity.value,
    };
  });

  useEffect(() => {
    colorOpacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 1000}),
          withTiming(0.3, {duration: 1000}),
        ),
        4,
      ),
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Svg
          height="300"
          width="300"
          viewBox="0 0 300 300"
          style={{
            borderWidth: 1,
            backgroundColor: '#404040',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CircleBias radius={radius} />
          <CircleBias radius={radius2} />
          <CircleBias radius={radius3} />
          <Circle r={10} cx={150} cy={150} fill="yellow" />
        </Svg>
        <RectBias width={radius3} />

        <Animated.Text
          style={[
            {
              position: 'absolute',
              color: 'yellow',
              fontSize: 25,
              fontWeight: 'bold',
              bottom: 90,
            },
            colorOpacityStyle,
          ]}>
          No Signal
        </Animated.Text>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
