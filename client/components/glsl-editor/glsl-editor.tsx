import { ReactElement } from 'react';
import AceEditor, { IAnnotation, IMarker } from 'react-ace';
import 'ace-builds/src-min-noconflict/mode-glsl';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-min-noconflict/ext-language_tools';

type Props = {
  source: string,
  onChange: (source: string) => void,
  active: boolean,
  annotations: Array<IAnnotation>,
  markers: Array<IMarker>
};

export default function GLSLEditor({ source, onChange, active, annotations, markers }: Props): ReactElement {
  return (
    <AceEditor
      style={{ display: active ? 'initial' : 'none' }}
      value={source}
      onChange={onChange}
      focus={active}
      width='100%'
      height='100%'
      mode="glsl"
      theme="tomorrow_night_eighties"
      tabSize={2}
      editorProps={{ $blockScrolling: true }}
      enableLiveAutocompletion={true}
      setOptions={{ fontFamily: 'IBM Plex Mono' }}
      annotations={annotations}
      markers={markers}
    />
  );
}
