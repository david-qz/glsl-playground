import { createContext, Dispatch, useContext, useReducer } from 'react';
import { exampleFragmentShader, exampleVertexShader } from '../utils/example-shaders';
import { type ProgramCompilationErrors } from '../components/scene/webgl/shaders';
import { ProgramData } from '../../common/api-types';

export type EditorState = {
  program: ProgramData
  errors: ProgramCompilationErrors
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

type EditorAction = EditorActionSetSources | EditorActionSetErrors;

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
    case 'set-sources':
      return {
        ...state,
        program: {
          ...state.program,
          vertexShaderSource: action.vertexSource || state.program.vertexShaderSource,
          fragmentShaderSource: action.fragmentSource || state.program.fragmentShaderSource
        }
      };
    case 'set-errors':
      return { ...state, errors: action.errors };
  }
}

export const EditorContext = createContext<[EditorState, Dispatch<EditorAction>]>([createInitialState(), () => {}]);

export function useCreateEditorState(): [EditorState, Dispatch<EditorAction>, typeof EditorContext.Provider] {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, createInitialState());
  return [state, dispatch, EditorContext.Provider];
}

export function useEditorStateContext(): [EditorState, Dispatch<EditorAction>] {
  return useContext(EditorContext);
}

function createInitialState(): EditorState {
  return {
    program: {
      id: 'example',
      userId: 'anon',
      title: 'example-program',
      vertexShaderSource: exampleVertexShader,
      fragmentShaderSource: exampleFragmentShader,
      didCompile: true,
      createdAt: Date.now().toString(),
      modifiedAt: Date.now().toString()
    },
    errors: {
      vertexShaderErrors: [],
      fragmentShaderErrors: [],
      linkerErrors: [],
    }
  };
}
