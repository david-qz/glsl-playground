import { CSSProperties, ReactElement, ReactNode } from 'react';
import styles from './toolbar.module.css';

type ToolbarProps = {
  style?: CSSProperties
  children: [ReactElement, ReactElement]
};

export default function Toolbar({ style, children }: ToolbarProps): ReactElement {
  const leftGroup = children.find(c => c.type === ToolbarLeftGroup);
  const rightGroup = children.find(c => c.type === ToolbarRightGroup);

  return (
    <div className={styles.toolbar} style={style}>
      {leftGroup}
      {rightGroup}
    </div>
  );
}

type ToolbarLeftGroupProps = {
  children: ReactNode
};

export function ToolbarLeftGroup({ children }: ToolbarLeftGroupProps): ReactElement {
  return (
    <div className={styles.toolbarLeft}>
      {children}
    </div>
  );
}

type ToolbarRightGroupProps = {
  children: ReactNode
};

export function ToolbarRightGroup({ children }: ToolbarRightGroupProps): ReactElement {
  return (
    <div className={styles.toolbarRight}>
      {children}
    </div>
  );
}
