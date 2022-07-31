import { UserRepositories } from '../../types/UserRepositories';
import { graphql } from 'msw';

export const userRepositories: UserRepositories = {
  name: 'user',
  repositories: {
    totalCount: 1,
    nodes: [
      { id: '123', url: 'repoUrl', name: 'repo', createdAt: '2021-07-11T18:45:06Z' },
      { id: '124', url: 'repoUrl2', name: 'repo2', createdAt: '2022-07-11T18:45:06Z' },
    ],
  },
};

export const handlers = [
  graphql.query('getUserRepositoriesQuery', (req, res, ctx) => {
    return res(ctx.data({ user: userRepositories }));
  }),
];
