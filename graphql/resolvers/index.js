
const { GraphQLUpload,graphqlUploadExress } = require('graphql-upload')
const { PubSub,withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()

module.exports = {
    Upload: GraphQLUpload,
    
    Query: {
        async _dummy() {
            return "dummy query"
        }
    },
    Mutation: {
        async _dummy(_,{},context) {
            pubsub.publish('DUMMY',{
                _dummy: 'SUBSCRIPTION'
            })

            console.log(context.req.cookies)
            console.log(context.req.headers)

            return "dummy mutation"
        }
    },
    Subscription: {
        _dummy: {
            subscribe: () => pubsub.asyncIterator(['DUMMY'])
        }
    }
}