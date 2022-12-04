import { useCreateEditorState } from '../../hooks/editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';
import ProgramTitle from '../program-title/program-title';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth-context';
import Toolbar, { ToolbarLeftGroup, ToolbarRightGroup } from '../toolbar/toolbar';
import TabBar, { Tab } from '../tabs/tabs';
import { ShaderType } from '../scene/webgl/shaders';

export default function Editor() {
  const [user] = useAuthContext();
  const { id: programId } = useParams();
  const [editorState, dispatch, EditorContextProvider] = useCreateEditorState(programId);

  const vertexShaderHasErrors = editorState.errors.vertexShaderErrors.length !== 0;
  const fragmentShaderHasErrors = editorState.errors.fragmentShaderErrors.length !== 0;
  const linkerHasErrors = editorState.errors.linkerErrors.length !== 0;

  return (
    <EditorContextProvider value={[editorState, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }}>
          <ProgramTitle title={editorState.program.title} onChange={(title) => dispatch({ action: 'set-title', title })} />
        </Header>
        <Toolbar style={{ gridArea: 'toolbar' }}>
          <ToolbarLeftGroup>
            <TabBar>
              <Tab
                title='program.vert'
                active={editorState.activeTab === ShaderType.Vertex}
                error={vertexShaderHasErrors || linkerHasErrors}
                onClick={() => dispatch({ action: 'set-tab', tab: ShaderType.Vertex })}
              />
              <Tab
                title='program.frag'
                active={editorState.activeTab === ShaderType.Fragment}
                error={fragmentShaderHasErrors || linkerHasErrors}
                onClick={() => dispatch({ action: 'set-tab', tab: ShaderType.Fragment })}
              />
            </TabBar>
          </ToolbarLeftGroup>
          <ToolbarRightGroup>
            RIGHT
          </ToolbarRightGroup>
        </Toolbar>
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}
