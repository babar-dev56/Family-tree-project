"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

type Member = {
  id: string;
  name: string;
  parent?: string | null;
};

export default function AddMemberPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    parent: "",
    notes: "",
  });

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoadingMembers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "persons"));
      const data: Member[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, name: doc.data().name, parent: doc.data().parent });
      });
      setMembers(data);
      console.log("Fetched members:", data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        age: form.age ? parseInt(form.age, 10) : null,
        gender: form.gender,
        parent: form.parent || null,
        notes: form.notes || "",
      };

      console.log("Adding member with payload:", payload);

      const docRef = await addDoc(collection(db, "persons"), payload);
      console.log("Member added with ID:", docRef.id);

      alert("Member added successfully!");
      router.push("/members");
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Could not add member. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Family records</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Add a new family member</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Create a complete profile and link the person to the right branch of your family tree.</p>
            </div>
            <button type="button" onClick={() => router.push('/members')} className="btn btn-muted self-start">
              ← Back to members
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Member information</h2>
                <p className="mt-1 text-sm text-slate-500">Enter the core details for this new member.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Required
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="col-span-1 sm:col-span-2">
                <div className="mb-1 text-sm font-medium text-slate-700">Full name <span className="text-rose-600">*</span></div>
                <input name="name" value={form.name} onChange={onChange} required placeholder="Enter full name" className="input" />
              </label>

              <label>
                <div className="mb-1 text-sm font-medium text-slate-700">Age</div>
                <input name="age" value={form.age} onChange={onChange} type="number" min={0} placeholder="Enter age" className="input" />
              </label>

              <label>
                <div className="mb-1 text-sm font-medium text-slate-700">Gender <span className="text-rose-600">*</span></div>
                <select name="gender" value={form.gender} onChange={onChange} required className="input">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="sm:col-span-3">
                <div className="mb-1 text-sm font-medium text-slate-700">Parent</div>
                <select name="parent" value={form.parent} onChange={onChange} className="input">
                  <option value="">Select parent (optional for a root member)</option>
                  {loadingMembers ? <option>Loading...</option> : members.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">If no parent is selected, this member will be considered as a root member.</p>
              </label>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <h3 className="text-md font-semibold text-slate-900">Additional information</h3>
            <p className="mt-1 text-sm text-slate-500">Add optional context such as notes or reminders.</p>
            <label className="mt-4 block">
              <div className="mb-1 text-sm font-medium text-slate-700">Notes</div>
              <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Enter any additional notes about this member" className="input h-28" />
            </label>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <h3 className="text-md font-semibold text-slate-900">Family preview</h3>
            <p className="mt-1 text-sm text-slate-500">Choose a parent to see the existing siblings in that branch.</p>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              {form.parent ? (
                <div>
                  <div className="mb-2 font-medium text-slate-800">Siblings with the same parent</div>
                  <ul className="list-disc space-y-1 pl-5">
                    {members.filter((m) => m.parent === form.parent).length > 0 ? (
                      members
                        .filter((m) => m.parent === form.parent)
                        .map((s) => (
                          <li key={s.id} className="py-1">{s.name}</li>
                        ))
                    ) : (
                      <li className="text-sm text-slate-500">No siblings found for the selected parent.</li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-slate-500">Select a parent above to view existing siblings.</div>
              )}
            </div>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button type="button" onClick={() => router.push('/members')} className="btn btn-muted">Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-3d">
              {submitting ? 'Adding...' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}