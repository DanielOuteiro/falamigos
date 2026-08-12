import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { WordArt } from '@/components/WordArt';
import { colors, fontFamily } from '@/theme/colors';

const openSource = require('../../../assets/cofre.mp4');
const closeSource = require('../../../assets/cofre-fecha.mp4');

const CHEST_SIZE = 280;
const BUBBLE = 72;
/** Cor exacta do fundo do mp4 do baú (amostrada nos frames). */
const COFRE_BG = '#FDFDFA';
/** Boca do baú aberto — centro do vídeo, um pouco acima do meio. */
const MOUTH = { x: 0, y: CHEST_SIZE * 0.08 };

type Phase = 'opening' | 'collecting' | 'closing' | 'done';

type Props = {
  wordIds: string[];
  data: string;
  nome: string;
  onComplete: () => void;
};

export function CofreFechando({ wordIds, data, nome, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('opening');
  const [fly, setFly] = useState(false);
  const videoRef = useRef<Video>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (phase !== 'collecting') return;
    void videoRef.current?.pauseAsync();
    if (wordIds.length === 0) {
      const t = setTimeout(() => setPhase('closing'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setFly(true), 420);
    return () => clearTimeout(t);
  }, [phase, wordIds.length]);

  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete();
    }, 1600);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  function onOpenStatus(status: AVPlaybackStatus) {
    if (!status.isLoaded || !status.didJustFinish) return;
    setPhase((p) => (p === 'opening' ? 'collecting' : p));
  }

  function onCloseStatus(status: AVPlaybackStatus) {
    if (!status.isLoaded || !status.didJustFinish) return;
    setPhase((p) => (p === 'closing' ? 'done' : p));
  }

  function onBubblesInside() {
    setPhase('closing');
  }

  const source = phase === 'closing' || phase === 'done' ? closeSource : openSource;
  const shouldPlay = phase === 'opening' || phase === 'closing';
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      {/* Cobre o oceano/Chico: branco no topo, mar só bem em baixo */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="cofreSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={COFRE_BG} />
            <Stop offset="58%" stopColor={COFRE_BG} />
            <Stop offset="72%" stopColor="#F2FBFD" />
            <Stop offset="84%" stopColor="#B8EAF5" />
            <Stop offset="94%" stopColor="#2A9BB8" />
            <Stop offset="100%" stopColor="#0B5F7A" />
          </LinearGradient>
        </Defs>
        <Path d={`M0,0 H${width} V${height} H0 Z`} fill="url(#cofreSky)" />
      </Svg>

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.titulo}>
            {phase === 'done' ? 'Cofrinho guardado!' : 'Guardando a sua voz…'}
          </Text>

          <View style={styles.stage}>
            <Video
              key={phase === 'closing' || phase === 'done' ? 'close' : 'open'}
              ref={videoRef}
              source={source}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={shouldPlay}
              isLooping={false}
              isMuted
              useNativeControls={false}
              onPlaybackStatusUpdate={phase === 'closing' ? onCloseStatus : onOpenStatus}
            />

            {(phase === 'collecting' || phase === 'closing') && (
              <View style={styles.bubbleLayer} pointerEvents="none">
                {wordIds.map((id, i) => (
                  <WordBubbleFlyer
                    key={id}
                    wordId={id}
                    index={i}
                    total={wordIds.length}
                    fly={fly}
                    onLastArrived={onBubblesInside}
                  />
                ))}
              </View>
            )}
          </View>

          {phase === 'done' ? (
            <>
              <Text style={styles.dataTexto}>{data}</Text>
              <Text style={styles.legenda}>
                {`A voz de ${nome} de hoje ficará guardada para vocês compararem depois.`}
              </Text>
            </>
          ) : (
            <View style={styles.legendaPlaceholder} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function WordBubbleFlyer({
  wordId,
  index,
  total,
  fly,
  onLastArrived,
}: {
  wordId: string;
  index: number;
  total: number;
  fly: boolean;
  onLastArrived: () => void;
}) {
  const appear = useSharedValue(0);
  const progress = useSharedValue(0);
  const startX = (index - (total - 1) / 2) * (BUBBLE + 10);
  const startY = -CHEST_SIZE * 0.42;

  useEffect(() => {
    appear.value = withDelay(
      index * 70,
      withSpring(1, { damping: 12, stiffness: 160, mass: 0.7 })
    );
  }, [appear, index]);

  useEffect(() => {
    if (!fly) return;
    progress.value = withDelay(
      index * 140,
      withTiming(1, { duration: 620, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished && index === total - 1) {
          runOnJS(onLastArrived)();
        }
      })
    );
  }, [fly, index, onLastArrived, progress, total]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const fadeOut = p > 0.72 ? 1 - (p - 0.72) / 0.28 : 1;
    return {
      opacity: appear.value * fadeOut,
      transform: [
        { translateX: startX + (MOUTH.x - startX) * p },
        { translateY: startY + (MOUTH.y - startY) * p },
        { scale: appear.value * (1 - p * 0.82) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.flyer, style]}>
      <WordBubble wordId={wordId} size={BUBBLE} />
    </Animated.View>
  );
}

function WordBubble({ wordId, size }: { wordId: string; size: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 80 80" style={StyleSheet.absoluteFill}>
        <Circle cx={40} cy={40} r={36} fill={colors.estrela} opacity={0.35} />
        <Circle cx={40} cy={40} r={32} fill={colors.algaMedia} />
        <Circle
          cx={40}
          cy={40}
          r={32}
          fill="none"
          stroke={colors.turquesaClaro}
          strokeWidth={3}
          opacity={0.95}
        />
        <Ellipse
          cx={29}
          cy={27}
          rx={9}
          ry={6}
          fill="#FFFFFF"
          opacity={0.35}
          rotation={-30}
          originX={29}
          originY={27}
        />
      </Svg>
      <View style={styles.bubbleArt} pointerEvents="none">
        <WordArt wordId={wordId} size={size * 0.58} animated={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COFRE_BG },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 18,
    zIndex: 10,
  },
  titulo: {
    fontFamily: fontFamily.titulo,
    color: colors.coral,
    fontSize: 28,
    textAlign: 'center',
  },
  stage: {
    width: CHEST_SIZE,
    height: CHEST_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: COFRE_BG,
  },
  video: {
    width: CHEST_SIZE,
    height: CHEST_SIZE,
    backgroundColor: COFRE_BG,
  },
  bubbleLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  flyer: {
    position: 'absolute',
    width: BUBBLE,
    height: BUBBLE,
    marginLeft: -BUBBLE / 2,
    marginTop: -BUBBLE / 2,
    left: '50%',
    top: '50%',
  },
  bubbleArt: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTexto: {
    fontFamily: fontFamily.corpoExtra,
    color: colors.tinta,
    fontSize: 20,
  },
  legenda: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.algaMedia,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  legendaPlaceholder: { height: 72 },
});
