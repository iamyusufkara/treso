"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SavingsGoalView from "./savinggoalview";
import { Spinner } from "@heroui/spinner";

export default function Page() {
  const params = useParams();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : typeof params.slug === "string"
      ? params.slug
      : "";

  const [goal, setGoal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const key = `treso_goal_${slug}`;
    const raw = localStorage.getItem(key);

    if (!raw) {
      setGoal(null);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setGoal(parsed);
    } catch (err) {
      setGoal(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {goal ? (
        <SavingsGoalView goal={goal} />
      ) : (
        <div className="text-yellow-400 font-medium">
          ⚠️ Sparziel nicht gefunden: <span className="text-white">{slug || "unbekannt"}</span>
        </div>
      )}
    </div>
  );
}
