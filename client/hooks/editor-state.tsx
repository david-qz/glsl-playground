import { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';
import { exampleFragmentShader, exampleVertexShader } from '../utils/example-shaders';
import { ShaderType, type ProgramCompilationErrors } from '../components/scene/webgl/shaders';
import { ProgramData } from '../../common/api-types';
import * as ProgramsService from '../services/programs-service';
import { useAuthContext } from './auth-context';

export type EditorState = {
  program: ProgramData,
  originalProgram: ProgramData,
  activeTab: ShaderType,
  errors: ProgramCompilationErrors,
  loading: boolean,
};

type EditorActionLoadProgram = {
  action: 'load-program',
  program: ProgramData
};
type EditorActionRevert = {
  action: 'revert'
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
  | EditorActionLoadProgram
  | EditorActionRevert
  | EditorStateSetTitle
  | EditorStateSetActiveTab
  | EditorActionSetSources
  | EditorActionSetErrors
  | EditorStateSetLoading;

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
    case 'load-program':
      return {
        ...state,
        program: action.program,
        originalProgram: action.program,
        loading: false
      };
    case 'revert':
      return {
        ...state,
        program: { ...state.originalProgram }
      };
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
    case 'set-errors': {
      const didCompile = action.errors.vertexShaderErrors.length === 0
       && action.errors.fragmentShaderErrors.length === 0
       && action.errors.linkerErrors.length === 0;

      return {
        ...state,
        program: {
          ...state.program,
          didCompile
        },
        errors: action.errors
      };
    }
    case 'set-loading':
      return { ...state, loading: action.loading };
  }
}

type EditorContextValue = [EditorState, Dispatch<EditorAction>];

// FIXME: This context is adding complexity without any upside right now. If this is still the case after the editor
//        is built a bit, we should remove this.
export const EditorContext = createContext<EditorContextValue>([createInitialState(), () => {}]);

export function useCreateEditorState(programId: string): [...EditorContextValue, typeof EditorContext.Provider] {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, createInitialState());
  const { userId } = useAuthContext();

  useEffect(() => {
    if (programId === 'new') {
      dispatch({ action: 'load-program', program: createNewProgram(programId, userId) });
    } else {
      (async () => {
        const program = await ProgramsService.getById(programId);
        if (!program) return;
        dispatch({ action: 'load-program', program });
      })();
    }
  }, [programId]);

  return [state, dispatch, EditorContext.Provider];
}

export function useEditorStateContext(): EditorContextValue {
  return useContext(EditorContext);
}

function createInitialState(): EditorState {
  const blankProgram = {
    id: '',
    userId: '',
    title: '',
    vertexSource: '',
    fragmentSource: '',
    didCompile: false,
    createdAt: '',
    modifiedAt: ''
  };
  return {
    program: blankProgram,
    originalProgram: blankProgram,
    activeTab: ShaderType.Vertex,
    errors: {
      vertexShaderErrors: [],
      fragmentShaderErrors: [],
      linkerErrors: [],
    },
    loading: true
  };
}

function createNewProgram(programId: string, userId: string): ProgramData {
  return {
    id: programId,
    userId,
    title: 'Untitled Program',
    vertexSource: exampleVertexShader,
    fragmentSource: exampleFragmentShader,
    didCompile: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
