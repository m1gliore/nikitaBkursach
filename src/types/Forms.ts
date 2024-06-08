export interface LoginFormInput {
    email: string
    password: string
}

export interface SignUpFormInput {
    email: string
    password: string
    repPassword: string
    username: string
}

export interface CompanyInfoFormInput {
    name: string
    address: string
    uniqNumber: string
    description: string
}

export interface UserFormInput {
    companyId?: number
    userId?: number
    email?: string
    name?: string
    surname?: string
    patronymic?: string
    avatar?: string
    oldPassword?: string
    newPassword?: string
}