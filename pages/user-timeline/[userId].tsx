import { GetServerSideProps, NextPage } from 'next';
import { getUserRepositories } from '../../lib/user-timeline/getUserRepositories';
import { UserRepositories } from '../../types/UserRepositories';
import { RepositoryLine } from '../../components/RepositoryLine';

export const getServerSideProps: GetServerSideProps<UserTimelineProps, { userId: string }> = async (context) => {
  const user = await getUserRepositories(context.params!.userId);
  return {
    props: { userRepositories: user },
  };
};

type UserTimelineProps = {
  userRepositories: UserRepositories;
};

const UserTimeline: NextPage<UserTimelineProps> = ({ userRepositories }) => {
  const repositories = userRepositories.repositories.nodes.map((node) => (
    <RepositoryLine key={node.id} repository={node} />
  ));
  return (
    <div className="my-3">
      <h4 className="text-lg font-bold my-2">{userRepositories.name}</h4>
      {repositories}
    </div>
  );
};

export default UserTimeline;
