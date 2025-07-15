import axiosClient from './axiosClient';

const certificateApi = {
  // API để lấy danh sách chứng nhận của người dùng đang đăng nhập
  getMyCertificates: () => {
    const url = '/user/certificates';
    return axiosClient.get(url);
  },

  // API để tải file PDF của một chứng nhận cụ thể
  downloadCertificate: (certificateId) => {
    const url = `/user/certificates/${certificateId}/download`;
    // Yêu cầu server trả về dữ liệu dạng blob (binary large object) cho file
    return axiosClient.get(url, {
      responseType: 'blob', 
    });
  },
};

export default certificateApi;