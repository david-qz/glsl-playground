import { useCreateEditorState } from '../../hooks/editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';
import Title from '../title/title';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth-context';

export default function Editor() {
  const [user] = useAuthContext();
  const { id: programId } = useParams();
  const [editorState, dispatch, EditorContextProvider] = useCreateEditorState(programId);

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
