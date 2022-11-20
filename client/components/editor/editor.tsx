import AceEditor from 'react-ace';
import 'ace-builds/src-min-noconflict/mode-glsl';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import { type CSSProperties, useState, ReactElement } from 'react';
import styles from './editor.module.css';
import { classes } from '../../utils/style-utils';
import { useEditorStateContext } from '../../hooks/editor-state';
import { ShaderType } from '../scene/webgl/shaders';

type Props = {
  style?: CSSProperties
};

export default function Editor({ style }: Props): ReactElement {
  const [state, dispatch] = useEditorStateContext();
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
        value={state.vertexSource}
        onChange={(source) => dispatch({ action: 'set-sources', vertexSource: source })}
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
        value={state.fragmentSource}
        onChange={(source) => dispatch({ action: 'set-sources', fragmentSource: source })}
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
