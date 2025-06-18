"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import SavingsGoalCard from "@/components/SavingsGoalCard";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface Goal {
  title: string;
  slug: string;
  target: number;
  transactions: { date: string; label: string; amount: number }[];
}

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");

  // ✅ Alle Sparziele aus localStorage laden
  useEffect(() => {
    const allKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("treso_goal_")
    );

    const loadedGoals: Goal[] = allKeys
      .map((key) => {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw);
          // Sicherstellen, dass alle Felder da sind
          if (
            typeof parsed.title === "string" &&
            typeof parsed.slug === "string" &&
            typeof parsed.target === "number"
          ) {
            return parsed as Goal;
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Goal[];

    setGoals(loadedGoals);
  }, []);

  const createGoal = () => {
    const title = newTitle.trim();
    const target = parseFloat(newTarget);

    if (!title || isNaN(target) || target <= 0) return;

    const slug =
      title.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);

    const newGoal: Goal = {
      title,
      slug,
      target,
      transactions: [],
    };

    // ✅ Speichern als vollständiges Objekt
    localStorage.setItem(
      `treso_goal_${slug}`,
      JSON.stringify(newGoal)
    );

    // ✅ State aktualisieren
    setGoals((prev) => [newGoal, ...prev]);

    setNewTitle("");
    setNewTarget("");
    setIsOpen(false);
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hallo Yusuf 👋</h1>
        <Button onClick={() => setIsOpen(true)} color="primary">
          + Neues Sparziel
        </Button>
      </div>

      {/* Sparziele */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Aktive Sparziele</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <SavingsGoalCard
                key={goal.slug}
                title={goal.title}
                saved={goal.transactions.reduce(
                  (sum, t) => sum + t.amount,
                  0
                )}
                target={goal.target}
                slug={goal.slug}
              />
            ))
          ) : (
            <p className="text-gray-400">
              Noch keine Sparziele vorhanden.
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Neues Sparziel erstellen</ModalHeader>
          <ModalBody>
            <Input
              label="Titel"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="z. B. Urlaub 2026"
            />
            <Input
              label="Zielbetrag (€)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="1000"
              type="number"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={() => setIsOpen(false)}
            >
              Abbrechen
            </Button>
            <Button color="primary" onClick={createGoal}>
              Sparziel speichern
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
