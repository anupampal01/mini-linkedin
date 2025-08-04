import { useState, useEffect, useContext } from "react";
import postService from "../services/postService";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    postService.getPosts().then(setPosts);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    const newPost = await postService.createPost(content, image, user.token);
    setPosts([newPost, ...posts]);
    setContent("");
    setImage(null);
    showToast("Post uploaded successfully!", "success");
  };

  const handleEditPost = async () => {
    if (!editPost.content.trim() && !editPost.image) return;
    const updated = await postService.updatePost(
      editPost._id,
      editPost.content,
      editPost.image,
      user.token
    );
    setPosts(posts.map((p) => (p._id === updated._id ? updated : p)));
    setEditPost(null);
    showToast("Post updated successfully!", "success");
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await postService.deletePost(id, user.token);
    setPosts(posts.filter((p) => p._id !== id));
    showToast("Post deleted successfully!", "success");
  };

  return (
    <div className="home-container">
      <SidebarLeft />

      <main className="feed">
        {user && (
          <form onSubmit={handleCreatePost} className="create-post-form">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="btn btn-primary">Post</button>
          </form>
        )}

        <h2 className="section-title">Public Feed</h2>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            isOwner={post.author?._id === user?._id}
            onEdit={(p) => setEditPost(p)}
            onDelete={handleDeletePost}
          />
        ))}

        {editPost && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Post</h3>
              <textarea
                value={editPost.content}
                onChange={(e) =>
                  setEditPost({ ...editPost, content: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditPost({ ...editPost, image: e.target.files[0] })
                }
              />
              <div className="modal-actions">
                <button
                  onClick={() => setEditPost(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleEditPost} className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SidebarRight />
    </div>
  );
}
