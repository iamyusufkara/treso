export function ProgressCard({ saved, target }: { saved: number; target: number }) {
  const progress = Math.min(100, Math.round((saved / target) * 100));

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-2">
      <h2 className="text-lg font-semibold">Fortschritt</h2>
      <div className="flex justify-between items-baseline">
        <span className="text-xl font-bold">{saved.toLocaleString("de-DE")} €</span>
        <span className="text-gray-500 font-semibold">von {target.toLocaleString("de-DE")} €</span>
      </div>
      <div className="w-full h-5 bg-gray-300 rounded overflow-hidden">
        <div
          className="h-full bg-green-600"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}