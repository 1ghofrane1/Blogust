"use client"
import React, { useEffect, useState } from 'react';
import styles from './writePage.module.css';
import Image from "next/image";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your story here...',
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMedia(event.target.result); // This will be the Base64 string
    };
    reader.readAsDataURL(file);
  };

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }
    
    if (!value.trim()) {
      alert("Please add some content");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          slug: slugify(title),
          catSlug: catSlug || "style",
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create post");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Post</h1>
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Your amazing title..."
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            onChange={(e) => setCatSlug(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a category</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="culture">Culture</option>
            <option value="travel">Travel</option>
            <option value="coding">Coding</option>
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <button 
            className={`${styles.toolbarButton} ${open ? styles.active : ''}`} 
            onClick={() => setOpen(!open)}
            aria-label="Add media"
          >
            <Image src="/plus.png" alt="plus" width={20} height={20} />
          </button>

          {open && (
            <div className={styles.mediaOptions}>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="image" className={styles.mediaButton}>
                <Image src="/image.png" alt="Add image" width={20} height={20} />
                <span>Image</span>
              </label>
            </div>
          )}
        </div>

        {media && (
          <div className={styles.imagePreview}>
            <img 
              src={media} 
              alt="Preview" 
              className={styles.previewImage}
            />
          </div>
        )}

        <div className={styles.editorContent}>
          <EditorContent editor={editor} className={styles.textArea} />
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.publishButton} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinnerSmall}></span>
              Publishing...
            </>
          ) : (
            'Publish'
          )}
        </button>
      </div>
    </div>
  );
};

export default WritePage;