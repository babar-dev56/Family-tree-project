import { Suspense } from "react";
import FamilyTreeClient from "./FamilyTreeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading family tree...</div>}>
      <FamilyTreeClient />
    </Suspense>
  );
}