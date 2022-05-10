import { Box, Button, Container, Heading, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import { VIEWER_REPOSITORIES_QUERY } from "../graphql/queries";

const GITHUB_API_BASE_URL = "https://api.github.com/graphql";

export default function DashboardPage() {
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();

  const graphQLClient = new GraphQLClient(GITHUB_API_BASE_URL, {
    headers: {
      authorization: `token ${session?.accessToken}`,
    },
  });

  const fetchViewer = async () => {
    const data = await graphQLClient.request(
      gql`
        ${VIEWER_REPOSITORIES_QUERY}
      `
    );
    console.log(`---------------- data: `, data);
    return data;
  };

  const query = useQuery("viewer", fetchViewer, {
    enabled: !!session?.accessToken,
  });

  console.log(`---------------- session: `, session);
  console.log(`---------------- query: `, query);

  return (
    <>
      <Heading>Dashboard</Heading>
    </>
  );
}
