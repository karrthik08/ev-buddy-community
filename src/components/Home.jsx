import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";

const Home = () => {
  const { user, logout } = useAuth();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  const isAdmin = user?.email === "karrthikburugupally@gmail.com";

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      postData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setPosts(postData);
    });
    return unsubscribe;
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    await addDoc(collection(db, "posts"), {
      content,
      email: user.email,
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
    });
    setContent("");
  };

  const handleDelete = async (id, postEmail) => {
    if (user.email === postEmail || isAdmin) {
      await deleteDoc(doc(db, "posts", id));
    }
  };

  const handleVote = async (id, type) => {
    const voteKey = `${id}-${type}`;
    if (userVotes[voteKey]) return;

    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const updatedVotes = {
      upvotes: post.upvotes + (type === "upvote" ? 1 : 0),
      downvotes: post.downvotes + (type === "downvote" ? 1 : 0),
    };

    await updateDoc(doc(db, "posts", id), updatedVotes);
    setUserVotes((prev) => ({ ...prev, [voteKey]: true }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">👋 Welcome, {user.email}</h1>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Post Input */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={100}
            placeholder="What's on your mind? (max 100 chars)"
            className="w-full p-3 rounded bg-gray-700 text-white resize-none mb-3"
          />
          <button
            onClick={handlePost}
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 rounded-xl p-4 mb-4 shadow-md"
          >
            <p className="mb-2">{post.content}</p>
            <p className="text-sm text-gray-400">
              by {post.email} •{" "}
              {post.timestamp?.toDate
                ? format(post.timestamp.toDate(), "PPpp")
                : post.timestamp?.seconds
                ? format(new Date(post.timestamp.seconds * 1000), "PPpp")
                : "Invalid Date"}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleVote(post.id, "upvote")}
                className="text-yellow-400"
              >
                👍 {post.upvotes}
              </button>
              <button
                onClick={() => handleVote(post.id, "downvote")}
                className="text-blue-400"
              >
                👎 {post.downvotes}
              </button>
              {(user.email === post.email || isAdmin) && (
                <button
                  onClick={() => handleDelete(post.id, post.email)}
                  className="bg-red-500 text-white px-3 py-1 rounded ml-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
