import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// CREATE - Add a new person
export const addPerson = async (personData) => {
  try {
    console.log("Adding person:", personData);
    const docRef = await addDoc(collection(db, "persons"), personData);
    console.log("Person added with ID:", docRef);
    return { id: docRef.id, ...personData };
  } catch (error) {
    console.error("Error adding person:", error);
    throw error;
  }
};

// READ - Get all persons
export const getAllPersons = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "persons"));
    const persons = [];
    querySnapshot.forEach((doc) => {
      persons.push({ id: doc.id, ...doc.data() });
    });
    return persons;
  } catch (error) {
    console.error("Error getting persons:", error);
    throw error;
  }
};

// READ - Get single person by ID
export const getPerson = async (id) => {
  try {
    const docRef = doc(db, "persons", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting person:", error);
    throw error;
  }
};

// UPDATE - Modify a person
export const updatePerson = async (id, updates) => {
  try {
    const docRef = doc(db, "persons", id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  } catch (error) {
    console.error("Error updating person:", error);
    throw error;
  }
};

// DELETE - Remove a person
export const deletePerson = async (id) => {
  try {
    await deleteDoc(doc(db, "persons", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};