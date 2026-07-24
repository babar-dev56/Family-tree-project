"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type FormData = {
  name: string;
  age: string;
  gender: string;
  parent_id: string;
};

type Member = {
  id: number;
  name: string;
  parent_id?: number | null;
};

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  const [form, setForm] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    parent_id: "",
  });

  const [members, setMembers]       = useState<Member[]>([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // ── GET: Existing data load karo ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberRes, allMembersRes] = await Promise.all([
          fetch(`${API}/members/${id}`),
          fetch(`${API}/members`),
        ]);

        const memberJson     = await memberRes.json();
        const allMembersJson = await allMembersRes.json();

        if (memberJson.success && memberJson.data) {
          const m = memberJson.data;
          setForm({
            name:      m.name      ?? "",
            age:       String(m.age ?? ""),
            gender:    m.gender    ?? "",
            parent_id: m.parent_id ? String(m.parent_id) : "",
          });
        }

        if (allMembersJson.success && Array.isArray(allMembersJson.data)) {
          setMembers(
            allMembersJson.data.filter((m: Member) => m.id !== Number(id))
          );
        }
      } catch (err) {
        setError("Could not load member data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ── onChange ──
  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  // ── PUT: Update ──
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) { setError("Name is required.");   return; }
    if (!form.age)          { setError("Age is required.");    return; }
    if (!form.gender)       { setError("Gender is required."); return; }

    setSubmitting(true);

    try {
      const payload = {
        name:      form.name.trim(),
        age:       parseInt(form.age, 10),
        gender:    form.gender,
        parent_id: form.parent_id
          ? parseInt(form.parent_id, 10)
          : null,
      };

      const res  = await fetch(`${API}/members/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.errors ? json.errors.join(", ") : json.message
        );
      }

      router.push("/members");

    } catch (err: any) {
      setError(err.message || "Could not update member.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── DELETE ──
  async function onDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmed) return;

    try {
      const res  = await fetch(`${API}/members/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Could not delete.");
      }

      router.push("/members");
    } catch (err: any) {
      setError(err.message || "Could not delete member.");
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm animate-pulse">
          Loading member data...
        </p>
      </div>
    );
  }

  // ── JSX ──
  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Edit member
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                Update details
              </h1>
            </div>
            <button
              type="button"
              onClick={() => router.push("/members")}
              className="text-sm text-slate-500 border border-slate-200
                         rounded-lg px-4 py-2 hover:bg-slate-50"
            >
              ← Back to members
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200
                          rounded-xl px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 space-y-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter full name"
                className="input mt-1 w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={onChange}
                  min={0}
                  className="input mt-1 w-full"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  className="input mt-1 w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Parent */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Parent
              </label>
              <select
                name="parent_id"
                value={form.parent_id}
                onChange={onChange}
                className="input mt-1 w-full"
              >
                <option value="">No parent (root member)</option>
                {members.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onDelete}
              className="text-sm text-rose-600 bg-rose-50 border
                         border-rose-200 rounded-lg px-4 py-2
                         hover:bg-rose-100 transition"
            >
              🗑 Delete member
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/members")}
                className="btn btn-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}