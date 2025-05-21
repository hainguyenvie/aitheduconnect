import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Create a separate Supabase client for admin auth
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { storageKey: "sb-admin-auth" } }
);

// Type for teacher application
interface TeacherApplication {
  id: string | number;
  user_id: string;
  specialization: string;
  motivation: string;
  status: string;
  created_at: string;
}

const TeacherApplicationsAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);

  const fetchApplications = async () => {
    const { data: apps } = await supabaseAdmin
      .from("teacher_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications(apps || []);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: loginError } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError("Login failed: " + loginError.message);
      setLoading(false);
      return;
    }
    // Check admin role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (profileError || profile?.role !== "admin") {
      setError("You are not an admin.");
      setLoading(false);
      return;
    }
    setUser(data.user);
    setIsAdmin(true);
    await fetchApplications();
    setLoading(false);
  };

  const handleAction = async (app: TeacherApplication, status: "approved" | "rejected") => {
    setActionLoading(app.id);
    setError("");
    // Update application status
    const { error: updateError } = await supabaseAdmin
      .from("teacher_applications")
      .update({ status })
      .eq("id", app.id);
    if (updateError) {
      setError("Failed to update application status: " + updateError.message);
      setActionLoading(null);
      return;
    }
    // If approved, update user role
    if (status === "approved") {
      const { error: roleError } = await supabaseAdmin
        .from("profiles")
        .update({ role: "teacher" })
        .eq("id", app.user_id);
      if (roleError) {
        setError("Failed to update user role: " + roleError.message);
        setActionLoading(null);
        return;
      }
    }
    await fetchApplications();
    setActionLoading(null);
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
          <button type="submit" style={{ width: "100%", padding: 8 }} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 0, background: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Teacher Applications</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {applications.length === 0 ? (
        <div style={{ textAlign: "center" }}>No applications found.</div>
      ) : (
        applications.map((app) => (
          <div key={app.id} style={{ border: "1px solid #eee", borderRadius: 8, marginBottom: 16, padding: 16, background: "#fafbfc" }}>
            <div><b>ID:</b> {app.id}</div>
            <div><b>User ID:</b> {app.user_id}</div>
            <div><b>Specialization:</b> {app.specialization}</div>
            <div><b>Motivation:</b> {app.motivation}</div>
            <div><b>Status:</b> {app.status}</div>
            <div><b>Created At:</b> {app.created_at}</div>
            {app.status === "pending" && (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleAction(app, "approved")}
                  disabled={!!actionLoading}
                  style={{ padding: "6px 16px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 4, cursor: actionLoading ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === app.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(app, "rejected")}
                  disabled={!!actionLoading}
                  style={{ padding: "6px 16px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: actionLoading ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === app.id ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherApplicationsAdmin; 