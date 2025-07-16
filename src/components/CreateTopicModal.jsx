import React, { useState } from "react";
import forumApi from "../api/forumApi";
import { toast } from "react-toastify";

const CreateTopicModal = ({ isOpen, onClose, onTopicCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.userId) {
      toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    if (!title) {
      toast.error("Vui lòng nhập tiêu đề!");
      setIsLoading(false);
      return;
    }

    try {
      await forumApi.createTopic({ title, description, createdBy: user.userId });
      toast.success("Tạo chủ đề mới thành công!");
      setTitle("");
      setDescription("");
      onTopicCreated();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo chủ đề:", error);
      toast.error("Tạo chủ đề thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo Chủ đề mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? "Đang tạo..." : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
