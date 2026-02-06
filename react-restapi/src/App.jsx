import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import for routing

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [selectedPost, setSelectedPost] = useState(null); // For PUT/DELETE

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
      setPosts([...posts, response.data]);
      setNewPost({ title: '', body: '' }); // Clear input fields
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async () => {
    if (!selectedPost) return; // Make sure a post is selected

    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, selectedPost);
      // Update the post in the state
      const updatedPosts = posts.map(post =>
        post.id === selectedPost.id ? response.data : post
      );
      setPosts(updatedPosts);
      setSelectedPost(null); // Clear selection after update
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Router> {/* Wrap with Router */}
      <div className="container">
        <h1>React REST API Example</h1>

        {/* Navigation (optional) */}
        <nav>
           <Link to="/">Home</Link> {/* Example Link */}
        </nav>

        <Routes>
          <Route path="/" element={
          <>
            <h2>Posts</h2>
            <ul>
              {posts.map(post => (
                <li key={post.id} onClick={() => setSelectedPost(post)}>
                  {post.title}
                </li>
              ))}
            </ul>

            <h2>Create New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Body"
              value={newPost.body}
              onChange={e => setNewPost({ ...newPost, body: e.target.value })}
            />
            <button onClick={createPost}>Create</button>

            {/* Update Form (Shown when a post is selected) */}
            {selectedPost && (
              <div>
                <h2>Update Post</h2>
                <input
                  type="text"
                  value={selectedPost.title}
                  onChange={e => setSelectedPost({ ...selectedPost, title: e.target.value })}
                />
                <textarea
                  value={selectedPost.body}
                  onChange={e => setSelectedPost({ ...selectedPost, body: e.target.value })}
                />
                <button onClick={updatePost}>Update</button>
                <button onClick={() => deletePost(selectedPost.id)}>Delete</button>
              </div>
            )}
          </>
          } />
        </Routes>

      </div>
    </Router>
  );
};

export default App;