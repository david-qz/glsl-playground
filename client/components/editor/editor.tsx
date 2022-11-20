import AceEditor, { type IAnnotation, type IMarker } from 'react-ace';
import 'ace-builds/src-min-noconflict/mode-glsl';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import { type CSSProperties, useState, ReactElement } from 'react';
import styles from './editor.module.css';
import { classes } from '../../utils/style-utils';
import { EditorState, useEditorStateContext } from '../../hooks/editor-state';
import { ShaderType } from '../scene/webgl/shaders';

type Props = {
  style?: CSSProperties
};

export default function Editor({ style }: Props): ReactElement {
  const [state, dispatch] = useEditorStateContext();
  const [activeTab, setActiveTab] = useState<ShaderType>(ShaderType.Vertex);

  const [markers, annotations] = collectAnnotationsAndMarkers(state, activeTab);

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
        annotations={activeTab === ShaderType.Vertex ? annotations : undefined}
        markers={activeTab === ShaderType.Vertex ? markers : undefined}
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
        annotations={activeTab === ShaderType.Fragment ? annotations : undefined}
        markers={activeTab === ShaderType.Fragment ? markers : undefined}
      />
    </div>
  );
}

function collectAnnotationsAndMarkers(state: EditorState, activeTab: ShaderType): [Array<IMarker>, Array<IAnnotation>] {
  const source = activeTab === ShaderType.Vertex
    ? state.vertexSource
    : state.fragmentSource;
  const compilationErrors = activeTab === ShaderType.Vertex
    ? state.errors.vertexShaderErrors
    : state.errors.fragmentShaderErrors;

  const markers = new Map<number, IMarker>();
  const annotations = new Map<number, IAnnotation>();

  for (const error of compilationErrors) {
    const rowNumber = error.lineNumber - 1; // Ace uses zero-based indices for its rows.

    // Add a marker on this line if one doesn't already exist.
    if (!markers.has(rowNumber)) {
      const span = getFullLineSpan(source, rowNumber);
      if (span) {
        markers.set(rowNumber, {
          startRow: rowNumber,
          startCol: span[0],
          endRow: rowNumber,
          endCol: span[1],
          className: styles.errorMarker,
          type: 'text'
        });
      }
    }

    // Add an annotation for this line or fold this error into the existing annotation.
    if (!annotations.has(rowNumber)) {
      annotations.set(rowNumber, { row: rowNumber, column: 0, type: 'error', text: error.message });
    } else {
      const annotation = annotations.get(rowNumber)!;
      annotation.text += '\n' + error.message;
    }
  }

  return [[...markers.values()], [...annotations.values()]];
}

function getFullLineSpan(source: string, rowNumber: number): [number, number] | undefined {
  const line = source.split('\n')[rowNumber];
  if (!line) return;

  const match = /\s*(.*)\s*/d.exec(line);
  if (!match) return;

  // I don't know why typescript doesn't know about the indices property...
  return (match as any).indices[1];
}
