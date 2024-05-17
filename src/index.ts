import express from "express";
import { expressMiddleware } from '@apollo/server/express4'
import startApolloServer from "./graphql";

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Server is running' })
    })

    app.use('/graphql', expressMiddleware(await startApolloServer()));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer();