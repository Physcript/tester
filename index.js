
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

// apollo
const { ApolloServer } = require('apollo-server-express')
const { GraphQLUpload,graphqlUploadExpress } = require('graphql-upload')
const typeDefs =  require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

// subs
const { createServer } = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute,subscribe } = require('graphql')

const server = async (typeDefs,resolvers) => {

    const app = express()
    const PORT = process.env.PORT || 4000

    const corsOptions = {
        origin: ['https://studio.apollographql.com','http://localhost:3000'],
        credentials: true
    }

    app.use(cookieParser())
    app.use(graphqlUploadExpress())
    app.use(cors(corsOptions))

    const httpServer = createServer(app)

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    const server = new ApolloServer({
        schema,
        context: ({req,res}) =>({req,res}),
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer(){
                        subscriptionServer.close()
                    }
                }
            }
        }]
    })

    const subscriptionServer = new SubscriptionServer(
        { schema,subscribe,execute },
        { server: httpServer ,path: server.graphqlPath }
    )

    await server.start()
    
    server.applyMiddleware({
        app,
        cors: false
    })


    mongoose.connect(process.env.MONGO_URI,{
        useUnifiedTopology: true
    }).then(()=> {
        console.log(`DATABASE CONNECTED`)
    }).then(() => {
        httpServer.listen(PORT,()=>{
            console.log(`PORT: ${PORT}`)    
        })
    })  

}


server(typeDefs,resolvers)

