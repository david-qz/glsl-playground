import { useCreateEditorState } from '../../hooks/editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';

export default function Editor() {
  const [state, dispatch, EditorContextProvider] = useCreateEditorState();

  return (
    <EditorContextProvider value={[state, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }} />
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}
