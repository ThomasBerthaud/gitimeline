import { Repository } from '../types/UserRepositories';
import React from 'react';

type RepositoryProps = {
  repository: Repository;
};

export const RepositoryLine: React.FC<RepositoryProps> = ({ repository }) => {
  return (
    <div className="">
      <RepositoryMarker />
      <h6 className="text-lg font-bold">{repository.name}</h6>
      <a href={repository.url} className="link text-xs mx-1">
        ({repository.url})
      </a>
      <div className="text-italic">{repository.createdAt}</div>
    </div>
  );
};

const RepositoryMarker: React.FC = () => {
  return <div className="bg-amber-50 rounded-full border-2 border-amber-200 w-4 h-4 m-2" />;
};
