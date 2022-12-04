import { useCreateEditorState } from '../../hooks/editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';
import Title from '../title/title';

export default function Editor() {
  const [editorState, dispatch, EditorContextProvider] = useCreateEditorState();

  return (
    <EditorContextProvider value={[editorState, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }}>
          <Title title={editorState.program.title} onChange={(title) => {dispatch({ action: 'set-title', title });}} />
        </Header>
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}
