// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const adminEmails = ["karrthikburugupally.com"]; 
  const isAdmin = adminEmails.includes(user?.email);

  useEffect(() => {
    if (isAdmin) {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleDelete = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500">
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6"> Admin Dashboard</h1>
        <Link to="/" className="text-blue-500 underline mb-4 block">⬅ Back to Home</Link>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p className="text-lg">{post.content}</p>
              <p className="text-sm text-gray-500">By: {post.email}</p>
              <button
                onClick={() => handleDelete(post.id)}
                className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🗑️ Delete Post
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}