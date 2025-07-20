"use client";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const DUMMY_BLOGS = [
  {
    _id: "1",
    title: "Welcome to Our Blog",
    content: "This is the first blog post.",
    author: "Admin",
    coverImage: { url: "" },
  },
  {
    _id: "2",
    title: "Service Updates",
    content: "We have updated our services.",
    author: "Jane Doe",
    coverImage: { url: "" },
  },
  {
    _id: "3",
    title: "Tips & Tricks",
    content: "Here are some useful tips.",
    author: "John Smith",
    coverImage: { url: "" },
  },
  {
    _id: "4",
    title: "Company News",
    content: "Latest news from our company.",
    author: "Admin",
    coverImage: { url: "" },
  },
  {
    _id: "5",
    title: "Customer Stories",
    content: "Read our customer success stories.",
    author: "Jane Doe",
    coverImage: { url: "" },
  },
  {
    _id: "6",
    title: "Upcoming Features",
    content: "Preview of what's coming soon.",
    author: "John Smith",
    coverImage: { url: "" },
  },
];

const PAGE_SIZE = 3;

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState(DUMMY_BLOGS.slice(0, PAGE_SIZE));
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    coverImage: { url: "" },
  });
  const [editingId, setEditingId] = useState(null);
  const [imageBuffers, setImageBuffers] = React.useState<string | null>(null);
  const [imageFromCoudiary, setImageFromCoudiary] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(DUMMY_BLOGS.length / PAGE_SIZE));

  useEffect(() => {
    fetchBlogs(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchBlogs = (page = 1) => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setBlogs(DUMMY_BLOGS.slice(start, end));
    setTotalPages(Math.ceil(DUMMY_BLOGS.length / PAGE_SIZE));
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (imageBuffers) {
        form.coverImage.url = imageBuffers;
      }
      if (editingId) {
        // Update
        const idx = DUMMY_BLOGS.findIndex((b) => b._id === editingId);
        if (idx !== -1) {
          DUMMY_BLOGS[idx] = { ...form, _id: editingId };
        }
      } else {
        // Create
        const newId = (parseInt(DUMMY_BLOGS[DUMMY_BLOGS.length - 1]?._id || "0") + 1).toString();
        DUMMY_BLOGS.push({ ...form, _id: newId });
      }
      setForm({ title: "", content: "", author: "", coverImage: { url: "" } });
      setImageBuffers(null);
      setEditingId(null);
      setImageFromCoudiary("");
      fetchBlogs(page);
      setLoading(false);
    }, 500);
  };

  const handleEdit = (blog) => {
    let textarea: HTMLTextAreaElement | null = null;
    setTimeout(() => {
      textarea = document.querySelector("textarea");
      if (textarea) {
        adjustTextareaHeight({ target: textarea });
      }
    }, 100);

    setForm(blog);
    setImageFromCoudiary(blog.coverImage.url);
    setEditingId(blog._id);
  };

  const handleDelete = (id) => {
    setLoadingDelete((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const idx = DUMMY_BLOGS.findIndex((b) => b._id === id);
      if (idx !== -1) {
        DUMMY_BLOGS.splice(idx, 1);
      }
      fetchBlogs(page > Math.ceil(DUMMY_BLOGS.length / PAGE_SIZE) ? page - 1 : page);
      setLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }, 500);
  };

  const handelImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("FileReader failed to produce a valid Base64 string."));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const cancelUpdate = () => {
    setForm({ title: "", content: "", author: "", coverImage: { url: "" } });
    setImageFromCoudiary("");
    setImageBuffers("");
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handelImage(file)
        .then((result) => {
          setImageBuffers(result);
        })
        .catch((error) => {
          console.error("Error processing image:", error);
        });
    }
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-6  mx-6 mb-20 bg-white rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-6 text-center text-secondary">Blog Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm">
        {/* Image URL */}
        <div className="flex flex-col md:flex-row gap-6 mb-5 items-start">
          <div className="w-40">
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {imageBuffers ? (
              <label htmlFor="imageUpload" className="w-full cursor-pointer">
                <div className="relative">
                  <img
                    src={imageBuffers}
                    alt={`Uploaded image`}
                    className="rounded-md shadow-md w-full h-40 object-cover"
                  />
                </div>
              </label>
            ) : imageFromCoudiary ? (
              <label htmlFor="imageUpload" className="w-full cursor-pointer">
                <div className="relative">
                  <img
                    src={imageFromCoudiary}
                    alt={`Uploaded image`}
                    className="rounded-md shadow-md w-full h-40 object-cover"
                  />
                </div>
              </label>
            ) : (
              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-5 w-full h-40 hover:shadow-md cursor-pointer text-center bg-white"
              >
                <div className="flex flex-col items-center space-y-2">
                  <FiUpload className="text-gray-400 text-2xl" />
                  <p className="text-gray-500 font-medium">Upload Image</p>
                </div>
              </label>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <input
              className="w-full p-2 border rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition"
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full p-2 border rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition"
              onInput={adjustTextareaHeight}
              name="content"
              placeholder="Content"
              value={form.content}
              onChange={handleChange}
              required
              rows={3}
            />
            <input
              className="w-full p-2 border rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition"
              type="text"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
              required
            />
            <div className="flex items-center gap-4 mt-2">
              {(form.title || imageBuffers) && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  type="button"
                  onClick={cancelUpdate}
                >
                  Cancel
                </button>
              )}
              <button
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition flex items-center justify-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white" />
                ) : editingId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200 bg-white">
          <thead>
            <tr className="bg-secondary/10 text-secondary">
              <th className="border p-3">Title</th>
              <th className="border p-3">Author</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border transition">
                <td className="border p-3">{blog.title}</td>
                <td className="border p-3">{blog.author}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleEdit(blog)}
                    className=" border border-gray-300  text-gray-700 px-3 py-1 rounded mr-2 font-medium hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="border border-red-300  text-red-700 px-3 py-1 rounded hover:bg-red-50 font-medium transition"
                  >
                    {loadingDelete[blog._id] ? (
                      <AiOutlineLoading3Quarters className="animate-spin text-white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogDashboard;