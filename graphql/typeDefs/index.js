
const { gql } = require('apollo-server-express')

module.exports = gql `
    scalar Upload
    
    type Query {
        _dummy: String
    }
    type Mutation {
        _dummy: String
    }
    type Subscription {
        _dummy: String
    }
`