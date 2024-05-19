import { ApolloServer } from "@apollo/server";
import { prismaClient } from '../lib/db'
import {User} from './user/index'
export default async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: `
        ${User.typeDefs}
            type Query {
                ${User.queries}
                getContext: String
            }
            type Mutation {
                ${User.mutatations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                getContext: async (_: any, __: any, context: any) => {
                    console.log(context)
                    return JSON.stringify(context)
                }
            },
            Mutation: {
                ...User.resolvers.mutatations

            },
        }
    });

    await server.start();
    return server
}
