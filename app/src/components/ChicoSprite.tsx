import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { useRotationLoop } from '@/lib/motion';

export type ChicoPose = 'idle' | 'listening' | 'celebrating' | 'talking';

type Props = {
  pose?: ChicoPose;
  size?: number;
};

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Chico, o polvo mascote — SVG portado do protótipo (Falamigos.dc.html).
 * Ponto de troca: quando houver arte final ilustrada, este componente pode
 * devolver uma <Image> em vez do SVG, mantendo a mesma prop `pose`.
 */
export function ChicoSprite({ pose = 'idle', size = 160 }: Props) {
  const isCelebrating = pose === 'celebrating';

  const backRotation = useRotationLoop(5000, 0, isCelebrating ? 10 : 3);
  const frontRotation = useRotationLoop(4200, 300, isCelebrating ? 12 : 4.2);
  const armRotation = useRotationLoop(2400, 0, isCelebrating ? 24 : 0);

  const backProps = useAnimatedProps(() => ({ rotation: backRotation.value }));
  const frontProps = useAnimatedProps(() => ({ rotation: frontRotation.value }));
  const armProps = useAnimatedProps(() => ({ rotation: armRotation.value }));

  const eyeScale = pose === 'listening' ? 1.14 : isCelebrating ? 1.05 : 1;
  const browOffset = pose === 'listening' ? -7 : isCelebrating ? -3 : 0;

  const mouthT = useSharedValue(0);
  useEffect(() => {
    if (pose === 'talking') {
      mouthT.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 160, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 90 })
        ),
        -1,
        false
      );
    } else {
      mouthT.value = 0;
    }
  }, [pose]);

  const closedMouthProps = useAnimatedProps(() => ({
    opacity: pose === 'talking' ? 1 - mouthT.value : isCelebrating ? 0 : 1,
  }));
  const openMouthProps = useAnimatedProps(() => ({
    opacity: pose === 'talking' ? mouthT.value : isCelebrating ? 1 : 0,
  }));

  return (
    <View style={{ width: size, height: (size * 250) / 240 }}>
      <Svg width={size} height={(size * 250) / 240} viewBox="0 0 240 250">
        <AnimatedG originX={120} originY={150} animatedProps={backProps}>
          <Path d="M74,158 C40,186 30,214 44,238" stroke="#D4553F" strokeWidth={24} strokeLinecap="round" fill="none" />
          <Path d="M166,158 C200,186 210,212 196,238" stroke="#D4553F" strokeWidth={24} strokeLinecap="round" fill="none" />
        </AnimatedG>

        <AnimatedG originX={120} originY={150} animatedProps={frontProps}>
          <Path d="M86,168 C68,204 78,226 56,244" stroke="#FF7E67" strokeWidth={26} strokeLinecap="round" fill="none" />
          <Path d="M120,176 C116,212 126,228 112,246" stroke="#FF7E67" strokeWidth={26} strokeLinecap="round" fill="none" />
          <Path d="M154,168 C172,204 162,226 184,244" stroke="#FF7E67" strokeWidth={26} strokeLinecap="round" fill="none" />
        </AnimatedG>

        <AnimatedG originX={196} originY={116} animatedProps={armProps}>
          <Path d="M196,116 C232,100 240,64 226,36" stroke="#FF7E67" strokeWidth={24} strokeLinecap="round" fill="none" />
        </AnimatedG>

        {/* cabeça */}
        <Ellipse cx={120} cy={106} rx={86} ry={78} fill="#E8674F" />
        <Ellipse cx={120} cy={100} rx={82} ry={74} fill="#FF7E67" />
        <Ellipse cx={120} cy={122} rx={62} ry={50} fill="#FF9A86" />
        <Ellipse cx={86} cy={58} rx={26} ry={16} fill="#FFB6A5" opacity={0.6} rotation={-25} originX={86} originY={58} />

        {/* sobrancelhas */}
        <G translateY={browOffset}>
          <Path d="M62,62 C74,48 92,46 102,54" stroke="#B33F2C" strokeWidth={9} strokeLinecap="round" fill="none" />
          <Path d="M138,54 C150,46 166,50 178,64" stroke="#B33F2C" strokeWidth={9} strokeLinecap="round" fill="none" />
        </G>

        {/* olhos */}
        <G originX={120} originY={102} scale={eyeScale}>
          <Circle cx={88} cy={102} r={30} fill="#FFFFFF" stroke="#C2503A" strokeWidth={5} />
          <Circle cx={152} cy={102} r={30} fill="#FFFFFF" stroke="#C2503A" strokeWidth={5} />
          <Circle cx={93} cy={108} r={15} fill="#0A2231" />
          <Circle cx={157} cy={108} r={15} fill="#0A2231" />
          <Circle cx={86} cy={99} r={7} fill="#FFFFFF" />
          <Circle cx={150} cy={99} r={7} fill="#FFFFFF" />
        </G>

        {/* boca fechada (idle/listening) */}
        <AnimatedPath
          d="M100,146 C110,166 132,166 142,146 C132,152 110,152 100,146 Z"
          fill="#8C2E1E"
          animatedProps={closedMouthProps}
        />
        {/* boca aberta (falando / comemorando) */}
        <AnimatedPath
          d="M96,142 C96,168 146,168 146,142 C146,158 96,158 96,142 Z"
          fill="#5C1B10"
          animatedProps={openMouthProps}
        />

        <Ellipse cx={62} cy={132} rx={14} ry={8} fill="#FF5C48" opacity={0.55} />
        <Ellipse cx={178} cy={132} rx={14} ry={8} fill="#FF5C48" opacity={0.55} />
      </Svg>
    </View>
  );
}
