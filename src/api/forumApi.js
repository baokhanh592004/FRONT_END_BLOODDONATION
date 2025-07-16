import axiosClient from './axiosClient';

const forumApi = {
  // === PUBLIC API ===
  // Lấy tất cả các chủ đề
  getAllTopics: () => {
    const url = '/forum/topics';
    return axiosClient.get(url);
  },

  // Lấy tất cả bài đăng (bình luận) trong một chủ đề
  getPostsByTopic: (topicId) => {
    const url = `/forum/topics/${topicId}/posts`;
    return axiosClient.get(url);
  },

  // === MEMBER API ===
  // Tạo một bài đăng mới
  createPost: (postData) => {
    const url = '/member/forum/posts';
    return axiosClient.post(url, postData);
  },

  // === ADMIN API ===
  // Tạo một chủ đề mới
  createTopic: (topicData) => {
    const url = '/admin/forum/topics';
    return axiosClient.post(url, topicData);
  },

  // Xóa một chủ đề
  deleteTopic: (topicId) => {
    const url = `/admin/forum/topics/${topicId}`;
    return axiosClient.delete(url);
  },

  // Ẩn một bài đăng
  hidePost: (postId) => {
    const url = `/admin/forum/posts/${postId}/hide`;
    return axiosClient.put(url);
  },
};

export default forumApi;