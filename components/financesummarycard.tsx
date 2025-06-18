interface FinanceSummaryCardProps {
  title: string;
  amount: number;
  isPositive?: boolean;
}

export default function FinanceSummaryCard({
  title,
  amount,
  isPositive = true,
}: FinanceSummaryCardProps) {
  const amountFormatted = amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm w-full">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p
        className={`text-2xl font-bold mt-2 ${isPositive ? "text-green-600" : "text-red-500"}`}
      >
        {amountFormatted}
      </p>
    </div>
  );
}