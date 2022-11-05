import Editor from '../../editor/editor';
import Header from '../../header/header';
import styles from './editor-view.module.css';

export default function EditorView() {
  return (
    <div className={styles.layout}>
      <Header style={{ gridArea: 'header' }} />
      <Editor style={{ gridArea: 'editor' }} />
    </div>
  );
}
