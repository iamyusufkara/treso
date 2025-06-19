"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import SavingsGoalCard from "@/components/SavingsGoalCard";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { nanoid } from "nanoid";

interface Transaction {
  date: string;
  label: string;
  amount: number;
}

interface Goal {
  title: string;
  slug: string;
  target: number;
  transactions: Transaction[];
}

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
  const stored = localStorage.getItem("treso_savings_goals");

  if (stored) {
    setGoals(JSON.parse(stored));
    setInitialized(true);
  } else {
    const allKeys = Object.keys(localStorage);
    const fallbackGoals: Goal[] = allKeys
      .filter((key) => key.startsWith("treso_goal_"))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "");
        } catch {
          return null;
        }
      })
      .filter((g): g is Goal => g !== null);

    if (fallbackGoals.length > 0) {
      setGoals(fallbackGoals);
      localStorage.setItem("treso_savings_goals", JSON.stringify(fallbackGoals));
    }

    setInitialized(true);
  }
}, []);


useEffect(() => {
  if (initialized) {
    localStorage.setItem("treso_savings_goals", JSON.stringify(goals));
  }
}, [goals, initialized]);


  const createGoal = () => {
    const title = newTitle.trim();
    const target = parseFloat(newTarget);
    if (!title || isNaN(target)) return;

    const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);
    const newGoal: Goal = {
      title,
      slug,
      target,
      transactions: [],
    };

    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    localStorage.setItem("treso_savings_goals", JSON.stringify(updatedGoals));
    localStorage.setItem("treso_goal_" + slug, JSON.stringify(newGoal));
    setNewTitle("");
    setNewTarget("");
    setIsOpen(false);
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hallo Yusuf 👋</h1>
        <Button onClick={() => setIsOpen(true)} color="primary">+ Neues Sparziel</Button>
      </div>

      {goals.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 p-10 text-center space-y-4 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold">Noch kein Sparziel</h2>
          <p className="text-gray-500">Füge dein erstes Ziel hinzu und beginne mit dem Sparen.</p>
          <Button color="primary" onClick={() => setIsOpen(true)}>
            + Sparziel erstellen
          </Button>
        </div>
      )}

      {goals.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Aktive Sparziele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <SavingsGoalCard
                key={goal.slug}
                title={goal.title}
                slug={goal.slug}
                target={goal.target}
                saved={goal.transactions.reduce((sum, t) => sum + t.amount, 0)}
              />
            ))}
          </div>
        </section>
      )}

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Neues Sparziel erstellen</ModalHeader>
          <ModalBody className="space-y-4">
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
            <Button variant="light" onClick={() => setIsOpen(false)}>
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
