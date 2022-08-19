import { useState } from 'react';
import styles from '../styles/Search.module.css';

type SearchProps = {
  title: string;
  buttonText: string;
  colorName?: string;
  onSearch(value: string): void;
};

export const Search: React.FC<SearchProps> = ({ title, buttonText, colorName, onSearch }) => {
  const [value, setValue] = useState<string | null>(null);

  const id = `value-${title}`;

  return (
    <section className={styles.section + ' bg-emerald-400'}>
      <label className="self-start" htmlFor={id}>
        {title}
      </label>
      <input id={id} name={id} type="text" className="w-full mb-6" onChange={(event) => setValue(event.target.value)} />
      <button
        className="my-3 w-full hover:bg-white hover:border-white hover:text-emerald-400 text-white bg-transparent border-white"
        onClick={() => value && onSearch(value)}
      >
        {buttonText}
      </button>
    </section>
  );
};
