"use client";

import { useEffect, useMemo, useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { db, isFirebaseConfigured } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

type Member = {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  parent?: string | null;
};

type MemberNode = Member & {
  children: MemberNode[];
};

function buildFamilyTree(members: Member[]): MemberNode[] {
  const nodes = new Map<string, MemberNode>();

  members.forEach((member) => {
    nodes.set(member.id, { ...member, children: [] });
  });

  const roots: MemberNode[] = [];

  nodes.forEach((node) => {
    if (node.parent && nodes.has(node.parent)) {
      nodes.get(node.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (items: MemberNode[]) => {
    items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    items.forEach((child) => sortNodes(child.children));
  };

  sortNodes(roots);
  return roots;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    setError(null);
    
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured");
      setLoading(false);
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, "persons"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
        age: doc.data().age as number | null,
        gender: doc.data().gender as string,
        parent: doc.data().parent as string | null,
      })) as Member[];
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch members");
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
      await deleteDoc(doc(db, "persons", id));
      alert("Member deleted successfully!");
      await fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete member");
    }
  }

  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return "None (Root)";
    const parent = members.find((m) => m.id === parentId);
    return parent ? parent.name : `ID: ${parentId}`;
  };

  const filteredMembers = members.filter((member) =>
    (member.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const familyTree = useMemo(() => buildFamilyTree(filteredMembers), [filteredMembers]);

  const renderFamilyNodes = (nodes: MemberNode[], depth = 0) => {
    return nodes.map((node) => (
      <div
        key={node.id}
        className={`tree-node ${depth === 0 ? "root-node" : ""}`}
        style={{ "--node-delay": `${depth * 80}ms` } as CSSProperties}
      >
        <div className="node-card">
          <div className="node-badge">{node.name?.charAt(0) || "?"}</div>
          <div className="node-copy">
            <div className="node-name">{node.name || "Unknown"}</div>
            <div className="node-relation">
              {node.parent ? `Child of ${getParentName(node.parent)}` : "Root member"}
            </div>
            <div className="node-note">
              {node.gender ? `${node.gender}, ` : ""}
              {node.age != null ? `${node.age} years` : "Age not set"}
            </div>
          </div>
        </div>

        {node.children.length > 0 && (
          <div className="node-children">
            {renderFamilyNodes(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Firestore Records
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Family Members
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                View and manage all members in your family tree from Firebase.
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

        {/* Family Tree Section */}
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                Family Tree Dashboard
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Visual Family Tree
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Explore your tree with a clean hierarchical layout. Each box shows member details and family connections.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search for a member"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full max-w-md"
              />
              <button
                onClick={() => router.push("/members/add")}
                className="btn btn-primary whitespace-nowrap"
              >
                + Add Member
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 mb-5">{error}</p>}

          {loading ? (
            <div className="flex justify-center py-24 text-slate-500">
              <span className="animate-pulse text-lg">Building your family tree...</span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
              <p className="text-xl font-semibold text-slate-900">No members available</p>
              <p className="mt-2 text-sm text-slate-500">Add members to begin creating a visual family tree.</p>
            </div>
          ) : (
            <section className="family-tree-sheet">
              <div className="family-tree-header">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Family tree</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Tree view</h3>
                </div>
                <p className="mt-3 max-w-2xl text-sm text-slate-600">
                  Use this layout to visualize your members and their parent-child relationships. Hover over any node for details.
                </p>
              </div>

              <div className="family-tree-root">
                {familyTree.length > 0 ? (
                  renderFamilyNodes(familyTree)
                ) : (
                  <p className="text-center text-slate-500">No root members found. Ensure at least one member has no parent.</p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}