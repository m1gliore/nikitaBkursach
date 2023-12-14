export interface CustomTableProps {
    data: Array<Record<string, any>>
    columns: Array<string>
    rowsPerPage: number
    currentPage: number
}