import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout (){
    const navigate = useState();
    
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

    return(
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>Admin Panel</h2>
                <nav>
                    <ul style={styles.nav}>
                        <li><link to="/admin/profile">Hồ sơ</link></li>
                        <li><link to="/admin/dashboard">Dashboard</link></li>
                        <li><link to="/admin/users">Quản lý tài khoản<nav></nav></link></li>
                        <li><link to="/admin/blood">Quản lý kho máu<nav></nav></link></li>
                        <li><button onClick={handleLogout} style={styles.logout}>Đăng xuất</button></li>


                    </ul>
                </nav>

            </aside>
            <main style={styles.content}>
                <Outlet/>
            </main>

        </div>
    );

}
    const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 220,
    backgroundColor: "#d32f2f",
    padding: 20,
    color: "white",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
  },
  nav: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logout: {
    marginTop: 10,
    padding: "8px 12px",
    border: "none",
    borderRadius: 4,
    background: "#fff",
    color: "#d32f2f",
    cursor: "pointer",
  },
};
