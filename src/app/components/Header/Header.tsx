import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-2xl font-bold">
        Budget App
      </Link>
    </div>
  );
};

export default Header;
