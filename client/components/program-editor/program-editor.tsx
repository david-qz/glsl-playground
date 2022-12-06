import { type IAnnotation, type IMarker } from 'react-ace';
import { type CSSProperties, ReactElement } from 'react';
import styles from './program-editor.module.css';
import { EditorState, useEditorStateContext } from '../../hooks/editor-state';
import { ShaderType } from '../scene/webgl/shaders';
import GLSLEditor from './glsl-editor';

type Props = {
  style?: CSSProperties
};

export default function ProgramEditor({ style }: Props): ReactElement {
  const [editorState, dispatch] = useEditorStateContext();

  const [markers, annotations] = collectAnnotationsAndMarkers(editorState);

  const linkerHasErrors = editorState.errors.linkerErrors.length !== 0;
  const combinedLinkerErrorMessage = editorState.errors.linkerErrors.map(error => error.message).join('\n');

  return (
    <div className={styles.editor} style={style} >
      <GLSLEditor
        source={editorState.program.vertexSource}
        onChange={source => dispatch({ action: 'set-sources', vertexSource: source })}
        active={editorState.activeTab === ShaderType.Vertex}
        annotations={editorState.activeTab === ShaderType.Vertex ? annotations : []}
        markers={editorState.activeTab === ShaderType.Vertex ? markers : []}
      />
      <GLSLEditor
        source={editorState.program.fragmentSource}
        onChange={source => dispatch({ action: 'set-sources', fragmentSource: source })}
        active={editorState.activeTab === ShaderType.Fragment}
        annotations={editorState.activeTab === ShaderType.Fragment ? annotations : []}
        markers={editorState.activeTab === ShaderType.Fragment ? markers : []}
      />
      {
        linkerHasErrors
        && <div className={styles.errorOverlay}>LINKER: {combinedLinkerErrorMessage}</div>
      }
    </div>
  );
}

function collectAnnotationsAndMarkers(editorState: EditorState): [Array<IMarker>, Array<IAnnotation>] {
  const activeTab = editorState.activeTab;

  const source = activeTab === ShaderType.Vertex
    ? editorState.program.vertexSource
    : editorState.program.fragmentSource;
  const compilationErrors = activeTab === ShaderType.Vertex
    ? editorState.errors.vertexShaderErrors
    : editorState.errors.fragmentShaderErrors;

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
