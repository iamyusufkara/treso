import Link from "next/link";

interface SavingsGoalCardProps {
  title: string;
  saved: number;
  target: number;
  slug: string;
}

export default function SavingsGoalCard({ title, saved, target, slug }: SavingsGoalCardProps) {
  const progress = Math.round((saved / target) * 100);

  return (
    <Link href={`/saving/${slug}`} passHref>
      <div className="cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-4 rounded-xl shadow-sm w-full transition-colors">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
          <span>Ersparnis</span>
          <span>{saved.toLocaleString("de-DE")} €</span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
          <span>Ziel</span>
          <span>{target.toLocaleString("de-DE")} €</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div
            className="bg-green-600 h-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
          {progress}%
        </div>
      </div>
    </Link>
  );
}