import { CSSProperties, PointerEvent, WheelEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useEditorStateContext } from '../../hooks/editor-state';
import SceneRenderer from './webgl/scene-renderer';
import styles from './scene.module.css';
import { vec2 } from 'gl-matrix';
import useMeshFromModel from '../../hooks/use-model';

type Props = {
  style: CSSProperties
};

export default function Scene({ style }: Props): ReactElement {
  const meshState = useMeshFromModel('/models/smooth-teapot.obj');
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
    updateProgram(state.vertexSource, state.fragmentSource);
    scene.setRunning(true);

    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (meshState.mesh) {
      scene.setMesh(meshState.mesh);
    }
  }, [meshState]);

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

  function handleMouseWheel(e: WheelEvent<HTMLCanvasElement>) {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const distance = scene.getCameraDistance();
    scene.setCameraDistance(distance + (distance / e.deltaY) * 20);
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
        onWheel={(e) => handleMouseWheel(e)}
      />
      {meshState.error && <span className={styles.error}>Failed to load model :(</span>}
    </div>
  );
}
