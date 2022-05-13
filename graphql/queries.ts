import { gql } from "graphql-request";

export const COMMITS_BY_REPOSITORY = gql`
  query Commits($before: String) {
    viewer {
      login
      contributionsCollection {
        commitContributionsByRepository {
          repository {
            name
            isPrivate
          }
          contributions(
            orderBy: { field: OCCURRED_AT, direction: DESC }
            first: 100
            before: $before
          ) {
            nodes {
              commitCount
              occurredAt
            }
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                commitCount
                occurredAt
              }
              cursor
            }
          }
        }
      }
    }
  }
`;
