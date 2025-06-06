import { useEffect, useState } from "react";

export default function AdminProfile(){
    const [user, setUser] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) setUser(JSON.parse(data));

    }, []);

    if (!user) return <p>Đang tải....</p>;

    return(
        <div style={styles.container}>
            <h2 style={styles.title}> Hồ Sơ Cá Nhân</h2>
            <div style={styles.infoRow}><strong> Họ tên:</strong> {user.name}</div> 
            <div style={styles.infoRow}><strong> Email:</strong> {user.email}</div> 
            <div style={styles.infoRow}><strong> Vai trò:</strong> {user.role}</div>
            <button style={styles.btn} onClick={() => alert("Chức năng chỉnh sữa")}>Chỉnh sữa thông tin</button> 
        </div>
    );
}
    const styles = {
        container: {
    margin: "auto",
    width: 400,
    padding: 20,
    boxShadow: "0 0 10px #ddd",
    background: "#fff",
    borderRadius: 10,
    marginTop: 50,
    fontFamily: "Arial",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  infoRow: { marginBottom: 10 },
  btn: {
    marginTop: 20,
    backgroundColor: "#d32f2f",
    color: "white",
    padding: 10,
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
    };
    
