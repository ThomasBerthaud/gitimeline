import type { NextPage } from 'next';
import { Search } from '../components/Search';

const Home: NextPage = () => {
  const searchUser = () => {};
  const searchRepository = () => {};

  return (
    <>
      <h1 className="font-bold text-3xl text-center my-16 ">Search for a Github user or repository</h1>

      <div className="flex justify-center content-center h-full">
        <Search title="Username" buttonText="Search User" position="left" onSearch={searchUser} />
        <div className="relative border w-px">
          <div className="absolute top-1/2 left-0 -translate-x-1/2 text-xl font-bold"></div>
        </div>
        <Search title="Repository" buttonText="Search Repository" position="right" onSearch={searchRepository} />
      </div>
    </>
  );
};

export default Home;
