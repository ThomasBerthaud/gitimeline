import { UserRepositories } from '../types/UserRepositories';
import { dataSource } from '../io/dataSource';

export const getUserRepositoriesQuery = /* GraphQL */ `
  query getUserRepositoriesQuery($userId: String!, $nbRepositories: Int = 10) {
    user(login: $userId) {
      name
      repositories(first: $nbRepositories, orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          name
          url
          createdAt
        }
      }
    }
  }
`;

export const getUserRepositories = async (userId: string): Promise<UserRepositories> => {
  const { user } = await dataSource.query<{ user: UserRepositories }>(getUserRepositoriesQuery, { userId });
  return user;
};
