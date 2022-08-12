import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import { userRepositories } from './mocks/handlers';
import Home from '../pages';

describe('index page', () => {
  test('should display home page', () => {
    const { asFragment } = render(<Home />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('it should search for a repository');

  test('it should search for a user');
});
