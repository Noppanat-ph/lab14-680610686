import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

export default function DashboardPage() {
  const data = localStorage.getItem("registrants");

  const registrants: Registrant[] = data ? JSON.parse(data) : [];

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {/* Conditional Rendering + Render Component */}
      {registrants.length === 0 ? (
        <p>ยังไม่มีผู้ลงทะเบียน</p>
      ) : (
        <div className="mt-3">
          <label className="form-label">
            ผู้ลงทะเบียนแล้ว ({registrants.length} คน)
          </label>
          <div className="d-flex flex-column gap-2">
            {registrants.map((r) => (
              <UserRegisterCard key={r.id} registrant={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
