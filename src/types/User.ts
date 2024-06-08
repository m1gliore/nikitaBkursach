import {Campaign} from "./Campaign";

export type User = {
    id?: number
    email?: string
    username?: string
    password?: string
    oldPassword?: string
    newPassword?: string
}