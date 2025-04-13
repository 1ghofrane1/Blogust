"use client"
import React, { useState } from 'react';
import styles from './writePage.module.css';
import Image from "next/image";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const WritePage = () => {
  const [open, setOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
    ],
    content: '',
  });


  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSth: catSth || "style", //If not selected, choose the general category
      }),
    })}
  return (
    <div className={styles.container}>
      <input type="text" placeholder="Title" className={styles.input}/>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="plus" width={16} height={16}/>
        </button>

        {open && (
          <div className={styles.add}>
            <button className={styles.addButton}>
              <Image src="/image.png" alt="plus" width={16} height={16}/>
            </button>

            <button className={styles.addButton}>
              <Image src="/external.png" alt="plus" width={16} height={16}/>
            </button>

            <button className={styles.addButton}>
              <Image src="/video.png" alt="plus" width={16} height={16}/>
            </button>
          </div>
        )}

        <EditorContent editor={editor} className={styles.textArea}/>
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
