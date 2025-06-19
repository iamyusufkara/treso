"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SavingsGoalView from "./savinggoalview";

export default function Page() {
  const params = useParams();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : typeof params.slug === "string"
      ? params.slug
      : "";

  const [goal, setGoal] = useState<any | null>(null);
  const [debug, setDebug] = useState<string>("");

  useEffect(() => {
    setDebug("🔍 useEffect läuft");

    if (!slug) {
      setDebug("❌ Kein Slug vorhanden");
      return;
    }

    const key = `treso_goal_${slug}`;
    setDebug((d) => d + `\n📦 Suche in localStorage unter: ${key}`);

    const raw = localStorage.getItem(key);

    if (!raw) {
      setDebug((d) => d + `\n❌ Kein Eintrag im localStorage gefunden.`);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setGoal(parsed);
      setDebug((d) => d + `\n✅ Sparziel geladen: ${parsed.title}`);
    } catch (err) {
      setDebug((d) => d + `\n❌ Fehler beim Parsen: ${err}`);
    }
  }, [slug]);

  return (
  <div className="p-6 max-w-2xl mx-auto space-y-6">
    <h1 className="text-2xl font-bold">Sparziel Detailansicht</h1>

    <pre className="bg-black text-green-400 p-4 rounded text-sm whitespace-pre-wrap">
      {debug}
    </pre>

    {goal ? (
      <SavingsGoalView goal={goal} />
    ) : (
      <div className="text-yellow-400 font-medium">
        ⚠️ Sparziel nicht gefunden:{" "}
        <span className="text-white">{slug || "unbekannt"}</span>
      </div>
    )}
  </div>
);
}
