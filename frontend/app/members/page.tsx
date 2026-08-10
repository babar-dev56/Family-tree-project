"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPersons, deletePerson } from "../../lib/firestoreService";

type Member = {
  id: string;
  name: string;
  age: number | null;
  gender: string;
  parent?: string | null;
};

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const data = await getAllPersons();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deletePerson(id);
      alert("Member deleted successfully!");
      fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete member.");
    }
  }

  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return "None (Root)";
    const parent = members.find((m) => m.id === parentId);
    return parent ? parent.name : `ID: ${parentId}`;
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-6xl">

        {/* Header Section */}
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Database Records
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Family Members
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                View, manage, and explore the connections between all members in your family registry.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/members/add")}
                className="btn btn-primary"
              >
                + Add Member
              </button>
           
            </div>
          </div>
        </div>

        {/* Filter & Listing Section */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input max-w-md"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12 text-slate-500">
              <span className="animate-pulse">Loading members registry...</span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">No family members found.</p>
              <p className="mt-1 text-sm">
                Add a new member or modify your search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/55 transition duration-150"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-500">
                        #{member.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                        {member.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {member.age !== null ? member.age : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 capitalize">
                        {member.gender}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {getParentName(member.parent)}
                      </td>

                      {/* ── Actions Column ── */}
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">

                        {/* View Tree */}
                        <button
                          onClick={() =>
                            router.push(`/family-tree?rootId=${member.id}`)
                          }
                          className="text-emerald-600 hover:text-emerald-900 px-2 py-1 rounded hover:bg-emerald-50 transition"
                        >
                          View Tree
                        </button>

                        {/* ✅ Edit Button */}
                        <button
                          onClick={() =>
                            router.push(`/members/${member.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(member.id, member.name)
                          }
                          className="text-rose-600 hover:text-rose-900 px-2 py-1 rounded hover:bg-rose-50 transition"
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}