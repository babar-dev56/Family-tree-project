"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditMemberPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    parent_id: "",
    notes: "",
  });

  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Updated Member:", form);
    alert("Update button clicked!");
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Family Records
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Edit Member
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Update the details of an existing family member.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/members")}
              className="btn btn-muted"
            >
              ← Back
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">

          {/* Basic Information */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md">

            <h2 className="text-xl font-semibold text-slate-900">
              Member Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Edit the member information below.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter full name"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={onChange}
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  className="input"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Parent ID
                </label>

                <input
                  type="number"
                  name="parent_id"
                  value={form.parent_id}
                  onChange={onChange}
                  placeholder="Parent ID"
                  className="input"
                />
              </div>

            </div>
          </section>

          {/* Notes */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md">

            <h2 className="text-xl font-semibold">
              Additional Notes
            </h2>

            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={5}
              placeholder="Write notes..."
              className="input mt-4"
            />

          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.push("/members")}
              className="btn btn-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}