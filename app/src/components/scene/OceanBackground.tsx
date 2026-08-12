import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useBob, useRise, useSway } from '@/lib/motion';
import { DeviceTilt, useParallaxStyle } from '@/lib/parallax';

type Props = {
  /** 'fundo' = cena padrão; 'premio' = luz dourada da recompensa. */
  variant?: 'fundo' | 'premio';
  bubbles?: number;
  children?: React.ReactNode;
  tilt?: DeviceTilt;
};

function RisingBubble({
  x,
  size,
  duration,
  delay,
}: {
  x: number;
  size: number;
  duration: number;
  delay: number;
}) {
  const style = useRise(duration, delay, 820);
  return (
    <Animated.View
      style={[
        styles.bubbleDot,
        { left: x, width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

function Seaweed({
  x,
  scale,
  color,
  delay,
}: {
  x: number;
  scale: number;
  color: string;
  delay: number;
}) {
  const style = useSway(6400 + delay * 0.4, 5, delay);
  const w = 56 * scale;
  const h = 140 * scale;
  return (
    <Animated.View style={[styles.weedWrap, { left: x, width: w, height: h }, style]} pointerEvents="none">
      <Svg width={w} height={h} viewBox="0 0 56 140">
        <Path
          d="M28 138 C18 110 10 88 16 58 C22 34 12 22 20 8 C34 28 30 48 34 72 C38 98 42 118 40 138 Z"
          fill={color}
          opacity={0.92}
        />
        <Path
          d="M30 138 C36 112 44 90 40 62 C37 42 46 28 42 12 C52 32 50 54 48 78 C46 104 44 122 38 138 Z"
          fill={color}
          opacity={0.55}
        />
      </Svg>
    </Animated.View>
  );
}

function DriftFish({
  x,
  y,
  scale,
  delay,
}: {
  x: number;
  y: number;
  scale: number;
  delay: number;
}) {
  const bob = useBob(5200 + delay, 6, delay, 1.2);
  const w = 36 * scale;
  const h = 18 * scale;
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y, width: w, height: h }, bob]} pointerEvents="none">
      <Svg width={w} height={h} viewBox="0 0 36 18">
        <Ellipse cx={16} cy={9} rx={11} ry={6} fill="#1A8BA6" opacity={0.28} />
        <Path d="M26 9 L34 4 L34 14 Z" fill="#1A8BA6" opacity={0.22} />
        <Circle cx={10} cy={8} r={1.2} fill="#06364A" opacity={0.35} />
      </Svg>
    </Animated.View>
  );
}

/**
 * Fundo do Mar — superfície clara (encaixa o vídeo do Chico) → profundidade.
 */
export function OceanBackground({ variant = 'fundo', bubbles = 8, children, tilt }: Props) {
  const { width, height } = useWindowDimensions();
  const fallbackX = useSharedValue(0);
  const fallbackY = useSharedValue(0);
  const effective = tilt ?? { x: fallbackX, y: fallbackY };

  const farStyle = useParallaxStyle(effective, { px: -18, py: -12 });
  const midStyle = useParallaxStyle(effective, { px: -10, py: -7 });
  const nearStyle = useParallaxStyle(effective, { px: 14, py: 9 });

  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: bubbles }, (_, i) => ({
        x: 16 + ((i * 97) % Math.max(width - 40, 40)),
        size: 5 + (i % 5) * 2.2,
        duration: 9000 + (i % 6) * 1100,
        delay: i * 700,
      })),
    [bubbles, width]
  );

  const fish = useMemo(
    () => [
      { x: width * 0.12, y: height * 0.42, scale: 1, delay: 200 },
      { x: width * 0.72, y: height * 0.36, scale: 0.85, delay: 900 },
      { x: width * 0.55, y: height * 0.58, scale: 0.7, delay: 1500 },
    ],
    [width, height]
  );

  const rayTop = variant === 'premio' ? colors.estrela : '#C8F4FF';
  const rayOpacity = variant === 'premio' ? 0.42 : 0.28;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="oceanDepth" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="42%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#F2FBFD" />
            <Stop offset="58%" stopColor="#B8EAF5" />
            <Stop offset="70%" stopColor="#2A9BB8" />
            <Stop offset="86%" stopColor="#0B5F7A" />
            <Stop offset="100%" stopColor="#042838" />
          </LinearGradient>
          <LinearGradient id="godRay" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={rayTop} stopOpacity={0} />
            <Stop offset="40%" stopColor={rayTop} stopOpacity={0} />
            <Stop offset="52%" stopColor={rayTop} stopOpacity={rayOpacity} />
            <Stop offset="78%" stopColor={rayTop} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={rayTop} stopOpacity={0} />
          </LinearGradient>
          <RadialGradient id="surfaceGlow" cx="50%" cy="12%" r="80%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="70%" stopColor="#FFFFFF" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="sandGlow" cx="50%" cy="100%" r="55%">
            <Stop offset="0%" stopColor="#FFE8C2" stopOpacity={0.95} />
            <Stop offset="55%" stopColor="#E8C98A" stopOpacity={0.55} />
            <Stop offset="100%" stopColor="#042838" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Path d={`M0,0 H${width} V${height} H0 Z`} fill="url(#oceanDepth)" />
        <Ellipse cx={width * 0.5} cy={height * 0.12} rx={width} ry={height * 0.42} fill="url(#surfaceGlow)" />

        {/* Raios de superfície */}
        <Path
          d={`M${width * 0.08},0 L${width * 0.28},0 L${width * 0.18},${height * 0.62} L${width * 0.02},${height * 0.62} Z`}
          fill="url(#godRay)"
        />
        <Path
          d={`M${width * 0.42},0 L${width * 0.58},0 L${width * 0.52},${height * 0.7} L${width * 0.38},${height * 0.7} Z`}
          fill="url(#godRay)"
          opacity={0.75}
        />
        <Path
          d={`M${width * 0.72},0 L${width * 0.92},0 L${width * 0.98},${height * 0.55} L${width * 0.78},${height * 0.55} Z`}
          fill="url(#godRay)"
          opacity={0.85}
        />
      </Svg>

      {/* Longe — volume + peixes */}
      <Animated.View style={[StyleSheet.absoluteFill, farStyle]} pointerEvents="none">
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Ellipse cx={width * 0.18} cy={height * 0.52} rx={width * 0.28} ry={70} fill="#0A6A82" opacity={0.22} />
          <Ellipse cx={width * 0.85} cy={height * 0.48} rx={width * 0.3} ry={80} fill="#0A6A82" opacity={0.2} />
        </Svg>
        {fish.map((f, i) => (
          <DriftFish key={i} {...f} />
        ))}
      </Animated.View>

      {/* Meio — corais */}
      <Animated.View style={[StyleSheet.absoluteFill, midStyle]} pointerEvents="none">
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Ellipse cx={width * 0.08} cy={height * 0.82} rx={width * 0.26} ry={90} fill="#0E7590" opacity={0.55} />
          <Ellipse cx={width * 0.92} cy={height * 0.78} rx={width * 0.3} ry={100} fill="#127A94" opacity={0.5} />
          <Ellipse cx={width * 0.5} cy={height * 0.88} rx={width * 0.55} ry={70} fill="#0A5F75" opacity={0.35} />

          <Path
            d={`M${width * 0.1},${height * 0.92} Q${width * 0.02},${height * 0.78} ${width * 0.08},${height * 0.68}`}
            stroke="#FF8A74"
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          />
          <Path
            d={`M${width * 0.12},${height * 0.92} Q${width * 0.16},${height * 0.76} ${width * 0.2},${height * 0.66}`}
            stroke="#E8674F"
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
          <Path
            d={`M${width * 0.88},${height * 0.93} Q${width * 0.96},${height * 0.8} ${width * 0.9},${height * 0.7}`}
            stroke="#FF9A86"
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
          <Path
            d={`M${width * 0.86},${height * 0.93} Q${width * 0.8},${height * 0.78} ${width * 0.78},${height * 0.68}`}
            stroke="#E8674F"
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
            opacity={0.45}
          />
        </Svg>
      </Animated.View>

      {/* Perto — areia + algas */}
      <Animated.View style={[StyleSheet.absoluteFill, nearStyle]} pointerEvents="none">
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="sandGlowNear" cx="50%" cy="100%" r="55%">
              <Stop offset="0%" stopColor="#FFE8C2" stopOpacity={0.95} />
              <Stop offset="55%" stopColor="#E8C98A" stopOpacity={0.55} />
              <Stop offset="100%" stopColor="#042838" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={width * 0.5} cy={height * 1.02} rx={width * 0.85} ry={height * 0.18} fill="url(#sandGlowNear)" />
          <Path
            d={`M0,${height * 0.9}
               C${width * 0.18},${height * 0.86} ${width * 0.32},${height * 0.94} ${width * 0.5},${height * 0.89}
               C${width * 0.68},${height * 0.84} ${width * 0.82},${height * 0.93} ${width},${height * 0.88}
               L${width},${height} L0,${height} Z`}
            fill="#F3D9A4"
            opacity={0.92}
          />
          <Path
            d={`M0,${height * 0.94}
               C${width * 0.22},${height * 0.91} ${width * 0.4},${height * 0.97} ${width * 0.58},${height * 0.93}
               C${width * 0.76},${height * 0.9} ${width * 0.9},${height * 0.96} ${width},${height * 0.93}
               L${width},${height} L0,${height} Z`}
            fill="#FFE8C2"
            opacity={0.98}
          />
          <Ellipse cx={width * 0.22} cy={height * 0.955} rx={7} ry={4} fill="#D4B07A" opacity={0.7} />
          <Ellipse cx={width * 0.38} cy={height * 0.965} rx={5} ry={3} fill="#C9A46E" opacity={0.65} />
          <Ellipse cx={width * 0.7} cy={height * 0.96} rx={8} ry={4.5} fill="#D4B07A" opacity={0.7} />
          <Ellipse cx={width * 0.84} cy={height * 0.952} rx={4} ry={2.5} fill="#B8925C" opacity={0.6} />
          <Path
            d={`M${width * 0.58},${height * 0.958}
               C${width * 0.56},${height * 0.945} ${width * 0.55},${height * 0.938} ${width * 0.58},${height * 0.935}
               C${width * 0.62},${height * 0.938} ${width * 0.62},${height * 0.948} ${width * 0.6},${height * 0.958} Z`}
            fill="#FFF6E8"
            opacity={0.85}
          />
        </Svg>

        <Seaweed x={width * 0.02} scale={1.05} color="#1FA88A" delay={0} />
        <Seaweed x={width * 0.1} scale={0.78} color="#168F75" delay={400} />
        <Seaweed x={width * 0.78} scale={0.9} color="#1FA88A" delay={800} />
        <Seaweed x={width * 0.88} scale={1.15} color="#127A64" delay={1200} />
      </Animated.View>

      {bubbleSeeds.map((b, i) => (
        <RisingBubble key={i} x={b.x} size={b.size} duration={b.duration} delay={b.delay} />
      ))}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleDot: {
    position: 'absolute',
    bottom: 48,
    backgroundColor: 'rgba(255,255,255,0.38)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  weedWrap: {
    position: 'absolute',
    bottom: 2,
  },
});
