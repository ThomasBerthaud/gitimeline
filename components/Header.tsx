import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <div className="p-4 border-b w-full flex">
      <Link href={'/'} className="cursor-pointer">
        <span className="p-2 font-bold text-xl">Gitimeline</span>
      </Link>
    </div>
  );
};
