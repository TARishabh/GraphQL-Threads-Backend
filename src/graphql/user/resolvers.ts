import UserService, { CreateUserPayload } from "../../services/user"

const queries = {}
const mutatations = {
    createUser: async(_:any, payload:CreateUserPayload) =>{
        const res = await UserService.createUser(payload)
        return res.id
    },
    login: async(_:any, {email,password}:{email:string,password:string}) =>{
        const res = await UserService.login(email,password)
        return res
    }
}

export const resolvers = {queries,mutatations}