import type { NextPage } from 'next';
import { Search } from '../components/Search';

const Home: NextPage = () => {
  const searchUser = () => {};
  const searchRepository = () => {};

  return (
    <>
      <h1 className="font-bold text-3xl text-center my-20">Search for a Github user or repository</h1>

      <div className="flex justify-center h-full">
        <Search title="Username" buttonText="Search User" position="left" onSearch={searchUser} />
        <div className="relative border" style={{ width: '1px' }}>
          <div className="absolute top-1/2 left-0 -translate-x-1/2 bg-white text-xl font-bold">Or</div>
        </div>
        <Search title="Repository" buttonText="Search Repository" position="right" onSearch={searchRepository} />
      </div>
    </>
  );
};

export default Home;
