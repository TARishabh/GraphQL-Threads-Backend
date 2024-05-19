import express from "express";
import { expressMiddleware } from '@apollo/server/express4'
import startApolloServer from "./graphql";
import UserService from "./services/user";

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Server is running' })
    })
    app.use('/graphql', expressMiddleware(await startApolloServer(), {
        // @ts-ignore
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            let user = null;
            try {
                user = await UserService.decodeJWTToken(token as string);
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
            return { user };
        }
    }));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer();