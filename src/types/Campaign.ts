export type Campaign = {
    id?: number
    name?: string
    budget?: number
    startDate?: Date
    endDate?: Date
    status?: CampaignStatus
}

export type CampaignChecklist = {
    id?: number
    idCampaign?: number
    task?: string
    status?: CampaignChecklistStatus
}

export type CampaignSchedule = {
    id?: number
    idCampaign?: number
    dayOfWeek?: string
    startTime?: string
    endTime?: string
}

export enum CampaignStatus {active = 'Активная', paused = 'Приостановленная', ended = 'Завершенная'}

export enum CampaignChecklistStatus {pending = 'В ожидании', completed = 'Завершена'}