import { type CSSProperties, type PointerEvent, type ReactElement, type WheelEvent, useEffect, useRef, useState } from 'react';
import { useEditorStateContext } from '../../hooks/use-editor-state';
import SceneRenderer from './webgl/scene-renderer';
import styles from './scene.module.css';
import { vec2 } from 'gl-matrix';
import useMeshFromModel from '../../hooks/use-mesh-from-model';
import teapot from '../../assets/models/teapot.obj';
import texture from '../../assets/textures/granite.png';
import { Loader } from '../../hooks/use-loader';

type Props = {
  style: CSSProperties
};

export default function Scene({ style }: Props): ReactElement {
  const [mesh] = useMeshFromModel(teapot);
  const [editorState, dispatch] = useEditorStateContext();
  const [pointerDown, setPointerDown] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRenderer>();

  const { vertexSource: vertexShaderSource, fragmentSource: fragmentShaderSource } = editorState.program;

  function updateProgram(vertexSource: string, fragmentSource: string): void {
    const errors = sceneRef.current?.loadProgram(vertexSource, fragmentSource);
    dispatch({
      action: 'set-errors',
      errors: errors || { vertexShaderErrors: [], fragmentShaderErrors: [], linkerErrors: [] },
    });
  }

  useEffect(() => {
    if (!canvasRef.current) throw new Error('Canvas ref is unexpectedly null!');
    if (sceneRef.current) return;

    const gl = canvasRef.current.getContext('webgl2');
    if (gl === null) throw new Error('Failed to create a webgl2 context.');

    const scene = new SceneRenderer(gl);
    updateProgram(vertexShaderSource, fragmentShaderSource);
    scene.loadTextureAsync(texture);
    scene.setRunning(true);

    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !Loader.isLoaded(mesh)) return;
    sceneRef.current.setMesh(mesh.value);
  }, [mesh]);

  useEffect(() => {
    updateProgram(vertexShaderSource, fragmentShaderSource);
  }, [vertexShaderSource, fragmentShaderSource]);

  function handleDrag(e: PointerEvent<HTMLCanvasElement>): void {
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

  function handleMouseWheel(e: WheelEvent<HTMLCanvasElement>): void {
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
      {Loader.loadingDidError(mesh) && <span className={styles.error}>Failed to load model :(</span>}
    </div>
  );
}
