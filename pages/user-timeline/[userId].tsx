import { GetServerSideProps, NextPage } from 'next';
import { getUserRepositories } from '../../lib/getUserRepositories';
import { UserRepositories } from '../../lib/types/UserRepositories';
import { RepositoryInfo } from '../../components/RepositoryInfo';

export const getServerSideProps: GetServerSideProps<UserTimelineProps, { userId: string }> = async (context) => {
  return {
    props: { userRepositories: await getUserRepositories(context.params!.userId) },
  };
};

type UserTimelineProps = {
  userRepositories: UserRepositories;
};

const UserTimeline: NextPage<UserTimelineProps> = ({ userRepositories }) => {
  const repositories = userRepositories.repositories.nodes.map((node) => (
    <RepositoryInfo key={node.id} repository={node} />
  ));
  return (
    <div className="my-3">
      <h3 className="text-lg font-bold my-2">{userRepositories.name}</h3>
      {repositories}
    </div>
  );
};

export default UserTimeline;
