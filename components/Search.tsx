import { useState } from 'react';
import styles from '../styles/Search.module.css';

type SearchProps = {
  title: string;
  buttonText: string;
  position: 'left' | 'right';
  onSearch(value: string): void;
};

export const Search: React.FC<SearchProps> = ({ title, buttonText, position, onSearch }) => {
  const [value, setValue] = useState<string | null>(null);

  const id = `value-${title}`;

  return (
    <section className={[styles.section, styles[position]].join(' ')}>
      <label className="self-start" htmlFor={id}>
        {title}
      </label>
      <input id={id} name={id} type="text" className="w-full mb-6" onChange={(event) => setValue(event.target.value)} />
      <button className="w-full" onClick={() => value && onSearch(value)}>
        {buttonText}
      </button>
    </section>
  );
};
