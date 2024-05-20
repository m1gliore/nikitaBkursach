export type Item = {
    id?: number
    name: string
    description: Record<string, any>
    type: ItemType
    fileIdList: Array<number>
    catalogId: number
}

export type ItemType = 'PRODUCT' | 'SERVICE'

export type ImageType = {
    file: CustomFile | File
    fileType: FileType
}

export type FileType = 'SYSTEM' | 'DOCUMENT_TENDER'

export type CustomFile = {
    name: string
    size: number
    type: string
}