import { ApolloServer } from "@apollo/server";
import express from "express";
import {expressMiddleware} from '@apollo/server/express4'

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT )|| 3000;

    app.use(express.json());

    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say (name:String): String
            }
        `,
        resolvers: {
            Query : {
                hello: () => 'Hello World !!',
                say: (_:any,{name:string}) => `Hello ${name} !!`
            }
        },
    });

    await server.start();   


    app.get('/',(req,res)=>{
        res.json({message: 'Server is running'})
    })

    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    }) 
}

startServer();