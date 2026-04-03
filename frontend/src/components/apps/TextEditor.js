import { useState } from "react";
import { Save, FileText, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TextEditor() {
  const [content, setContent] = useState("# Welcome to AuraOS Text Editor\n\nStart typing here...\n");
  const [filename, setFilename] = useState("untitled.md");

  const handleSave = () => {
    toast.success(`Saved ${filename}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => toast.success("Copied to clipboard"));
  };

  const handleClear = () => {
    setContent("");
  };

  const lineCount = content.split("\n").length;
  const charCount = content.length;

  return (
    <div className="text-editor" data-testid="text-editor">
      <div className="editor-toolbar">
        <div className="editor-toolbar-btn" onClick={handleSave} data-testid="editor-save">
          <Save size={13} style={{ marginRight: 4 }} />Save
        </div>
        <div className="editor-toolbar-btn" onClick={handleCopy} data-testid="editor-copy">
          <Copy size={13} style={{ marginRight: 4 }} />Copy
        </div>
        <div className="editor-toolbar-btn" onClick={handleClear} data-testid="editor-clear">
          <Trash2 size={13} style={{ marginRight: 4 }} />Clear
        </div>
        <div style={{ flex: 1 }} />
        <input
          value={filename}
          onChange={e => setFilename(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6, padding: '4px 8px', color: 'rgba(255,255,255,0.7)', fontSize: 12,
            outline: 'none', width: 140
          }}
          data-testid="editor-filename"
        />
      </div>
      <textarea
        className="editor-textarea"
        value={content}
        onChange={e => setContent(e.target.value)}
        spellCheck={false}
        data-testid="editor-textarea"
      />
      <div style={{
        padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 16
      }}>
        <span>Lines: {lineCount}</span>
        <span>Characters: {charCount}</span>
        <span>Markdown</span>
      </div>
    </div>
  );
}
