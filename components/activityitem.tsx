import { PiggyBank } from "lucide-react"; // Optionales Icon (Heroicons oder Lucide)

interface ActivityItemProps {
  label: string;
  amount: number;
}

export default function ActivityItem({ label, amount }: ActivityItemProps) {
  return (
    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm w-full">
      <div className="bg-green-600 text-white rounded-full p-3 mr-4">
        <PiggyBank size={24} />
      </div>
      <div>
        <div className="text-base font-semibold text-gray-900 dark:text-white">{label}</div>
        <div className="text-green-600 dark:text-green-400">
          {amount.toLocaleString("de-DE")} €
        </div>
      </div>
    </div>
  );
}
