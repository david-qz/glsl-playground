import { CSSProperties, PointerEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useEditorStateContext } from '../../hooks/editor-state';
import Mesh from './webgl/mesh';
import SceneRenderer from './webgl/scene-renderer';
import styles from './scene.module.css';
import { vec2 } from 'gl-matrix';

type Props = {
  style: CSSProperties
};

export default function Scene({ style }: Props): ReactElement {
  const [state, dispatch] = useEditorStateContext();
  const [pointerDown, setPointerDown] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRenderer>();

  function updateProgram(vertexSource: string, fragmentSource: string): void {
    const errors = sceneRef.current?.loadProgram(vertexSource, fragmentSource);
    dispatch({
      action: 'set-errors',
      errors: errors || { vertexShaderErrors:[], fragmentShaderErrors: [], linkerErrors: [] }
    });
  }

  useEffect(() => {
    if (!canvasRef.current) throw new Error('Canvas ref is unexpectedly null!');

    const gl = canvasRef.current.getContext('webgl2');
    if (gl === null) throw new Error('Failed to create a webgl2 context.');

    const scene = new SceneRenderer(gl);
    const mesh = new Mesh(vertexData, 36);
    scene.setMesh(mesh);
    updateProgram(state.vertexSource, state.fragmentSource);
    scene.setRunning(true);

    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    updateProgram(state.vertexSource, state.fragmentSource);
  }, [state.vertexSource, state.fragmentSource]);

  function handleDrag(e: PointerEvent<HTMLCanvasElement>) {
    if (!pointerDown) return;
    if (!sceneRef.current || !canvasRef.current) return;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;

    const referenceDimension = Math.min(canvas.clientHeight, canvas.clientWidth);
    const dx = (e.movementY / referenceDimension) * Math.PI;
    const dy = (e.movementX / referenceDimension) * Math.PI;
    const deltaRotation = vec2.fromValues(dx, dy);

    const rotation = scene.getEulerAngles();
    vec2.add(rotation, rotation, deltaRotation);
    scene.setEulerAngles(rotation);
  }

  return (
    <div className={styles.canvasContainer} style={style}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerDown={() => setPointerDown(true)}
        onPointerUp={() => setPointerDown(false)}
        onPointerMove={(e) => handleDrag(e)}
        onPointerLeave={() => setPointerDown(false)}
      />
    </div>
  );
}

const vertexData = new Float32Array([
  // Front face
  -1.0, -1.0, 1.0, 0.0, 0.0, 1.0,
  1.0, 1.0, 1.0, 0.0, 0.0, 1.0,
  -1.0, 1.0, 1.0, 0.0, 0.0, 1.0,
  -1.0, -1.0, 1.0, 0.0, 0.0, 1.0,
  1.0, -1.0, 1.0, 0.0, 0.0, 1.0,
  1.0, 1.0, 1.0, 0.0, 0.0, 1.0,

  // Back face
  1.0, -1.0, -1.0, 0.0, 0.0, -1.0,
  -1.0, 1.0, -1.0, 0.0, 0.0, -1.0,
  1.0, 1.0, -1.0, 0.0, 0.0, -1.0,
  1.0, -1.0, -1.0, 0.0, 0.0, -1.0,
  -1.0, -1.0, -1.0, 0.0, 0.0, -1.0,
  -1.0, 1.0, -1.0, 0.0, 0.0, -1.0,

  // Right face
  1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
  1.0, 1.0, -1.0, 1.0, 0.0, 0.0,
  1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
  1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
  1.0, -1.0, -1.0, 1.0, 0.0, 0.0,
  1.0, 1.0, -1.0, 1.0, 0.0, 0.0,

  // Left face
  -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
  -1.0, -1.0, -1.0, -1.0, 0.0, 0.0,
  -1.0, -1.0, 1.0, -1.0, 0.0, 0.0,
  -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
  -1.0, 1.0, -1.0, -1.0, 0.0, 0.0,
  -1.0, -1.0, -1.0, -1.0, 0.0, 0.0,

  // Top face
  -1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
  1.0, 1.0, -1.0, 0.0, 1.0, 0.0,
  -1.0, 1.0, -1.0, 0.0, 1.0, 0.0,
  -1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
  1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
  1.0, 1.0, -1.0, 0.0, 1.0, 0.0,

  // Bottom face
  -1.0, -1.0, -1.0, 0.0, -1.0, 0.0,
  1.0, -1.0, 1.0, 0.0, -1.0, 0.0,
  -1.0, -1.0, 1.0, 0.0, -1.0, 0.0,
  -1.0, -1.0, -1.0, 0.0, -1.0, 0.0,
  1.0, -1.0, -1.0, 0.0, -1.0, 0.0,
  1.0, -1.0, 1.0, 0.0, -1.0, 0.0,
]);
