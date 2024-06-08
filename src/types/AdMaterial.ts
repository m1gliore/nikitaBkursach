export type AdMaterial = {
    id?: number
    categoryId?: number
    campaignId?: number
    type?: AdMaterialType
    contentUrl?: string
}

export type AdCategory = {
    id?: number
    name?: string
    description?: string
}

export enum AdMaterialType {image = 'Изображение', video = 'Видео', text = 'Текст'}