import React, { useEffect, useState, useRef } from "react";
import { getRequestsForStaff, updateRequestStatus } from "../../api/requestApi";
import { Client } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffPage = () => {
  const [requests, setRequests] = useState([]);
  const clientRef = useRef(null);
  const typeLabels = {
    NORMAL: "Bình thường",
    URGENT: "Khẩn cấp",
  };

  const fetchRequests = async () => {
    try {
      const res = await getRequestsForStaff();
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải yêu cầu:", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateRequestStatus(id, "COMPLETED");
      toast.success("✅ Đã đánh dấu hoàn thành yêu cầu", {
        position: "top-right",
      });
      fetchRequests();
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      toast.error("❌ Cập nhật thất bại", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Sửa lại brokerURL để sử dụng biến môi trường VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("❌ Biến môi trường VITE_API_URL chưa được thiết lập.");
      return;
    }

    const url = new URL(apiUrl);
    const host = url.host; 
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    const client = new Client({
      brokerURL: `${wsProtocol}://${host}/ws?token=${token}`,
      reconnectDelay: 5000,
      debug: (msg) => console.log("🐛 [WS DEBUG]", msg),
      onConnect: () => {
        console.log("✅ [WebSocket] Staff kết nối");

        client.subscribe("/user/queue/staff-tasks", (message) => {
          console.log("📩 [WS] Nhận nhiệm vụ mới:", message.body);
          toast.info("📥 Nhận yêu cầu mới từ Admin", {
            position: "top-right",
          });
          fetchRequests();
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

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-700">📋 Danh sách yêu cầu được giao</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">🙌 Hiện chưa có yêu cầu nào</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border border-gray-300 p-5 bg-white rounded-lg shadow"
            >
              <p className="font-semibold">🆔 Mã yêu cầu: {req.id}</p>
                 <p className="text-gray-700">
                     🚨 Loại yêu cầu:{" "}
                     {typeLabels[req.type] || "Không xác định"}
                   </p>
              <p>📦 Số lượng: {req.quantity} đơn vị</p>
              <p>💉 Nhóm máu: {req.bloodType?.type}</p>
              <p>🔬 Thành phần: {req.componentType?.name}</p>
              <p>
                🚦 Trạng thái:{" "}
                <span
                  className={`font-bold ${
                    req.status === "IN_PROGRESS"
                      ? "text-yellow-600"
                      : req.status === "COMPLETED"
                      ? "text-green-600"
                      : "text-gray-700"
                  }`}
                >
                  {req.status}
                </span>
              </p>

              {req.status === "IN_PROGRESS" && (
                <button
                  onClick={() => handleComplete(req.id)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  ✅ Đánh dấu hoàn thành
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default StaffPage;