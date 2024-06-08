export type Payment = {
    id?: number
    userid?: number
    campaignId?: number
    amount?: number
    paymentDate?: Date
    paymentMethod?: PaymentMethod
}

export enum PaymentMethod {creditCard = 'Кредитная карта', erip = 'ЕРИП', kiwi = 'Киви'}