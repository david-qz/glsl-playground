import { useCreateEditorState } from '../../hooks/editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';
import ProgramTitle from '../program-title/program-title';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth-context';
import Toolbar, { ToolbarLeftGroup, ToolbarRightGroup } from '../toolbar/toolbar';
import TabBar, { Tab } from '../tabs/tabs';
import { ShaderType } from '../scene/webgl/shaders';
import SaveIcon from '@mui/icons-material/Save';
import * as ProgramsService from '../../services/programs-service';
import { ReactElement } from 'react';

export default function Editor(): ReactElement {
  const navigate = useNavigate();
  const [user] = useAuthContext();
  const { id: programId } = useParams();
  const [editorState, dispatch, EditorContextProvider] = useCreateEditorState(programId, user?.id);

  async function handleSave() {
    const localProgram = editorState.program;

    if (user && localProgram.userId === user.id) {
      const program = localProgram.id === 'new'
        ? await ProgramsService.create(localProgram)
        : await ProgramsService.update(localProgram);

      if (!program) {
        // FIXME: Somehow let the user know this happened so they don't think their changes are safe.
        console.error('Program failed to save!');
        return;
      }

      dispatch({ action: 'set-program', program });

      if (localProgram.id === 'new') {
        navigate('/program/' + program.id, { replace: true });
      }
    } else {
      // TODO: let anonymous users save their programs by going through the auth flow.
    }
  }

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
            <button onClick={handleSave}>
              <SaveIcon />
            </button>
          </ToolbarRightGroup>
        </Toolbar>
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}
