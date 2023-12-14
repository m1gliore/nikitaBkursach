export type Product = {
    idProduct?: number
    idApplicationInfo?: number
    nameProduct: string
    description: string
    images: Array<ImageType>
}

export type ImageType = {
    idImages?: number
    fileName: string
    multipartFile: File | null
    type: string
    main: boolean
    file_image?: string
}