export type ScoringMethod = {
    id?: number
    name: string
    coeffNetIncome: number
    coeffTotalAssets: number
    coeffTotalEquity: number
    coeffTotalLiabilities: number
    coeffSalesRevenue: number
    coeffMarketValue: number
    coeffCashFlow: number
    coeffMonth: number
    coeffAmount: number
}