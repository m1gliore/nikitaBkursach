import {Product} from "./Products";

export type Offer = {
    idOffers?: number
    idUser?: number
    idProduct?: number
    nameOffer?: string
    datePublication?: string
    allCost?: number
    count?: number
    isAccept?: boolean
    productDTO?: Product
    costsDTOS?: Array<Cost>
}

export type Cost = {
    costAll?: number
    idApplicationInfo?: number
    address?: string
    acceptCount?: number
    idCost?: number
}