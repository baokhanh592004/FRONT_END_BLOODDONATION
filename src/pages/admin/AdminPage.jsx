import React, { useEffect, useState, useRef } from "react";
import {
  getRequestsForAdmin,
  getAllStaffs,
  updateRequestStatus,
  sendRequestToStaff,
} from "../../api/requestApi";
import { Client } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState({});
  const [modal, setModal] = useState({ show: false, id: null, action: null, label: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const clientRef = useRef(null);
  const typeLabels = {
    NORMAL: "Bình thường",
    URGENT: "Khẩn cấp",
  };

  const fetchData = async () => {
    try {
      const [reqRes, staffRes] = await Promise.all([
        getRequestsForAdmin(),
        getAllStaffs(),
      ]);
      setRequests(reqRes.data);
      setStaffs(staffRes.data);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("❌ Biến môi trường VITE_API_URL chưa được thiết lập.");
      return;
    }
    
    const url = new URL(apiUrl);
    const host = url.host; 
    
    const client = new Client({
      brokerURL: `ws://${host}/ws?token=${token}`,
      reconnectDelay: 5000,
      debug: (str) => console.log("🐛 [STOMP DEBUG]", str),
      onConnect: () => {
        console.log("✅ [WebSocket] Admin kết nối thành công");

        client.subscribe("/topic/requests", (message) => {
          const updatedRequest = JSON.parse(message.body);

          setRequests((prev) =>
            prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
          );

          if (updatedRequest.status === "COMPLETED") {
            toast.success(`✅ Yêu cầu #${updatedRequest.id} đã được nhân viên xử lý xong`, {
              position: "top-right",
            });
          } else if (updatedRequest.status === "IN_PROGRESS") {
            toast.info(`📥 Nhân viên đã nhận yêu cầu #${updatedRequest.id}`, {
              position: "top-right",
            });
          } else {
            toast.info(`📬 Cập nhật yêu cầu #${updatedRequest.id}`, {
              position: "top-right",
            });
          }

          setTimeout(() => {
            fetchData();
          }, 200);
        });
      },
      onStompError: (frame) => {
        console.error("❌ [STOMP ERROR]", frame);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => client.deactivate();
  }, []);

  const confirmAndExecute = async () => {
    const { id, action, label } = modal;
    try {
      await updateRequestStatus(id, action);
      fetchData();
      setModal({ show: false, id: null, action: null, label: "" });
    } catch (err) {
      console.error(`❌ Lỗi ${label.toLowerCase()} yêu cầu:`, err);
    }
  };

  const openModal = (id, action, label) => {
    setModal({ show: true, id, action, label });
  };

  const handleAssign = async (reqId) => {
    const staffId = selectedStaffs[reqId];
    if (!staffId) {
      alert("⚠️ Vui lòng chọn nhân viên cho yêu cầu này");
      return;
    }
    try {
      await sendRequestToStaff(reqId, staffId, "IN_PROGRESS");
      toast.success("✅ Đã giao việc cho nhân viên", {
        position: "top-right",
      });
      fetchData();
    } catch (err) {
      console.error("❌ Lỗi giao việc:", err);
    }
  };

  const handleStaffSelect = (reqId, staffId) => {
    setSelectedStaffs((prev) => ({ ...prev, [reqId]: staffId }));
  };

  // Pagination logic
  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <p className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn {modal.label} yêu cầu #{modal.id}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAndExecute}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Đồng ý
              </button>
              <button
                onClick={() => setModal({ show: false, id: null, action: null, label: "" })}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-3xl font-extrabold mb-8 text-[#d32f2f]">
          🩸 Danh sách yêu cầu từ các trung tâm y tế
        </h2>

        {currentRequests.length === 0 ? (
          <p className="text-gray-600 text-lg">Chưa có yêu cầu nào.</p>
        ) : (
          <div className="space-y-6">
            {currentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#fff] border border-gray-200 rounded-xl shadow p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-gray-800">
                      Mã yêu cầu: <span className="text-[#d32f2f]">{req.id}</span>
                    </p>
                    <p className="text-gray-700">🚨 Loại yêu cầu: {typeLabels[req.type] || "Không xác định"}</p>
                    <p className="text-gray-700">📦 Số lượng: {req.quantity}</p>
                    <p className="text-gray-700">
                      💉 Nhóm máu: <span className="font-medium text-red-700">{req.bloodType?.type}</span>
                    </p>
                    <p className="text-gray-700">🔬 Thành phần: {req.componentType?.name}</p>
                    <p className="text-gray-700">
                      🚦 Trạng thái: <span className={`font-bold ${
                        req.status === "ACCEPTED"
                          ? "text-green-600"
                          : req.status === "REJECTED"
                          ? "text-red-600"
                          : req.status === "COMPLETED"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}>{req.status}</span>
                    </p>
                  </div>
                  
                  {/* Thay đổi ở đây: Chỉ hiển thị các nút nếu trạng thái là PENDING */}
                  {req.status === "PENDING" && (
                    <div className="flex gap-3 mt-2 md:mt-0">
                      <button
                        onClick={() => openModal(req.id, "ACCEPTED", "chấp nhận")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow"
                      >
                        ✅ Chấp nhận
                      </button>
                      <button
                        onClick={() => openModal(req.id, "REJECTED", "từ chối")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow"
                      >
                        ❌ Từ chối
                      </button>
                    </div>
                  )}

                </div>

                {req.status === "ACCEPTED" && (
                  <div className="mt-4">
                    <p className="text-green-700 font-medium mb-2">
                      Yêu cầu đã được chấp nhận ✔ Hãy giao cho một nhân viên:
                    </p>
                    <div className="flex gap-4 items-center">
                      <select
                        className="border px-3 py-2 rounded-md"
                        onChange={(e) => handleStaffSelect(req.id, e.target.value)}
                        value={selectedStaffs[req.id] || ""}
                      >
                        <option value="">-- Chọn nhân viên --</option>
                        {staffs.map((s) => (
                          <option key={s.userId} value={s.userId}>
                            {s.fullName}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(req.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        🚀 Giao việc
                      </button>
                    </div>
                  </div>
                )}

                {req.status === "REJECTED" && (
                  <p className="mt-4 text-red-700 font-medium">
                    Yêu cầu đã bị từ chối ✖
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === index + 1
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-red-500 hover:text-white`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminPage;