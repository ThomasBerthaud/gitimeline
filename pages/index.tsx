import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className="font-bold">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p>
          <Image src={'/images/profile.jpeg'} alt={'profile image'} width={100} height={100} />
        </p>

        <div className={styles.grid}>
          <Link href={'/user-timeline/ThomasBerthaud'} className={styles.card}>
            <h2>Voir utilisateur test</h2>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
