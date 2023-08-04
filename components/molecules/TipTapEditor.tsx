/* import './styles.scss' */
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import React, { useState } from 'react'
import EditorBar from '../organisms/Admin/EditorBar/EditorBar'
import { AxiosResponse } from 'axios'
import { FaqContentProps } from '../../pages/admin/content'
import { CheckIcon } from '@heroicons/react/24/outline'

interface TipTapEditorProps {
  id?: string,
  content?: string,
  callback?: (id?: string, question?: string, answer?: string) => Promise<AxiosResponse<any, any>>,
  question?: string,
  answer?: string,
  faqContent?: FaqContentProps[];
  onSetFaqContent?: (x: FaqContentProps[]) => void;
}

const TipTapEditor = ({ id, content, callback, question = '', answer = '', onSetFaqContent, faqContent }: TipTapEditorProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveChanges = () => {  
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1800);
  };

  const editor = useEditor({
    extensions: [
      Color,
      TextStyle,
      StarterKit,
      Paragraph.configure({
        HTMLAttributes: {
          class: `${answer === '' ? 'mb-6' : ''}`,
        },
      }),
      Link.configure({
        autolink: false,
        openOnClick: false,
        linkOnPaste: false,
      }),
    ],
    content: content,
    onUpdate: async ({ editor }) => {

      const html = editor.getHTML()
      setError(null);

      try {
        if (callback) {
          if (question === '' && answer === '') {
            await callback(id, html);
          } else if (question === '') {
            const response = await callback(id, html, answer);
            if (onSetFaqContent && faqContent) {
              const index = faqContent.findIndex(item => item.id === id);
              if (index !== -1) {
                const updatedContent = [...faqContent];
                updatedContent[index] = response.data;
                onSetFaqContent(updatedContent);
              }
            }
          } else {
            const response = await callback(id, question, html);
            if (onSetFaqContent && faqContent) {
              const index = faqContent.findIndex(item => item.id === id);
              if (index !== -1) {
                const updatedContent = [...faqContent];
                updatedContent[index] = response.data;
                onSetFaqContent(updatedContent);
              }
            }
          }
          handleSaveChanges();
        }
      } catch (error: any) {
        if (error?.response?.status === 400) {
          setError("Supera el límite de caracteres.");
        } else {
          setError("Algo salió mal.")
        }
      }
    },
  });

  return (
    <div className='mx-0'>
      <EditorBar editor={editor} />
      <EditorContent editor={editor} className='input-style bg-white rounded-base text-sm text-gray-500 border-l border-gray-300 h-fit mb-4 p-2 no-border' />
      {isSaved && (
        <span className='flex text-sm text-green-500 font-bold'> <CheckIcon className="w-5 h-5 text-green-500 mb-5 mr-1" />Guardado</span>
      )
      }
      {error && <span className='flex text-sm text-red-500 font-bold'>{error}</span>}
    </div>)
}

export default TipTapEditor;