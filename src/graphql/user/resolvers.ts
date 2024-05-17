const queries = {}
const mutatations = {
    createUser: async(_:any, {}:{}) =>{
        return 'Hello'
    }
}

export const resolvers = {queries,mutatations}