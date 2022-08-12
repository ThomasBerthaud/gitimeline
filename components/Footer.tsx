import Image from 'next/image';
import styles from '../styles/Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-1 py-12 border-t-2 w-full">
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center content-center flex-grow"
      >
        <span>Powered by </span>
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </footer>
  );
};
