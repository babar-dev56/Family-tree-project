"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Member = {
  id: number;
  name: string;
  age: number | null;
  gender: string;
  parent_id: number | null;
};

type FamilyTreeNode = Member & {
  children: FamilyTreeNode[];
};

export default function FamilyTreePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <FamilyTreeContent />
    </Suspense>
  );
}

function FamilyTreeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rootIdParam = searchParams.get("rootId");

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedRootId, setSelectedRootId] = useState<string>("");
  const [treeData, setTreeData] = useState<FamilyTreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  // Load all members to populate root choices
  useEffect(() => {
    fetch(`${API}/members`)
      .then((res) => res.json())
      .then((resBody) => {
        if (resBody && resBody.success && Array.isArray(resBody.data)) {
          setMembers(resBody.data);
          
          // Select default root (first member with parent_id === null, or first member)
          if (resBody.data.length > 0) {
            const rootAncestor = resBody.data.find((m: Member) => m.parent_id === null);
            const defaultId = rootIdParam || (rootAncestor ? String(rootAncestor.id) : String(resBody.data[0].id));
            setSelectedRootId(defaultId);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading members list:", err);
      });
  }, [rootIdParam]);

  // Load the recursive tree when selectedRootId changes
  useEffect(() => {
    if (!selectedRootId) return;

    setLoading(true);
    setError(null);

    fetch(`${API}/members/${selectedRootId}/family-tree`)
      .then((res) => res.json())
      .then((resBody) => {
        if (resBody && resBody.success && resBody.data) {
          setTreeData(resBody.data);
        } else {
          setError("Failed to load tree structure.");
          setTreeData(null);
        }
      })
      .catch((err) => {
        console.error("Error loading family tree:", err);
        setError("Network error fetching family tree.");
        setTreeData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRootId]);

  function handleRootChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextId = e.target.value;
    setSelectedRootId(nextId);
    router.push(`/family-tree?rootId=${nextId}`);
  }

  // Recursive Tree Node Renderer
  function TreeNodeComponent({ node, level }: { node: FamilyTreeNode; level: number }) {
    // Generate delay variable for nice staggering transition effect
    const style = { "--node-delay": `${level * 100}ms` } as React.CSSProperties;

    // Pick visual icon or initial for the avatar badge
    const initial = node.name.charAt(0).toUpperCase();

    // Map genders to distinct colors for the node badge
    const badgeBg =
      node.gender.toLowerCase() === "male"
        ? "radial-gradient(circle at 20% 20%, #93c5fd, #2563eb)"
        : node.gender.toLowerCase() === "female"
        ? "radial-gradient(circle at 20% 20%, #fbcfe8, #db2777)"
        : "radial-gradient(circle at 20% 20%, #d9f99d, #65a30d)";

    return (
      <div className={`tree-node ${level === 0 ? "root-node" : ""}`} style={style}>
        <div className="node-card border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:-translate-y-0.5 transition duration-300">
          <div
            className="node-badge flex items-center justify-center text-white font-bold text-lg"
            style={{ background: badgeBg }}
          >
            {initial}
          </div>
          <div className="node-copy">
            <div className="node-name text-slate-800">{node.name}</div>
            <div className="node-relation text-slate-500 capitalize">
              {level === 0 ? "Root Ancestor" : `${node.gender} (Gen ${level + 1})`}
            </div>
            {node.age !== null && (
              <div className="node-note text-slate-400">
                Age: {node.age}
              </div>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="node-children">
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Visual Tree</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Family Tree Browser</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Visualize and explore generational branches and descendants dynamically.
              </p>
            </div>
            
            {/* Root selector */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <label htmlFor="root-select" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Root:
              </label>
              <select
                id="root-select"
                value={selectedRootId}
                onChange={handleRootChange}
                className="input py-2 px-3 border-slate-300/80 text-sm font-medium text-slate-800 bg-slate-50 w-52"
              >
                <option value="">Choose root member</option>
                {members.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name} {m.parent_id === null ? "(Root)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tree Container Sheet */}
        <div className="family-tree-sheet overflow-x-auto min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="text-slate-500 animate-pulse">Building family tree visualization...</div>
          ) : error ? (
            <div className="text-rose-500 font-medium">{error}</div>
          ) : treeData ? (
            <div className="family-tree-root select-none py-6">
              <TreeNodeComponent node={treeData} level={0} />
            </div>
          ) : (
            <div className="text-slate-400 text-center">
              <p className="text-lg font-medium">No family records selected.</p>
              <p className="text-sm">Please add members or select a different root ancestor.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
