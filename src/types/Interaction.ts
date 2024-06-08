import {AdMaterial} from "./AdMaterial";

export type Interaction = {
    id?: number
    userId?: number
    material?: AdMaterial
    interactionType?: InteractionType
    interactionDate?: Date
}

export enum InteractionType {brochure = 'Брошюра', flyer = 'Флаер', leaflet = 'Листовка', banner = 'Баннер', catalog = 'Каталог'}