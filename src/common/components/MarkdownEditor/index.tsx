import MDEditor, { MDEditorProps, RefMDEditor } from '@uiw/react-md-editor';
import {
  MarkdownPreviewProps,
  MarkdownPreviewRef,
} from '@uiw/react-markdown-preview';
import { RefAttributes } from 'react';
import { ForwardRefExoticComponent } from 'react';
export interface MarkdownEditorProps {
  value?: string;
  source?: string;
  onChange?: (value?: string) => void;
  type?: 'editor' | 'preview';
  editorProps?: React.ForwardRefExoticComponent<
    MDEditorProps & React.RefAttributes<RefMDEditor>
  >;
  previewProps?: ForwardRefExoticComponent<
    MarkdownPreviewProps & RefAttributes<MarkdownPreviewRef>
  >;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  source,
  onChange,
  type = 'editor',
  editorProps,
  previewProps,
}) => {
  return type === 'preview' ? (
    <MDEditor.Markdown
      source={source}
      style={{ whiteSpace: 'pre-wrap' }}
      {...previewProps}
    />
  ) : (
    <MDEditor
      value={value}
      onChange={onChange}
      preview="edit"
      {...editorProps}
    />
  );
};

export default MarkdownEditor;
