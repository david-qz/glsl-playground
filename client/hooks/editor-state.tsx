import { createContext, Dispatch, useContext, useReducer } from 'react';
import { exampleFragmentShader, exampleVertexShader } from '../utils/example-shaders';

type EditorState = {
  vertexSource: string,
  fragmentSource: string,
  errors: Array<string>
};

type EditorActionSetSources = {
  action: 'set-sources',
  vertexSource?: string,
  fragmentSource?: string
};

type EditorActionSetErrors = {
  action: 'set-errors',
  errors: Array<string>
};

type EditorAction = EditorActionSetSources | EditorActionSetErrors;

const initialState: EditorState = {
  vertexSource: exampleVertexShader,
  fragmentSource: exampleFragmentShader,
  errors: []
};

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.action) {
    case 'set-sources':
      return {
        ...state,
        vertexSource: action.vertexSource || state.vertexSource,
        fragmentSource: action.fragmentSource || state.fragmentSource
      };
    case 'set-errors':
      return { ...state, errors: action.errors };
  }
}

export const EditorContext = createContext<[EditorState, Dispatch<EditorAction>]>([initialState, () => {}]);

export function useCreateEditorState(): [EditorState, Dispatch<EditorAction>, typeof EditorContext.Provider] {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);
  return [state, dispatch, EditorContext.Provider];
}

export function useEditorStateContext(): [EditorState, Dispatch<EditorAction>] {
  return useContext(EditorContext);
}
