"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './my-blogs.module.css';

const MyBlogsPage = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserPosts();
    }
  }, [status, router]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(
        `/api/posts?userEmail=${session.user.email}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm("Deleting this post will also remove all associated comments. Are you sure?")) {
      try {
        const res = await fetch(`/api/posts/${slug}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          fetchUserPosts();
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Failed to delete post.");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("An unexpected error occurred.");
      }
    }
  };
  

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Blogs</h1>
        <Link href="/write" className={styles.createButton}>
          + Create New Blog
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't written any blogs yet.</p>
          <Link href="/write" className={styles.button}>
            Write your first blog
          </Link>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.img && (
                <div className={styles.imageContainer}>
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className={styles.image}
                  />
                </div>
              )}
              <div className={styles.postContent}>
                <h2>{post.title}</h2>
                <p className={styles.date}>{formatDate(post.createdAt)}</p>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{
                    __html: post.desc.substring(0, 100) + '...',
                  }}
                />
                <div className={styles.actions}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className={styles.viewButton}
                  >
                    View Post
                  </Link>
                  <Link
                    href={`/write/${post.slug}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
