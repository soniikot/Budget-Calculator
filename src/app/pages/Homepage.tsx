import Link from "next/link";

export default function Homepage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  return (
    <main>
      <Link href={`/budget/${currentYear}-${currentMonth}`}>
        Go to Current Month&apos;s Budget
      </Link>
    </main>
  );
}
