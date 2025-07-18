import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get("/staff/dashboard/statistics");
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Bảng điều khiển</h1>

      <div style={styles.statGrid}>
        <StatCard title="Tổng đơn vị máu" value={stats?.totalDonatedUnits || 0} color="#3f51b5" />
        <StatCard title="Yêu cầu khẩn cấp" value={stats?.urgentRequestsCount || 0} color="#f44336" />
        <StatCard title="Người hiến máu hôm nay" value={stats?.donorsTodayCount || 0} color="#4caf50" />
        <StatCard title="Đơn vị máu sẵn có" value={stats?.availableBloodUnits || 0} color="#9c27b0" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={{ ...styles.card, backgroundColor: color }}>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    color: "#222",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginBottom: 30,
  },
  card: {
    color: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
};
