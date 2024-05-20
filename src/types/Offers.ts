import {CompanyInfo} from "./Company";

export type Offer = {
    id?: number
    name?: string
    description?: string
    deliveryTime?: Date
    possibleDelayTime?: number
    price?: number
    companyId?: number
    tenderId?: number
    status?: OfferStatus
    companyName?: string
    company?: CompanyInfo
    created?: Date
    profile?: UserProfile
}

export type OfferStatus = 'ACCEPTED' | 'REJECTED' | 'ACTIVE'

export type Cost = {
    costAll?: number
    idTenderInfo?: number
    address?: string
    acceptCount?: number
    idCost?: number
}

export type UserProfile = {
    id?: number
    fullName?: string
    created?: Date
    avatar?: string
}