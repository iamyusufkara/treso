"use client";

import { useEffect, useState } from "react";
import {
  Modal, ModalBody, ModalContent, ModalHeader, ModalFooter,
} from "@heroui/modal";
import { PiggyBank } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

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

export default function SavingsGoalView({ goal }: { goal: Goal }) {
  const storageKey = `treso_goal_${goal.slug}`;

  const [transactions, setTransactions] = useState<Transaction[]>(goal.transactions);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState<"deposit" | "withdraw">("deposit");

  // ✅ Lade aus localStorage beim ersten Rendern
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      } catch (err) {
        console.warn("Invalid local data for", storageKey);
      }
    }
  }, [storageKey]);

  // ✅ Speichern bei jeder Änderung
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [transactions, storageKey]);

  const totalSaved = transactions.reduce((sum, t) => sum + t.amount, 0);
  const progress = Math.round((totalSaved / goal.target) * 100);

  const handleAction = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    const newTransaction: Transaction = {
      date: new Date().toISOString().split("T")[0],
      label: actionType === "deposit" ? "Einzahlung" : "Auszahlung",
      amount: actionType === "deposit" ? parsed : -parsed,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setAmount("");
    setIsOpen(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{goal.title}</h1>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        <div className="flex justify-between mb-1">
          <span className="font-semibold">Fortschritt</span>
          <span className="text-sm text-gray-600">von {goal.target.toLocaleString("de-DE")} €</span>
        </div>
        <div className="text-xl font-bold text-green-700 mb-2">
          {totalSaved.toLocaleString("de-DE")} €
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-600 h-3 rounded-full overflow-hidden">
          <div className="bg-green-600 h-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{progress}%</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => { setActionType("deposit"); setIsOpen(true); }} color="success">Einzahlen</Button>
        <Button onClick={() => { setActionType("withdraw"); setIsOpen(true); }} color="danger">Auszahlen</Button>
      </div>

      {/* Historie */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Historie</h2>
        <ul className="space-y-4">
          {transactions.map((t, i) => (
            <li key={i} className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="bg-green-600 text-white rounded-full p-3 mr-4">
                <PiggyBank size={24} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.label}</div>
                <div className={`text-sm ${t.amount >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {t.amount >= 0 ? "+" : "-"}{Math.abs(t.amount).toLocaleString("de-DE")} €
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>{actionType === "deposit" ? "Einzahlen" : "Auszahlen"}</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Betrag in €"
              min={1}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsOpen(false)}>
              Abbrechen
            </Button>
            <Button color={actionType === "deposit" ? "success" : "danger"} onClick={handleAction}>
              Bestätigen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
