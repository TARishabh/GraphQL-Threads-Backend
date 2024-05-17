import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto'
import JWT  from "jsonwebtoken";

const JWT_SECRET = 'mysecretkey'

export interface CreateUserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;

}

class UserService {

    private static hashPassword(password: string, salt: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
        return hashedPassword
    }

    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword
            }
        })
    }
    private static getUserEmail(email: string) {
        return prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
    }
    public static async login(email: string, password: string) {
        const user = await UserService.getUserEmail(email)
        if (!user){
            throw new Error('User not found')
        }
        if (user.password !== UserService.hashPassword(password, user.salt)){
            throw new Error('Invalid password')
        }
        const token = JWT.sign({id:user.id, email:user.email}, JWT_SECRET)
        return token
    }
}

export default UserService