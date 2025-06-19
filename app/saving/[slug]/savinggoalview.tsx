"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { PiggyBank } from "lucide-react";
import Link from "next/link";
import { ProgressCard } from "@/components/ProgressCard";

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
  const [transactions, setTransactions] = useState<Transaction[]>(
    goal.transactions,
  );
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [action, setAction] = useState("deposit");
  const router = useRouter();

  const key = `treso_goal_${goal.slug}`;

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ ...goal, transactions }));
  }, [transactions]);

  const handleTransaction = () => {
    const parsed = parseFloat(amount);

    if (!label.trim() || isNaN(parsed)) return;

    const signedAmount = action === "withdraw" ? -Math.abs(parsed) : parsed;

    setTransactions([
      ...transactions,
      {
        label: label.trim(),
        amount: signedAmount,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setAmount("");
    setLabel("");
    setAction("deposit");
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmTitle !== goal.title) return;
    localStorage.removeItem(key);
    router.push("/");
  };

  const saved = transactions.reduce((sum, t) => sum + t.amount, 0);
  const progress = Math.round((saved / goal.target) * 100);

  return (
    <div className="space-y-8 mx-auto p-6">
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        <Button color="success">← Zurück zum Dashboard</Button>
      </Link>
      <h1 className="text-3xl font-bold">{goal.title}</h1>

      <ProgressCard saved={saved} target={goal.target} />

      <Button color="primary" onClick={() => setIsModalOpen(true)}>
        Neue Buchung
      </Button>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Historie</h2>
          <span className="text-green-700 cursor-pointer text-sm font-medium">
            Alle ansehen
          </span>
        </div>
        <ul className="space-y-2">
          {transactions.map((t, idx) => (
            <li
              key={idx}
              className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
            >
              <div className="bg-green-600 p-2 rounded-full">
                <PiggyBank className="text-white w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold leading-tight">{t.label}</p>
                <p className="text-sm text-gray-500">{t.amount} €</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-right">
        <Button
          color="danger"
          variant="light"
          onClick={() => setIsDeleteOpen(true)}
        >
          Sparziel löschen
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>Neue Buchung</ModalHeader>
          <ModalBody className="space-y-4">
            <Select
              label="Art der Buchung"
              selectedKeys={[action]}
              onSelectionChange={(keys) =>
                setAction(Array.from(keys)[0] as string)
              }
            >
              <SelectItem key="deposit">Einzahlung</SelectItem>
              <SelectItem key="withdraw">Auszahlung</SelectItem>
            </Select>
            <Input
              placeholder="Beschreibung (z. B. Bonus)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Input
              placeholder="Betrag (€)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsModalOpen(false)}>
              Abbrechen
            </Button>
            <Button color="primary" onClick={handleTransaction}>
              Buchen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <ModalContent>
          <ModalHeader>Sparziel löschen</ModalHeader>
          <ModalBody>
            <p>Bitte gib den Namen des Sparziels ein, um es zu löschen:</p>
            <Input
              placeholder={goal.title}
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsDeleteOpen(false)}>
              Abbrechen
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Endgültig löschen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
