import { Repository } from '../lib/types/UserRepositories';
import React from 'react';

type RepositoryInfoProps = {
  repository: Repository;
};

export const RepositoryInfo: React.FC<RepositoryInfoProps> = ({ repository }) => {
  return (
    <div className="m-2">
      <RepositoryMarker />
      <h4 className="text-lg font-bold">{repository.name}</h4>
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
