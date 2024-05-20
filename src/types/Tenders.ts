import {Item} from "./Items";

export type Tender = {
    id?: number
    itemId?: number
    name?: string
    description?: string
    count?: number
    deliveryTime?: Date
    status?: TenderStatus
    created?: Date
    item?: Item
}

export type ItemInfo = {
    tenderItemCount?: number
    address?: string
}

export type TenderInfo = {
    idTenderInfo?: number
    idItem?: number
    idTender?: number
    tenderItemCount: number
    address: string
}

export type TenderStatus = 'HIDDEN' | 'ACTIVE' | 'REJECTED' | 'ACCEPTED'