import { ApolloServer } from "@apollo/server";
import { prismaClient } from '../lib/db'
import {User} from './user/index'
export default async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
            type Mutation {
                ${User.mutatations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation: {
                ...User.resolvers.mutatations

            },
        }
    });

    await server.start();
    return server
}
