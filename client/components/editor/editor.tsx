import { useEditorState } from '../../hooks/editor-state';
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
import RestorePageIcon from '@mui/icons-material/RestorePage';
import * as ProgramsService from '../../services/programs-service';
import { ReactElement, useEffect } from 'react';
import IconButton from '../form-controls/icon-button';
import { exampleVertexShader, exampleFragmentShader } from '../../utils/example-shaders';
import { ProgramData } from '../../../common/api-types';

export default function Editor(): ReactElement {
  const { user, userId } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();
  const programId = params.id || 'new';

  const [editorState, dispatch, EditorContextProvider] = useEditorState();

  useEffect(() => {
    if (programId === 'new') {
      const newProgram = createNewProgram(programId, userId);
      dispatch({ action: 'load-program', program: newProgram });
    } else {
      (async () => {
        const program = await ProgramsService.getById(programId);
        if (!program) return;
        dispatch({ action: 'load-program', program });
      })();
    }
  }, [programId, userId]);

  const isOwnProgram = editorState.isNewProgram || (!!user && user.id === editorState.program.userId);

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

      dispatch({ action: 'load-program', program });

      if (localProgram.id === 'new') {
        navigate('/program/' + program.id, { replace: true });
      }
    } else {
      // TODO: let anonymous users save their programs by going through the auth flow.
    }
  }

  function handleRevert() {
    dispatch({ action: 'revert' });
  }

  return (
    <EditorContextProvider value={[editorState, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }}>
          <ProgramTitle
            editable={isOwnProgram}
            title={editorState.program.title}
            onChange={(title) => dispatch({ action: 'set-title', title })}
          />
        </Header>
        <Toolbar style={{ gridArea: 'toolbar' }}>
          <ToolbarLeftGroup>
            <TabBar>
              <Tab
                title='program.vert'
                active={editorState.activeTab === ShaderType.Vertex}
                error={editorState.vertexShaderHasErrors || editorState.linkerHasErrors}
                onClick={() => dispatch({ action: 'set-tab', tab: ShaderType.Vertex })}
              />
              <Tab
                title='program.frag'
                active={editorState.activeTab === ShaderType.Fragment}
                error={editorState.fragmentShaderHasErrors || editorState.linkerHasErrors}
                onClick={() => dispatch({ action: 'set-tab', tab: ShaderType.Fragment })}
              />
            </TabBar>
          </ToolbarLeftGroup>
          <ToolbarRightGroup className={styles.buttonGroup}>
            <IconButton onClick={handleRevert}>
              <RestorePageIcon />
            </IconButton>
            {isOwnProgram && (
              <IconButton onClick={handleSave}>
                <SaveIcon />
              </IconButton>
            )}
          </ToolbarRightGroup>
        </Toolbar>
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </div>
    </EditorContextProvider>
  );
}

function createNewProgram(programId: string, userId: string): ProgramData {
  return {
    id: programId,
    userId,
    title: 'New Program',
    vertexSource: exampleVertexShader,
    fragmentSource: exampleFragmentShader,
    didCompile: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
