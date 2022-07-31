import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserTimeline, { getServerSideProps } from '../../../pages/user-timeline/[userId]';
import { GetServerSidePropsContext } from 'next';
import { userRepositories } from '../../mocks/handlers';

describe('user timeline page', () => {
  test("should display user's  timeline", () => {
    const { asFragment } = render(<UserTimeline userRepositories={userRepositories} />);

    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(2);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should fetch api data', async () => {
    const context = { params: { userId: 'userId' } } as GetServerSidePropsContext<{ userId: string }>;
    const result = await getServerSideProps(context);
    expect(result).toEqual({ props: { userRepositories } });
  });
});
