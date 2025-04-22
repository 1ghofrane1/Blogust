'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./menuPosts.module.css"

const MenuPosts = ({ withImage }) => {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const res = await fetch("/api/posts/popular", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPopularPosts(data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (err) {
        console.error("Failed to fetch popular posts", err);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className={styles.items}>
      {popularPosts.map((post) => (
        <Link href={`/posts/${post.slug}`} className={styles.item} key={post.id}>
          {withImage && (
            <div className={styles.imageContainer}>
              <Image src={post.img || "/default.jpg"} alt={post.title} fill className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[post.catSlug]}`}>{post.catSlug}</span>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>{post.user.name}</span>
              <span className={styles.date}> - {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>  
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;

