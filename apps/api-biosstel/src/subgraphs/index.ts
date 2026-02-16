import { GraphQLSchema } from "graphql";
import { getAuthSchema } from "./auth/subgraph";

type SubgraphConfig = {
  name: string;
  getSchema: () => GraphQLSchema;
};

const SUBGRAPH_CONFIG: SubgraphConfig[] = [
  { name: "auth", getSchema: getAuthSchema },
];

export default SUBGRAPH_CONFIG;
