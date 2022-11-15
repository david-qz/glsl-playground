import { useCreateEditorState } from '../../../hooks/editor-state';
import Editor from '../../editor/editor';
import Header from '../../header/header';
import Scene from '../../scene/scene';
import styles from './editor-view.module.css';

export default function EditorView() {
  const [state, dispatch, EditorContextProvider] = useCreateEditorState();

  return (
    <EditorContextProvider value={[state, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }} />
        <Editor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}
