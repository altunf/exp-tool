"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Type } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Extension } from '@tiptap/core';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

// Custom FontSize extension for TipTap 2.x
const FontSize = Extension.create({
  name: 'fontSize',
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
    };
  },
});

export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange(newContent);
    },
  });

  const setFontSize = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-1 flex gap-1 border-b">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        {/* Text Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFontSize('12px')}>Small</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('16px')}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('20px')}>Large</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('24px')}>X-Large</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorContent editor={editor} className="p-2 min-h-[150px]" />
    </div>
  );
}