"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { nanoid } from "nanoid";

import SavingsGoalCard from "@/components/SavingsGoalCard";

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
  const [error, setError] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("treso_user_name");
    if (!storedName) {
      setShowOnboarding(true);
    } else {
      setName(storedName);
    }
  }, []);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem("treso_user_name", tempName);
      setName(tempName);
      setShowOnboarding(false);
    }
  };

  useEffect(() => {
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

    setGoals(fallbackGoals);
    localStorage.setItem("treso_savings_goals", JSON.stringify(fallbackGoals));
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("treso_savings_goals", JSON.stringify(goals));
    }
  }, [goals, initialized]);

  const createGoal = () => {
    if (goals.length >= 6) {
      setError("🤑 Du hast bereits 6 Sparziele! Hast du einen Goldesel im Keller?");
      return;
    }

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
    localStorage.setItem("treso_goal_" + slug, JSON.stringify(newGoal));
    setNewTitle("");
    setNewTarget("");
    setError("");
    setIsOpen(false);
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hallo {name || "..."} 👋</h1>
        <Button color="primary" onClick={() => setIsOpen(true)}>
          + Neues Sparziel
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Du kannst bis zu <strong>6 Sparziele</strong> erstellen (aktuell: <strong>{goals.length}</strong>) – außer du hast ein Sparkonto auf dem Mars 🚀
      </p>

      {goals.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 p-10 text-center space-y-4 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold">Noch kein Sparziel</h2>
          <p className="text-gray-500">
            Füge dein erstes Ziel hinzu und beginne mit dem Sparen.
          </p>
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
                saved={goal.transactions.reduce((sum, t) => sum + t.amount, 0)}
                slug={goal.slug}
                target={goal.target}
                title={goal.title}
              />
            ))}
          </div>
        </section>
      )}

      {/* Onboarding Modal */}
      <Modal isOpen={showOnboarding} isDismissable={false} hideCloseButton>
        <ModalContent>
          <ModalHeader>Willkommen bei TRESO 🎉</ModalHeader>
          <ModalBody className="space-y-4">
            <p>Wie dürfen wir dich nennen?</p>
            <Input
              autoFocus
              label="Dein Name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleNameSubmit}>
              Los geht&apos;s
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Neues Sparziel */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Neues Sparziel erstellen</ModalHeader>
          <ModalBody className="space-y-4">
            {error && (
              <div className="text-red-500 font-medium text-sm bg-red-100 rounded p-2">
                {error}
              </div>
            )}
            <Input
              label="Titel"
              placeholder="z. B. Urlaub 2026"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              label="Zielbetrag (€)"
              placeholder="1000"
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
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
