import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from '@apollo/server/express4'
import { prismaClient } from './lib/db'

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());
    const server = new ApolloServer({
        typeDefs: `
            type Users {
                id: String
                firstName: String
                lastName: String
                email: String
                password: String
            }
            type Query {
                getUsers: [Users]
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                getUsers: async () => {
                    return await prismaClient.user.findMany();
                }
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: "random_salt"
                        }
                    });
                    return true;
                }
            },
        }
    });

    await server.start();


    app.get('/', (req, res) => {
        res.json({ message: 'Server is running' })
    })

    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer();