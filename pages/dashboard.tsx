import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import { COMMITS_BY_REPOSITORY } from "../graphql/queries";

const GITHUB_API_BASE_URL = "https://api.github.com/graphql";

export default function DashboardPage() {
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();

  const graphQLClient = new GraphQLClient(GITHUB_API_BASE_URL, {
    headers: {
      authorization: `token ${session?.accessToken}`,
    },
  });

  const fetcher = async () => {
    const data = await graphQLClient.request({
      document: COMMITS_BY_REPOSITORY,
      // variables: { before: new Date().toISOString() },
    });
    console.table(
      data.viewer.contributionsCollection.commitContributionsByRepository
    );
    return data.viewer.contributionsCollection.commitContributionsByRepository;
  };

  const { status, data, error, isFetching } = useQuery(
    "commits-by-repository",
    fetcher,
    {
      enabled: !!session?.accessToken,
    }
  );

  data?.forEach(({ repository, contributions }) => {
    console.log(`repository: ${repository.name}`, repository);
    console.table(contributions);
  });

  return (
    <>
      <Heading>Dashboard</Heading>
      <VStack as="ul">
        <li>Status: {status}</li>
        <li>{`Error: ${error}`}</li>
        <li>isFetching: {isFetching}</li>
      </VStack>
      {data?.map(
        ({ repository, contributions: { nodes, edges, pageInfo } }) => (
          <>
            <Heading size="md">
              {repository.name}
              {repository.isPrivate ? "(private)" : null}
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>Commit Count by Date</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Commits</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {edges.map(
                    ({ cursor, node: { commitCount, occurredAt } }) => (
                      <Tr>
                        <Td>{occurredAt}</Td>
                        <Td isNumeric>{commitCount}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )
      )}
    </>
  );
}
