"use client"; // wichtig, da wir localStorage verwenden

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import SavingsGoalView from "./savinggoalview";

export default function Page() {
  const { slug } = useParams();
  const [goal, setGoal] = useState<any | null>(null);

  useEffect(() => {
    const storageKey = "treso_savings_goals";
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const allGoals = JSON.parse(stored);
      const found = allGoals.find((g: any) => g.slug === slug);
      setGoal(found || null);
    }
  }, [slug]);

  if (!goal) {
    return <div className="p-6">⚠️ Sparziel nicht gefunden: {slug}</div>;
  }

  return <SavingsGoalView goal={goal} />;
}