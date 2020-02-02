import * as THREE from "three";
import { View } from "react-native";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";

const colorBank = ["#574b90", "#f19066", "#C44569", "#546de5", "#F5CD79 "];

function Swarm({ count, color }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(state => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);

      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      // The following changes the size of the balls
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
        <meshPhongMaterial attach="material" color={color} />
      </instancedMesh>
    </>
  );
}

const Vis = ({ data }) => (
  <View style={{ width: "100%", height: "100%" }}>
    <Canvas
      gl={{ alpha: false, antialias: false, logarithmicDepthBuffer: true }}
      camera={{ fov: 75, position: [0, 0, 70] }}
      onCreated={({ gl }) => {
        gl.setClearColor("white");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputEncoding = THREE.sRGBEncoding;
      }}
    >
      <ambientLight intensity={1.1} />
      <pointLight position={[100, 100, 100]} intensity={1} />
      <pointLight position={[-100, -100, -100]} intensity={1} color="red" />

      {/* {data.map(({ emotion, magnitude }) => (
        <Swarm count={1} color={colorBank[emotion - 1]} />
      ))} */}
      <Swarm count={2} color={colorBank[0]} />
      {/* <Swarm count={5} color={colorBank[1]} />
        <Swarm count={5} color={colorBank[2]} />
        <Swarm count={5} color={colorBank[3]} />
        <Swarm count={5} color={colorBank[4]} /> */}
    </Canvas>
  </View>
);

export default Vis;
