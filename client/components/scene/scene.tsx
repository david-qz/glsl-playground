import { CSSProperties, ReactElement, useEffect, useRef } from 'react';
import { useEditorStateContext } from '../../hooks/editor-state';
import Mesh from './webgl/mesh';
import SceneRenderer from './webgl/scene-renderer';

type Props = {
  style: CSSProperties
};

export default function Scene({ style }: Props): ReactElement {
  const [state, dispatch] = useEditorStateContext();
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

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', ...style }} />;
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
