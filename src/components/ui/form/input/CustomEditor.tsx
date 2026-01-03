import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaLink,
  FaUnlink,
  FaImage,
  FaCode,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaFont,
  FaPalette,
  FaHighlighter,
  FaSubscript,
  FaSuperscript,
  FaIndent,
  FaOutdent,
  FaTable,
  FaEye,
  FaExpand
} from 'react-icons/fa';

interface CustomEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  height?: string;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  initialValue = '',
  onChange,
  isDisabled = false,
  placeholder = '',
  height = '300px'
}) => {
  const [content, setContent] = useState<string>(initialValue);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeFormats, setActiveFormats] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    align: 'left' | 'center' | 'right' | 'justify' | null;
    list: 'ordered' | 'unordered' | null;
    format: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote' | 'pre' | null;
  }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: null,
    list: null,
    format: null
  });
  const editorRef = useRef<HTMLDivElement>(null);

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const parentElement = commonAncestor.parentElement;

    if (!parentElement) return;

    // Check text formatting
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isUnderline = document.queryCommandState('underline');
    const isStrikethrough = document.queryCommandState('strikeThrough');

    // Check alignment
    let align: 'left' | 'center' | 'right' | 'justify' | null = null;
    if (document.queryCommandState('justifyLeft')) align = 'left';
    else if (document.queryCommandState('justifyCenter')) align = 'center';
    else if (document.queryCommandState('justifyRight')) align = 'right';
    else if (document.queryCommandState('justifyFull')) align = 'justify';

    // Check list type
    let list: 'ordered' | 'unordered' | null = null;
    if (document.queryCommandState('insertOrderedList')) list = 'ordered';
    else if (document.queryCommandState('insertUnorderedList')) list = 'unordered';

    // Check block format
    let format: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote' | 'pre' | null = null;
    const blockElement = parentElement.closest('p, h1, h2, h3, h4, h5, h6, blockquote, pre');
    if (blockElement) {
      format = blockElement.tagName.toLowerCase() as any;
    }

    setActiveFormats({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      strikethrough: isStrikethrough,
      align,
      list,
      format
    });
  }, []);

  const handleContentChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    onChange(newContent);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const handleKeyUp = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== content) {
        setContent(newContent);
        onChange(newContent);
      }
    }
  }, [content, onChange]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = initialValue;
      setIsInitialized(true);
    }
  }, [initialValue, isInitialized]);

  const executeCommand = useCallback((command: string, value?: string) => {
    if (isDisabled) return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
      updateActiveFormats();
    }
  }, [isDisabled, onChange, updateActiveFormats]);

  const insertLink = useCallback(() => {
    const url = prompt('');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('');
    if (url) {
      executeCommand('insertImage', url);
    }
  }, [executeCommand]);

  const insertTable = useCallback(() => {
    const rows = prompt('');
    const cols = prompt('');
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;"> </td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      
      executeCommand('insertHTML', tableHTML);
    }
  }, [executeCommand]);

  const changeFontSize = useCallback((size: string) => {
    executeCommand('fontSize', size);
  }, [executeCommand]);

  const changeFontColor = useCallback((color: string) => {
    executeCommand('foreColor', color);
  }, [executeCommand]);

  const changeBackgroundColor = useCallback((color: string) => {
    executeCommand('backColor', color);
  }, [executeCommand]);

  const togglePreview = useCallback(() => {
    setIsPreview(!isPreview);
  }, [isPreview]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
  }> = ({ icon, onClick, isActive = false }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`toolbar-btn ${isActive ? 'active' : ''}`}
      style={{
        padding: '8px',
        border: '1px solid #ddd',
        background: isActive ? '#e3f2fd' : '#fff',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '36px',
        height: '36px',
        margin: '2px',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && !isActive) {
          e.currentTarget.style.background = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && !isActive) {
          e.currentTarget.style.background = '#fff';
        }
      }}
    >
      {icon}
    </button>
  );

  const editorStyle: React.CSSProperties = {
    width: '100%',
    height: height,
    border: '1px solid #ddd',
    borderRadius: '0 0 8px 8px',
    padding: '12px',
    fontSize: '14px',
    lineHeight: '1.6',
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
    overflow: 'auto',
    backgroundColor: isDisabled ? '#f5f5f5' : '#fff',
    color: isDisabled ? '#666' : '#333',
    minHeight: '150px'
  };

  const containerStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    position: isFullscreen ? 'fixed' : 'relative',
    top: isFullscreen ? 0 : 'auto',
    left: isFullscreen ? 0 : 'auto',
    width: isFullscreen ? '100vw' : '100%',
    height: isFullscreen ? '100vh' : 'auto',
    zIndex: isFullscreen ? 9999 : 'auto',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={containerStyle}>
      {/* Toolbar */}
      <div style={{
        padding: '8px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px 8px 0 0'
      }}>
        {/* Text Format */}
        <div style={{ display: 'flex', marginRight: '8px' }}>
          <ToolbarButton
            icon={<FaBold />}
            onClick={() => executeCommand('bold')}
            isActive={activeFormats.bold}
          />
          <ToolbarButton
            icon={<FaItalic />}
            onClick={() => executeCommand('italic')}
            isActive={activeFormats.italic}
          />
          <ToolbarButton
            icon={<FaUnderline />}
            onClick={() => executeCommand('underline')}
            isActive={activeFormats.underline}
          />
          <ToolbarButton
            icon={<FaStrikethrough />}
            onClick={() => executeCommand('strikeThrough')}
            isActive={activeFormats.strikethrough}
          />
        </div>

        {/* Heading and Format - Desktop Only */}
        <div className="hidden sm:flex" style={{ marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            value={activeFormats.format || 'p'}
            disabled={isDisabled}
            style={{
              padding: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              width: '40px'
            }}
          >
            <option value="p">¶</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
            <option value="blockquote">❝</option>
            <option value="pre">&lt;/&gt;</option>
          </select>
        </div>

        {/* Alignment - Desktop Only */}
        <div className="hidden sm:flex" style={{ marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <ToolbarButton
            icon={<FaAlignLeft />}
            onClick={() => executeCommand('justifyLeft')}
            isActive={activeFormats.align === 'left'}
          />
          <ToolbarButton
            icon={<FaAlignCenter />}
            onClick={() => executeCommand('justifyCenter')}
            isActive={activeFormats.align === 'center'}
          />
          <ToolbarButton
            icon={<FaAlignRight />}
            onClick={() => executeCommand('justifyRight')}
            isActive={activeFormats.align === 'right'}
          />
          <ToolbarButton
            icon={<FaAlignJustify />}
            onClick={() => executeCommand('justifyFull')}
            isActive={activeFormats.align === 'justify'}
          />
        </div>

        {/* Lists */}
        <div style={{ display: 'flex', marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <ToolbarButton
            icon={<FaListUl />}
            onClick={() => executeCommand('insertUnorderedList')}
            isActive={activeFormats.list === 'unordered'}
          />
          <ToolbarButton
            icon={<FaListOl />}
            onClick={() => executeCommand('insertOrderedList')}
            isActive={activeFormats.list === 'ordered'}
          />
          <div className="hidden sm:flex">
            <ToolbarButton
              icon={<FaIndent />}
              onClick={() => executeCommand('indent')}
            />
            <ToolbarButton
              icon={<FaOutdent />}
              onClick={() => executeCommand('outdent')}
            />
          </div>
        </div>

        {/* Content Insertion - Desktop Only */}
        <div className="hidden sm:flex" style={{ marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <ToolbarButton
            icon={<FaLink />}
            onClick={insertLink}
          />
          <ToolbarButton
            icon={<FaUnlink />}
            onClick={() => executeCommand('unlink')}
          />
          <ToolbarButton
            icon={<FaImage />}
            onClick={insertImage}
          />
          <ToolbarButton
            icon={<FaTable />}
            onClick={insertTable}
          />
        </div>

        {/* Font Size - Desktop Only */}
        <div className="hidden sm:flex" style={{ display: 'flex', alignItems: 'center', marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <select
            onChange={(e) => changeFontSize(e.target.value)}
            disabled={isDisabled}
            style={{
              padding: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              width: '40px'
            }}
          >
            <option value="">A</option>
            <option value="1">A₁</option>
            <option value="2">A₂</option>
            <option value="3">A₃</option>
            <option value="4">A₄</option>
            <option value="5">A₅</option>
            <option value="6">A₆</option>
            <option value="7">A₇</option>
          </select>
        </div>

        {/* Colors - Desktop Only */}
        <div className="hidden sm:flex" style={{ display: 'flex', alignItems: 'center', marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <input
            type="color"
            onChange={(e) => changeFontColor(e.target.value)}
            disabled={isDisabled}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <input
            type="color"
            onChange={(e) => changeBackgroundColor(e.target.value)}
            disabled={isDisabled}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          />
        </div>

        {/* Undo/Redo - Desktop Only */}
        <div className="hidden sm:flex" style={{ display: 'flex', marginRight: '8px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          <ToolbarButton
            icon={<FaUndo />}
            onClick={() => executeCommand('undo')}
          />
          <ToolbarButton
            icon={<FaRedo />}
            onClick={() => executeCommand('redo')}
          />
        </div>

        {/* View Controls */}
        <div style={{ display: 'flex', marginLeft: 'auto' }}>
          <div className="hidden sm:flex">
            <ToolbarButton
              icon={<FaEye />}
              onClick={togglePreview}
              isActive={isPreview}
            />
          </div>
          <ToolbarButton
            icon={<FaExpand />}
            onClick={toggleFullscreen}
            isActive={isFullscreen}
          />
        </div>
      </div>

      {/* Editor Area */}
      {isPreview ? (
        <div
          style={{
            ...editorStyle,
            backgroundColor: '#f9f9f9',
            cursor: 'default'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable={!isDisabled}
          onInput={handleContentChange}
          onKeyUp={handleKeyUp}
          onPaste={handleKeyUp}
          onSelect={updateActiveFormats}
          onFocus={() => {
            if (editorRef.current && editorRef.current.innerHTML === '') {
              editorRef.current.innerHTML = '';
            }
            updateActiveFormats();
          }}
          style={editorStyle}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      )}

      {/* Status Bar */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        fontSize: '12px',
        color: '#666',
        borderRadius: '0 0 8px 8px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>{content.replace(/<[^>]*>/g, '').length}</span>
        <span>{content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length}</span>
      </div>

      {/* CSS Styles */}
      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #999;
          font-style: italic;
        }
        
        .toolbar-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .toolbar-btn.active {
          border-color: #2196F3;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        }
        
        blockquote {
          margin: 16px 0;
          padding: 12px 16px;
          border-left: 4px solid #2196F3;
          background-color: #f5f5f5;
          font-style: italic;
        }
        
        pre {
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 12px;
          font-family: 'Courier New', monospace;
          overflow-x: auto;
        }
        
        table {
          margin: 16px 0;
        }
        
        td {
          min-width: 50px;
          min-height: 20px;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default CustomEditor