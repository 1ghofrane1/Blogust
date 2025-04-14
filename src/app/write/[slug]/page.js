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
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };

    if (file) upload();
  }, [file]);

  if (status === "loading") return <div className={styles.loading}>Loading...</div>;
  if (status === "unauthenticated") router.push("/");

  const handleUpdate = async () => {
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
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        value={catSlug}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="lifestyle">lifestyle</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="plus" width={16} height={16} />
        </button>

        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <label htmlFor="image" className={styles.addButton}>
              <Image src="/image.png" alt="plus" width={16} height={16} />
            </label>
          </div>
        )}

        <EditorContent editor={editor} className={styles.textArea} />
      </div>
      <button className={styles.publish} onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default EditPost;
