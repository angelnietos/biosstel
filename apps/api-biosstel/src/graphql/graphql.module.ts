/**
 * Módulo GraphQL: se registra solo cuando graphql.enabled en config (settings.json o GRAPHQL_ENABLED).
 * Expone resolvers por feature según graphql.features (ej. ['users']).
 * REST sigue funcionando en paralelo.
 */

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { getGraphQLConfig, isGraphQLEnabledForFeature } from '@biosstel/api-shared';
import { UsersResolver } from '@biosstel/api-usuarios';

const gqlConfig = getGraphQLConfig();
const graphqlEnabled = gqlConfig.enabled === true;
const graphqlPath = gqlConfig.path ?? '/graphql';
const usersEnabled = isGraphQLEnabledForFeature('users');

@Module({
  imports: [
    ...(graphqlEnabled
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            path: graphqlPath,
            autoSchemaFile: join(process.cwd(), 'dist/apps/api-biosstel/schema.gql'),
            sortSchema: true,
            playground: true,
          }),
        ]
      : []),
  ],
  providers: [...(graphqlEnabled && usersEnabled ? [UsersResolver] : [])],
})
export class AppGraphQLModule {}
