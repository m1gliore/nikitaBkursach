import {Company} from "./Company";

export type User = {
    id?: number
    email?: string
    username?: string
    password?: string
    oldPassword?: string
    newPassword?: string
    companyName?: string
    companyDescription?: string
    companyAddress?: string
    companyUniqueNumber?: string
    fileImageBrand?: number
    company?: Company
}