// utils/posts.js
export const getUserPosts = async (userEmail, page = 1) => {
    const ppp = 2; // Posts per page
    const res = await fetch(`/api/posts?userEmail=${userEmail}&page=${page}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return res.json();
  };