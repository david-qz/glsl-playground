import { createContext, Dispatch, useContext, useReducer } from 'react';
import { ShaderType, type ProgramCompilationErrors } from '../components/scene/webgl/shaders';
import { ProgramData } from '../../common/api-types';

export type EditorState = {
  program: ProgramData,
  originalProgram: ProgramData,
  isNewProgram: boolean,
  activeTab: ShaderType,
  errors: ProgramCompilationErrors,
  vertexShaderHasErrors: boolean,
  fragmentShaderHasErrors: boolean,
  linkerHasErrors: boolean
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

type EditorAction =
  | EditorActionLoadProgram
  | EditorActionRevert
  | EditorStateSetTitle
  | EditorStateSetActiveTab
  | EditorActionSetSources
  | EditorActionSetErrors;

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
    case 'load-program':
      return {
        ...state,
        program: action.program,
        originalProgram: action.program,
        isNewProgram: action.program.id === 'new'
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
      const errors = action.errors;

      const vertexShaderHasErrors = errors.vertexShaderErrors.length !== 0;
      const fragmentShaderHasErrors = errors.fragmentShaderErrors.length !== 0;
      const linkerHasErrors = errors.linkerErrors.length !== 0;

      const didCompile = !vertexShaderHasErrors && !fragmentShaderHasErrors && !linkerHasErrors;

      return {
        ...state,
        program: {
          ...state.program,
          didCompile
        },
        errors: action.errors,
        vertexShaderHasErrors,
        fragmentShaderHasErrors,
        linkerHasErrors
      };
    }
  }
}

type EditorContextValue = [EditorState, Dispatch<EditorAction>];

export const EditorContext = createContext<EditorContextValue>([createInitialState(), () => {}]);

export function useEditorState(): [...EditorContextValue, typeof EditorContext.Provider] {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, createInitialState());
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
    isNewProgram: true,
    activeTab: ShaderType.Vertex,
    errors: {
      vertexShaderErrors: [],
      fragmentShaderErrors: [],
      linkerErrors: [],
    },
    vertexShaderHasErrors: false,
    fragmentShaderHasErrors: false,
    linkerHasErrors: false
  };
}
