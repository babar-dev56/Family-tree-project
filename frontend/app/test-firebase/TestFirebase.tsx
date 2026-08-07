"use client";

import { useEffect, useState } from "react";
import { db, isFirebaseConfigured } from "../../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  const [members, setMembers] = useState<Array<{ id: string; name?: string; relation?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getFirestoreDb = () => {
    if (!db) {
      throw new Error("Firestore is not initialized. Check your Firebase configuration.");
    }
    return db;
  };

  const fetchMembers = async () => {
    setError(null);
    setStatusMessage(null);
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Check NEXT_PUBLIC_FIREBASE env vars.");
      return;
    }

    setLoading(true);
    try {
      const snapshot = await getDocs(collection(getFirestoreDb(), "members"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMembers(data as Array<{ id: string; name?: string; relation?: string }>);
      setStatusMessage(`Fetched ${data.length} member(s) from Firestore.`);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Unable to fetch members from Firestore. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const addTestMember = async () => {
    setError(null);
    setStatusMessage(null);
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Check NEXT_PUBLIC_FIREBASE env vars.");
      return;
    }

    setLoading(true);
    try {
      const dbInstance = getFirestoreDb();
      const docRef = await addDoc(collection(dbInstance, "members"), {
        name: "Test Member",
        relation: "self",
        createdAt: new Date().toISOString(),
      });
      setStatusMessage(`Added test member with ID: ${docRef.id}`);
      await fetchMembers();
    } catch (err) {
      console.error("Error adding test member:", err);
      setError("Unable to add a test member to Firestore. Check your rules and config.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Firebase Firestore Test</h1>
      <p>Collection: <strong>members</strong></p>

      <div style={{ marginBottom: 16 }}>
        <button onClick={addTestMember} disabled={loading} style={{ marginRight: 8 }}>
          Add Test Member
        </button>
        <button onClick={fetchMembers} disabled={loading}>
          Refresh Members
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {statusMessage && <p style={{ color: "green" }}>{statusMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name || "(no name)"} — {member.relation || "(no relation)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
