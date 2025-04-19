"use client";

import React, { useEffect, useState } from "react";
import styles from "../writePage.module.css";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";

const EditPost = () => {
  const { status } = useSession();
  const router = useRouter();
  const { slug } = useParams();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setValue(data.desc);
          setMedia(data.img);
          setCatSlug(data.catSlug);
          editor?.commands.setContent(data.desc);
        }
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };

    fetchPost();
  }, [slug, editor]);

  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          setUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
            setUploadProgress(0);
          });
        }
      );
    };

    if (file) upload();
  }, [file]);

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

  const handleUpdate = async () => {
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
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          catSlug,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Edit Post</h1>
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Your amazing title..."
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
          >
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
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <label htmlFor="image" className={styles.mediaButton}>
                <Image src="/image.png" alt="Add image" width={20} height={20} />
                <span>Image</span>
              </label>
            </div>
          )}
        </div>

        {uploadProgress > 0 && (
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span className={styles.progressText}>{Math.round(uploadProgress)}%</span>
          </div>
        )}

        <div className={styles.editorContent}>
          <EditorContent editor={editor} className={styles.textArea} />
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.publishButton} 
          onClick={handleUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinnerSmall}></span>
              Updating...
            </>
          ) : (
            'Update Post'
          )}
        </button>
      </div>
    </div>
  );
};

export default EditPost;