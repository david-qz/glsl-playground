import AceEditor from 'react-ace';
import 'ace-builds/src-min-noconflict/mode-glsl';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import { type CSSProperties, useState, ReactElement } from 'react';
import styles from './editor.module.css';
import { classes } from '../../utils/style-utils';

enum ShaderType {
  Vertex = 'vertex-shader',
  Fragment = 'fragment-shader'
}

type Props = {
  style?: CSSProperties
};

export default function Editor({ style }: Props): ReactElement {
  const [vertexSource, setVertexSource] = useState<string>(exampleVertexShader);
  const [fragmentSource, setFragmentSource] = useState<string>(exampleFragmentShader);
  const [activeTab, setActiveTab] = useState<ShaderType>(ShaderType.Vertex);

  return (
    <div className={styles.editor} style={style} >
      <div className={styles.tabBar}>
        <div
          className={classes(styles.tab, activeTab === ShaderType.Vertex && styles.active)}
          onClick={() => setActiveTab(ShaderType.Vertex)}
        >
          Vertex
        </div>
        <div
          className={classes(styles.tab, activeTab === ShaderType.Fragment && styles.active)}
          onClick={() => setActiveTab(ShaderType.Fragment)}
        >
          Fragment
        </div>
      </div>
      <AceEditor
        style={{ display: activeTab === ShaderType.Vertex ? 'initial' : 'none' }}
        value={vertexSource}
        onChange={setVertexSource}
        focus={activeTab === ShaderType.Vertex}
        width='100%'
        height='100%'
        mode="glsl"
        theme="tomorrow_night_eighties"
        tabSize={2}
        editorProps={{ $blockScrolling: true }}
        enableLiveAutocompletion={true}
        setOptions={{ fontFamily: 'IBM Plex Mono' }}
      />
      <AceEditor
        style={{ display: activeTab === ShaderType.Fragment ? 'initial' : 'none' }}
        value={fragmentSource}
        onChange={setFragmentSource}
        focus={activeTab === ShaderType.Fragment}
        width='100%'
        height='100%'
        mode="glsl"
        theme="tomorrow_night_eighties"
        tabSize={2}
        editorProps={{ $blockScrolling: true }}
        enableLiveAutocompletion={true}
        setOptions={{ fontFamily: 'IBM Plex Mono' }}
      />
    </div>
  );
}

const exampleFragmentShader =
`precision highp float;

varying vec3 vNormal;

void main() {
  const float ambientIntensity = 0.1;
  const vec3 materialColor = vec3(1.0, 1.0, 1.0);

  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float intensity = max(dot(normal, lightDirection), ambientIntensity);

  gl_FragColor = vec4(materialColor * intensity, 1.0);
}
`;

const exampleVertexShader =
`attribute vec4 aVertexPosition;
attribute vec4 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;

void main() {
  vNormal = (uNormalMatrix * aVertexNormal).xyz;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;
