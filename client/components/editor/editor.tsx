import { useEditorState } from '../../hooks/use-editor-state';
import ProgramEditor from '../program-editor/program-editor';
import Header from '../header/header';
import Scene from '../scene/scene';
import styles from './editor.module.css';
import ProgramTitle from '../program-title/program-title';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import Toolbar, { ToolbarLeftGroup, ToolbarRightGroup } from '../toolbar/toolbar';
import TabBar, { Tab } from '../tabs/tabs';
import { ShaderType } from '../scene/webgl/shaders';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import * as ProgramsService from '../../services/programs-service';
import type { ReactElement } from 'react';
import IconButton from '../form-controls/icon-button';
import { createNewProgram } from '../../utils/new-program';
import NotFound from '../not-found/not-found';
import type { ProgramData } from '../../../common/api-types';
import useLoader from '../../hooks/use-loader';
import { isLoaded, isLoading, loadingDidError } from '../../../common/loading';

export default function Editor(): ReactElement {
  const { user, userId } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();
  const programId = params.id || 'new';

  const [editorState, dispatch, EditorContextProvider] = useEditorState();

  const [program] = useLoader<ProgramData>(async () => {
    let program: ProgramData | undefined;

    if (programId === 'new') {
      program = createNewProgram(programId, userId);
    } else {
      // If we aren't creating a new program, go fetch it.
      const fetchedProgram = await ProgramsService.getById(programId);
      if (!fetchedProgram) return new Error(`Failed to fetch program id=${programId}`);
      program = fetchedProgram;
    }

    dispatch({ action: 'load-program', program: program });
    return program;
  }, [programId]);

  const isOwnProgram = editorState.isNewProgram || (!!user && user.id === editorState.program.userId);

  async function handleSave(): Promise<void> {
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
      window.sessionStorage.setItem('programToSave', JSON.stringify(editorState.program));
      navigate('/auth?redirect=/save-program');
    }
  }

  function handleRevert(): void {
    dispatch({ action: 'revert' });
  }

  let content: ReactElement = <></>;
  if (isLoaded(program)) {
    content = (
      <>
        <Toolbar style={{ gridArea: 'toolbar' }}>
          <ToolbarLeftGroup className={styles.toolBarLeft}>
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
            <div className={styles.buttonGroup}>
              {editorState.programHasUnsavedChanges && <IconButton onClick={handleRevert}>
                <RestoreIcon />
              </IconButton>}
              {isOwnProgram && (
                <IconButton onClick={handleSave} disabled={!editorState.programHasUnsavedChanges && !editorState.isNewProgram}>
                  <SaveIcon />
                </IconButton>
              )}
            </div>
          </ToolbarLeftGroup>
          <ToolbarRightGroup>
          </ToolbarRightGroup>
        </Toolbar>
        <ProgramEditor style={{ gridArea: 'editor' }} />
        <Scene style={{ gridArea: 'scene' }} />
      </>
    );
  } else if (isLoading(program)) {
    content = <></>;
  } else if (loadingDidError(program)) {
    content = <NotFound className={styles.contentArea} />;
  }

  return (
    <EditorContextProvider value={[editorState, dispatch]}>
      <div className={styles.layout}>
        <Header style={{ gridArea: 'header' }}>
          {isLoaded(program) && (
            <ProgramTitle
              editable={isOwnProgram}
              unsavedChanges={editorState.programHasUnsavedChanges}
              title={editorState.program.title}
              onChange={(title) => dispatch({ action: 'set-title', title })}
            />
          )}
        </Header>
        {content}
      </div>
    </EditorContextProvider>
  );
}
