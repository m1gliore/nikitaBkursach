import {Product} from "./Products";

export type Application = {
    idUser?: number
    idProduct?: number
    idApplication?: number
    nameApplication?: string
    description?: string
    productDTO?: Product
    isStart?: boolean
    isFinish?: boolean
    productsInfos?: Array<ProductInfo>
}

export type ProductInfo = {
    applicationProductCount?: number
    address?: string
}

export type ApplicationInfo = {
    idApplicationInfo?: number
    idProduct?: number
    idApplication?: number
    applicationProductCount: number
    address: string
}