import { Cylinder, Text, Line, Cone, Billboard } from "@react-three/drei";
import theme from "../styles/theme";
import { useMemo } from "react";
import * as THREE from "three";

type Rotation = [number, number, number];
const rot = (x: number, y: number, z: number): Rotation => [x, y, z];

const TOTAL_ANGLE = Math.PI * 0.7;
const SEGMENTS = 32;
const ARROW_SIZE = { radius: 0.03, height: 0.06, segments: 8 } as const;
const LABEL_OFFSET = 0.18;

const polar = (r: number, a: number) =>
  new THREE.Vector3(Math.cos(a), Math.sin(a), 0).multiplyScalar(r);

const RotationIndicator = ({
  color,
  radius = 0.25,
  rotation = rot(0, 0, 0),
}: {
  color: string;
  radius?: number;
  rotation?: Rotation;
}) => {
  const arcPoints = useMemo(() => {
    const step = TOTAL_ANGLE / SEGMENTS;
    return Array.from({ length: SEGMENTS + 1 }, (_, i) =>
      polar(radius, i * step)
    );
  }, [radius]);

  const arrowAngle = TOTAL_ANGLE;
  const arrowPos = polar(radius, arrowAngle);
  const arrowRot = rot(0, 0, arrowAngle + Math.PI / 2);

  const midAngle = TOTAL_ANGLE / 2;
  const labelPos = polar(radius * 0.6, midAngle);

  return (
    <group rotation={rotation}>
      <Line
        points={arcPoints}
        color={color}
        transparent
        opacity={0.85}
        lineWidth={2}
      />
      <group position={arrowPos} rotation={arrowRot}>
        <Cone
          args={[ARROW_SIZE.radius, ARROW_SIZE.height, ARROW_SIZE.segments]}
          rotation={rot(0, 0, -Math.PI / 2)}
        >
          <meshBasicMaterial attach="material" color={color} />
        </Cone>
      </group>
      <Billboard>
        <Text
          position={[labelPos.x, labelPos.y, labelPos.z]}
          fontSize={radius * 0.32}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          顺时针
        </Text>
      </Billboard>
    </group>
  );
};

export const AxisHelper = ({
  position = rot(2, 2, 2),
}: {
  position?: Rotation;
}) => {
  const axes = useMemo(
    () => [
      {
        label: "X",
        color: theme.accent || "#ff1744",
        tip: rot(1, 0, 0),
        axisRotation: rot(0, 0, Math.PI / 2),
        arcRotation: rot(0, -Math.PI / 2, 0),
        anchorX: "left" as "left",
        anchorY: "middle" as "middle",
      },
      {
        label: "Y",
        color: theme.primary || "#00e676",
        tip: rot(0, 1, 0),
        axisRotation: rot(0, 0, 0),
        arcRotation: rot(Math.PI / 2, 0, 0),
        anchorX: "center" as "center",
        anchorY: "bottom" as "bottom",
      },
      {
        label: "Z",
        color: theme.textSecondary || "#2979ff",
        tip: rot(0, 0, 1),
        axisRotation: rot(Math.PI / 2, 0, 0),
        arcRotation: rot(0, 0, Math.PI),
        anchorX: "center" as "center",
        anchorY: "bottom" as "bottom",
      },
    ],
    []
  );

  return (
    <group position={position}>
      {axes.map(
        ({
          label,
          color,
          tip,
          axisRotation,
          arcRotation,
          anchorX,
          anchorY,
        }) => {
          const axisHalf = tip.map((v) => v * 0.5) as Rotation;
          const labelPos = tip.map(
            (v) => v + LABEL_OFFSET * Math.sign(v)
          ) as Rotation;
          return (
            <group key={label}>
              <Cylinder
                args={[0.01, 0.01, 1, 16]}
                position={axisHalf}
                rotation={axisRotation}
              >
                <meshBasicMaterial attach="material" color={color} />
              </Cylinder>
              <Billboard position={labelPos}>
                <Text
                  fontSize={0.15}
                  color={color}
                  anchorX={anchorX}
                  anchorY={anchorY}
                >
                  {label}
                </Text>
              </Billboard>
              <group position={tip}>
                <RotationIndicator color={color} rotation={arcRotation} />
              </group>
            </group>
          );
        }
      )}
    </group>
  );
};
