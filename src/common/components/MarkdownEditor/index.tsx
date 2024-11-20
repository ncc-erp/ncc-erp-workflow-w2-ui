import MDEditor, {
  commands,
  ICommand,
  MDEditorProps,
  RefMDEditor,
} from '@uiw/react-md-editor';
import {
  MarkdownPreviewProps,
  MarkdownPreviewRef,
} from '@uiw/react-markdown-preview';
import { RefAttributes, useState } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { RiAttachment2, RiLoader4Line } from 'react-icons/ri';
import './style.scss';

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
  const [uploading, setUploading] = useState(false);

  const attachFileCommand: ICommand = {
    name: 'image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': 'Attach file', title: 'Attach file' },
    // icon: uploading || true ? <RiLoader4Line className="animate-spin" /> : <RiAttachment2 />,
    render: () => {
      return (
        <button type="button" className="button-upload" disabled={uploading}>
          {uploading ? (
            <RiLoader4Line className="animate-spin" />
          ) : (
            <RiAttachment2 />
          )}
        </button>
      );
    },

    execute: async (state, api) => {
      // OPEN my component.

      // example
      // const [image, setImaeg] = React.useState('');
      // <ImageUploader value={image} onChange={setImage} />

      // let image_url = await upload_image(image);
      const image_url = 'imageUrl';

      const modifyText = `![](${image_url})\n`;
      api.replaceSelection(modifyText);
    },
  };

  const fileUploader = async (file: File) => {
    setUploading(true);
    const imageURL = await new Promise((resolve) =>
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
        setUploading(false);
      }, 3000)
    );

    return imageURL;
  };

  const onFilePasted = async (
    dataTransfer: DataTransfer,
    setMarkdown?: (value?: string) => void
  ) => {
    const files: File[] = [];
    for (let index = 0; index < dataTransfer.items.length; index += 1) {
      const file = dataTransfer.files.item(index);

      if (file) {
        files.push(file);
      }
    }

    await Promise.all(
      files.map(async (file) => {
        const url = await fileUploader(file);
        const isImage = file.type.startsWith('image/');
        const insertedMarkdown = insertFileUrlToTextArea(
          isImage ? `![](${url})` : `[${file.name}](${url})`
        );
        if (!insertedMarkdown) {
          return;
        }
        setMarkdown?.(insertedMarkdown);
      })
    );
  };

  const insertFileUrlToTextArea = (insertString: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) {
      return null;
    }

    let sentence = textarea.value;
    const len = sentence.length;
    const pos = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const front = sentence.slice(0, pos);
    const back = sentence.slice(pos, len);

    sentence = front + insertString + back;

    textarea.value = sentence;
    textarea.selectionEnd = end + insertString.length;

    return sentence;
  };

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
      onPaste={async (event) => {
        if (event.clipboardData.files.length > 0) {
          event.preventDefault();
          await onFilePasted(event.clipboardData, onChange);
          return;
        } else {
          await onFilePasted(event.clipboardData, onChange);
        }
      }}
      onDrop={async (event) => {
        event.preventDefault();
        await onFilePasted(event.dataTransfer, onChange);
      }}
      commands={[
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.hr,
        commands.title,
        commands.divider,
        commands.link,
        commands.quote,
        commands.code,
        commands.codeBlock,
        commands.comment,
        commands.image,
        attachFileCommand,
        commands.table,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,
        commands.divider,
        commands.help,
      ]}
      minHeight={140}
      {...editorProps}
    />
  );
};

export default MarkdownEditor;
