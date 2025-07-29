import React, { useState, useEffect, useRef } from "react";
import { sendRequestFromCenter, getRequestsOfCenter } from "../../api/requestApi";
import { Client } from "@stomp/stompjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CenterPage = () => {
  const [form, setForm] = useState({
    bloodTypeId: "",
    componentTypeId: "",
    quantity: "",
    type: "NORMAL",
  });

  const [status, setStatus] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const clientRef = useRef(null); // ✅ Giữ kết nối WebSocket không bị mất
  const typeLabels = {
    NORMAL: "Bình thường",
    URGENT: "Khẩn cấp",
  };
  const typeColors = {
    NORMAL: "text-gray-700",
    URGENT: "text-[#d32f2f] font-bold",
  };

  const fetchMyRequests = async () => {
    try {
      const res = await getRequestsOfCenter();
      setMyRequests(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách yêu cầu:", err);
    }
  };

  // ✅ Kết nối WebSocket chỉ 1 lần
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("📦 Center token:", token);

    if (!token) {
      console.error("❌ Không tìm thấy token. Dừng kết nối WebSocket.");
      return;
    }

    const client = new Client({
      brokerURL: `ws://localhost:8080/ws?token=${token}`,
      reconnectDelay: 5000,
      debug: (str) => console.log("🐛 [STOMP DEBUG]", str),

      onConnect: () => {
        console.log("✅ WebSocket Connected!");

        client.subscribe("/user/queue/request-status", (message) => {
          console.log("📩 Nhận cập nhật từ server:", message.body);
          const data = JSON.parse(message.body);

          toast.info(`Yêu cầu ${data.id} đã được ${data.status}`, {
            position: "top-right",
            autoClose: 3000,
          });
          // Đợi một chút để backend chắc chắn đã cập nhật DB
          setTimeout(() => {
            fetchMyRequests();
          }, 300);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      console.log("🛑 Hủy kích hoạt WebSocket");
      client.deactivate();
    };
  }, []);

  // ✅ Load dữ liệu ban đầu
  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    try {
      await sendRequestFromCenter({
        bloodTypeId: parseInt(form.bloodTypeId),
        componentTypeId: parseInt(form.componentTypeId),
        quantity: parseInt(form.quantity),
        type: form.type,
      });
      toast.success("✅ Đã gửi yêu cầu đến Admin", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchMyRequests();
    } catch (err) {
      console.error("❌ Lỗi gửi yêu cầu:", err);
      setStatus("❌ Lỗi khi gửi yêu cầu");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-2xl font-extrabold mb-6 text-[#d32f2f]">
          📤 Gửi yêu cầu máu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <select
            name="bloodTypeId"
            value={form.bloodTypeId}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm"
          >
            <option value="">-- Chọn nhóm máu --</option>
            <option value="1">A+</option>
            <option value="2">A-</option>
            <option value="5">AB+</option>
            <option value="6">AB-</option>
            <option value="3">B+</option>
            <option value="4">B-</option>
            <option value="7">O+</option>
            <option value="8">O-</option>
          </select>

          <select
            name="componentTypeId"
            value={form.componentTypeId}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm"
          >
            <option value="">-- Chọn thành phần máu --</option>
            <option value="1">Plasma</option>
            <option value="2">Platelets</option>
            <option value="3">Red Blood Cells</option>
            <option value="4">Whole Blood</option>
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Số lượng"
            value={form.quantity}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm"
          >
            <option value="NORMAL">Bình Thường</option>
            <option value="URGENT">Khẩn cấp</option>
          </select>
        </div>

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow"
        >
          🚀 Gửi yêu cầu
        </button>

        {status && (
          <p className="mt-3 text-sm text-gray-600 italic">{status}</p>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-xl rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-[#d32f2f] mb-4">
          📋 Danh sách yêu cầu của bạn
        </h3>
        {myRequests.length === 0 ? (
          <p className="text-gray-500">Bạn chưa gửi yêu cầu nào.</p>
        ) : (
          <div className="space-y-4">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="border border-gray-200 p-5 rounded-xl bg-white shadow hover:shadow-md transition"
              >
                <p>
                  <strong className="text-gray-700">🆔 Mã yêu cầu:</strong>{" "}
                  <span className="text-[#d32f2f] font-bold">{req.id}</span>
                </p>
                <p>
                  <strong className="text-gray-700">🚨 Loại yêu cầu:</strong>{" "}
                  <span className={typeColors[req.type] || "text-gray-500"}>
                    {typeLabels[req.type] || "Không xác định"}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-700">💉 Nhóm máu:</strong>{" "}
                  {req.bloodType?.type}
                </p>
                <p>
                  <strong className="text-gray-700">🔬 Thành phần:</strong>{" "}
                  {req.componentType?.name}
                </p>
                <p>
                  <strong className="text-gray-700">📦 Số lượng:</strong>{" "}
                  {req.quantity}
                </p>
                <p>
                  <strong className="text-gray-700">🚦 Trạng thái:</strong>{" "}
                  <span
                    className={`font-semibold ${req.status === "PENDING"
                        ? "text-yellow-600"
                        : req.status === "REJECTED"
                          ? "text-red-600"
                          : req.status === "COMPLETED"
                            ? "text-blue-600"
                            : "text-green-600"
                      }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterPage;
