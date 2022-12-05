import { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';
import { exampleFragmentShader, exampleVertexShader } from '../utils/example-shaders';
import { ShaderType, type ProgramCompilationErrors } from '../components/scene/webgl/shaders';
import { ProgramData } from '../../common/api-types';

export type EditorState = {
  program: ProgramData,
  activeTab: ShaderType,
  errors: ProgramCompilationErrors
  loading: boolean
};

type EditorActionSetProgram = {
  action: 'set-program',
  program: ProgramData
};
type EditorStateSetTitle = {
  action: 'set-title',
  title: string
};
type EditorStateSetActiveTab = {
  action: 'set-tab',
  tab: ShaderType
};
type EditorActionSetSources = {
  action: 'set-sources',
  vertexSource?: string,
  fragmentSource?: string
};
type EditorActionSetErrors = {
  action: 'set-errors',
  errors: ProgramCompilationErrors
};
type EditorStateSetLoading = {
  action: 'set-loading',
  loading: boolean
};

type EditorAction =
  | EditorActionSetProgram
  | EditorStateSetTitle
  | EditorStateSetActiveTab
  | EditorActionSetSources
  | EditorActionSetErrors
  | EditorStateSetLoading;

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
    case 'set-program':
      return { ...state, program: action.program };
    case 'set-title':
      return {
        ...state,
        program: {
          ...state.program,
          title: action.title
        }
      };
    case 'set-tab':
      return {
        ...state,
        activeTab: action.tab
      };
    case 'set-sources':
      return {
        ...state,
        program: {
          ...state.program,
          vertexSource: action.vertexSource || state.program.vertexSource,
          fragmentSource: action.fragmentSource || state.program.fragmentSource
        }
      };
    case 'set-errors':
      return { ...state, errors: action.errors };
    case 'set-loading':
      return { ...state, loading: action.loading };
  }
}

function createInitialState(programId: string | undefined, userId: string | undefined): EditorState {
  return {
    program: {
      id: programId || 'new',
      userId: userId || 'anon',
      title: programId ? '' : 'Untitled Program',
      vertexSource: programId ? '' : exampleVertexShader,
      fragmentSource: programId ? '' : exampleFragmentShader,
      didCompile: true,
      createdAt: Date.now().toString(),
      modifiedAt: Date.now().toString()
    },
    activeTab: ShaderType.Vertex,
    errors: {
      vertexShaderErrors: [],
      fragmentShaderErrors: [],
      linkerErrors: [],
    },
    loading: !!programId
  };
}

type EditorContextValue = [EditorState, Dispatch<EditorAction>];

// FIXME: This context is adding complexity without any upside right now. If this is still the case after the editor
//        is built a bit, we should remove this.
export const EditorContext = createContext<EditorContextValue>([createInitialState(undefined, undefined), () => {}]);

export function useCreateEditorState(programId: string | undefined, userId: string | undefined): [...EditorContextValue, typeof EditorContext.Provider] {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, createInitialState(programId, userId));

  useEffect(() => {
    if (!programId) return;
    (async () => {
      const response = await fetch('/api/v1/programs/' + programId);
      const program = await response.json() as ProgramData;
      dispatch({ action: 'set-program', program });
      dispatch({ action: 'set-loading', loading: false });
    })();
  }, [programId]);

  return [state, dispatch, EditorContext.Provider];
}

export function useEditorStateContext(): EditorContextValue {
  return useContext(EditorContext);
}
