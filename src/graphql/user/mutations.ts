export const mutatations = ` #graphql
    createUser(firstName: String!, lastName: String! ,email: String!, password: String!,): String
    login(email: String!, password: String!): String
`