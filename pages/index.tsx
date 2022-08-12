import type { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [repository, setRepository] = useState<string | null>(null);

  const searchUser = () => {};
  const searchRepository = () => {};

  return (
    <>
      <h1 className="font-bold text-3xl text-center my-8">Search for a Github user or repository</h1>

      <div className="flex items-center justify-center">
        <section className={styles.section}>
          <label htmlFor="user-name">Username :</label>
          <input id="user-name" name="user-name" type="text" onChange={(event) => setUserName(event.target.value)} />
          <button onClick={searchUser}>Search User</button>
        </section>

        <section className={styles.section}>
          <label htmlFor="repository">Repository :</label>
          <input
            id="repository"
            name="repository"
            type="text"
            onChange={(event) => setRepository(event.target.value)}
          />
          <button onClick={searchRepository}>Search Repository</button>
        </section>
      </div>
    </>
  );
};

export default Home;
