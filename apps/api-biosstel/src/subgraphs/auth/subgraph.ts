import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { resolve } from "path";
import resolvers from "./resolvers";

const typeDefs = parse(
  readFileSync(resolve(__dirname, "typedef.graphql"), "utf8")
);

export const getAuthSchema = () =>
  buildSubgraphSchema([{ typeDefs, resolvers }]);
