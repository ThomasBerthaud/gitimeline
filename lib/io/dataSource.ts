import { graphql } from '@octokit/graphql';
import { RequestHeaders } from '@octokit/types';

export interface DataSourceSpec {
  query<T>(query: string, params: { [key: string]: string | number }): Promise<T>;
}

export class DataSource implements DataSourceSpec {
  constructor(private readonly source: typeof graphql = graphql) {}

  private getBaseHeaders(): RequestHeaders {
    return {
      authorization: `token ${process.env.ACCESS_TOKEN}`,
    };
  }

  async query<T>(query: string, params: { [key: string]: string | number }): Promise<T> {
    return this.source(query, { ...params, headers: this.getBaseHeaders() });
  }
}

export const dataSource = new DataSource();
