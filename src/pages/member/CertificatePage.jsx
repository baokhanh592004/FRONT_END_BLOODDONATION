import React, { useState, useEffect } from 'react';
// Thêm icon FaEye để dùng cho nút "Xem"
import { FaDownload, FaSpinner, FaEye } from 'react-icons/fa'; 
import certificateApi from '../../api/certificateApi';
import { toast } from 'react-toastify';

const CertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [viewingId, setViewingId] = useState(null); // Thêm state cho trạng thái "đang xem"

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateApi.getMyCertificates();
        setCertificates(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chứng nhận:", error);
        toast.error("Không thể tải được danh sách chứng nhận.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (certificate) => {
    setDownloadingId(certificate.id);
    try {
      const response = await certificateApi.downloadCertificate(certificate.id);
      
      // === SỬA LỖI TẠI ĐÂY ===
      // Dữ liệu file blob nằm trong `response.data`, không phải `response`
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
      const link = document.createElement('a');
      link.href = url;
      const fileName = `chung-nhan-${certificate.certificateCode}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Đã tải về chứng nhận ${certificate.certificateCode}!`);
    } catch (error) {
      console.error("Lỗi khi tải file chứng nhận:", error);
      toast.error("Tải chứng nhận thất bại. Vui lòng thử lại.");
    } finally {
      setDownloadingId(null);
    }
  };

  // === THÊM HÀM MỚI ĐỂ XEM PDF ===
  const handleView = async (certificate) => {
    setViewingId(certificate.id);
    try {
        const response = await certificateApi.downloadCertificate(certificate.id);
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank'); // Mở PDF trong một tab mới
    } catch (error) {
        console.error("Lỗi khi xem file chứng nhận:", error);
        toast.error("Không thể xem chứng nhận. Vui lòng thử lại.");
    } finally {
        setViewingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <FaSpinner className="animate-spin text-4xl text-red-600" />
        <span className="ml-4 text-lg text-gray-700">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3">Chứng Nhận Hiến Máu Của Bạn</h2>
      {certificates.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Bạn chưa có chứng nhận nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Ngày Cấp</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Mã Chứng Nhận</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{new Date(cert.issueDate).toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 px-4 font-mono text-gray-700">{cert.certificateCode}</td>
                  {/* === CẬP NHẬT GIAO DIỆN NÚT BẤM === */}
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-3">
                      {/* Nút Xem */}
                      <button
                        onClick={() => handleView(cert)}
                        disabled={viewingId === cert.id}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center w-28 disabled:bg-gray-400"
                      >
                        {viewingId === cert.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaEye className="mr-2" />
                            Xem
                          </>
                        )}
                      </button>
                      {/* Nút Tải về */}
                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={downloadingId === cert.id}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center justify-center w-32 disabled:bg-gray-400"
                      >
                        {downloadingId === cert.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaDownload className="mr-2" />
                            Tải về
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;