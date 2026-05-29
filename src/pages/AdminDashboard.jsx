import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const userData = {
    labels: ["Pzt", "Salı", "Çar", "Per", "Cuma", "Cts", "Paz"],
    datasets: [
      {
        label: "Günlük Aktif Kullanıcı",
        data: [12, 19, 7, 15, 22, 30, 25],
        backgroundColor: "#9b5cff",
        borderRadius: 6,
      },
    ],
  };

  const postData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs"],
    datasets: [
      {
        label: "Aylık Gönderi Sayısı",
        data: [40, 55, 32, 70, 90],
        borderColor: "#ff3bff",
        backgroundColor: "rgba(255, 59, 255, 0.25)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* ⭐ Grafikler YAN YANA */}
      <div className="charts-row">

        <div className="chart-box">
          <h3>Günlük Aktif Kullanıcılar</h3>
          <Bar data={userData} />
        </div>

        <div className="chart-box">
          <h3>Aylık Gönderi Sayısı</h3>
          <Line data={postData} />
        </div>

      </div>
    </div>
  );
}
