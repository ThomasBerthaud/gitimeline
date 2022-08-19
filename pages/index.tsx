import type { NextPage } from 'next';
import { Search } from '../components/Search';

const Home: NextPage = () => {
  const searchUser = () => {};
  const searchRepository = () => {};

  return (
    <>
      <h1 className="font-bold text-3xl text-center my-8">Search for a Github user or repository</h1>

      <div className="flex items-center justify-center">
        <Search title="Username" buttonText="Search User" onSearch={searchUser} />

        <Search title="Repository" buttonText="Search Repository" onSearch={searchRepository} />
      </div>
    </>
  );
};

export default Home;
