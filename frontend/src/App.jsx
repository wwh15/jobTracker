import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

function emptyForm() {
  return {
    company: "",
    role: "",
    location: "",
    status: "APPLIED",
    applied_date: "",
    next_follow_up: "",
    link: "",
    notes: "",
  };
}

export default function App() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadApps() {
    setError("");
    const res = await fetch(`/api/applications/`);
    if (!res.ok) {
      setError(`failed to load (${res.status})`);
      return;
    }
    const data = await res.json();
    setApps(data);
  }

  useEffect(() => {
    loadApps();
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applied_date: form.applied_date || null,
          next_follow_up: form.next_follow_up || null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setError(`save failed (${res.status}): ${txt}`);
        return;
      }

      setForm(emptyForm());
      await loadApps();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setError("");
    const res = await fetch(`/api/applications/${id}/`, { method: "DELETE" });
    if (!res.ok) {
      setError(`delete failed (${res.status})`);
      return;
    }
    await loadApps();
  }

  return (
    <div style={{margin: "100px 600px", fontFamily: "system-ui" }}>
      <h1>job tracker</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            placeholder="company"
            value={form.company}
            onChange={(e) => setField("company", e.target.value)}
            required
          />
          <input
            placeholder="role"
            value={form.role}
            onChange={(e) => setField("role", e.target.value)}
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 10 }}>
          <input
            placeholder="location"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
          />
          <select value={form.status} onChange={(e) => setField("status", e.target.value)}>
            <option value="APPLIED">Applied</option>
            <option value="SCREEN">Screen</option>
            <option value="ONSITE">Onsite</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label>
            applied date
            <input
              type="date"
              value={form.applied_date}
              onChange={(e) => setField("applied_date", e.target.value)}
            />
          </label>
          <label>
            next follow up
            <input
              type="date"
              value={form.next_follow_up}
              onChange={(e) => setField("next_follow_up", e.target.value)}
            />
          </label>
        </div>

        <input
          placeholder="link"
          value={form.link}
          onChange={(e) => setField("link", e.target.value)}
        />

        <textarea
          placeholder="notes"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={4}
        />

        <button type="submit" disabled={saving}>
          {saving ? "saving..." : "add application"}
        </button>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
      </form>

      <h2>applications</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {apps.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong>
                {a.company} — {a.role}
              </strong>
              <button onClick={() => remove(a.id)}>delete</button>
            </div>

            <div>
              {a.status}
              {a.location ? ` · ${a.location}` : ""}
            </div>

            {a.link ? (
              <a href={a.link} target="_blank" rel="noreferrer">
                link
              </a>
            ) : null}

            {a.notes ? <div style={{ whiteSpace: "pre-wrap" }}>{a.notes}</div> : null}
          </div>
        ))}
        {apps.length === 0 ? <div>no applications yet</div> : null}
      </div>
    </div>
  );
}
