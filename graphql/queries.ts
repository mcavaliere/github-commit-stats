import { gql } from "graphql-request";

export const VIEWER_REPOSITORIES_QUERY = gql`
  {
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
          ) {
            nodes {
              commitCount
              occurredAt
              repository {
                name
              }
            }
            edges {
              node {
                commitCount
                occurredAt
                repository {
                  name
                }
              }
              cursor
            }
          }
        }
      }
    }
  }
`;
