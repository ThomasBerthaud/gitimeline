export type UserRepositories = {
  name: string;
  repositories: { totalCount: number; nodes: Repository[] };
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
};
