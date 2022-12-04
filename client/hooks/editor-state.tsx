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

type EditorStateSetTitle = {
  action: 'set-title',
  title: string
};

type EditorAction = EditorActionSetSources | EditorActionSetErrors | EditorStateSetTitle;

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
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
    case 'set-title':
      return {
        ...state,
        program: {
          ...state.program,
          title: action.title
        }
      };
  }
}

// FIXME: This context is adding complexity without any upside right now. If this is still the case after the editor
//        is built a bit, we should remove this.
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
      title: 'Untitled Program',
      vertexSource: exampleVertexShader,
      fragmentSource: exampleFragmentShader,
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
