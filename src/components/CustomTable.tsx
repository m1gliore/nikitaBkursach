import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {CustomTableProps} from "../types/Tables";

const CustomTable: React.FC<CustomTableProps> = ({data, columns, rowsPerPage, currentPage}) => {
    const startIndex = currentPage * rowsPerPage
    const endIndex = startIndex + rowsPerPage

    return (
        <TableContainer component={Paper} style={{marginTop: '1vw'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={index}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.slice(startIndex, endIndex).map((item, index) => (
                        <TableRow key={index}>
                            {Object.keys(item).map((key, innerIndex) => (
                                <React.Fragment key={key}>
                                    {innerIndex !== 0 && (
                                        <TableCell>
                                            {/*{typeof item[key] === 'object' ? (*/}
                                            {/*    key === 'productDTO' ? (*/}
                                            {/*        item[key].nameProduct*/}
                                            {/*    ) : key === 'images' ? (*/}
                                            {/*        item[key].map((image: ImageType) => (*/}
                                            {/*            image.main && <CustomImage src={"data:" + image.type + ";base64," + image.file_image} alt={image.fileName} />*/}
                                            {/*        ))*/}
                                            {/*    ) : null*/}
                                            {/*) : (*/}
                                            {/*    key === 'isAccept' ? (*/}
                                            {/*        item[key] ? 'Принят' : 'Не принят'*/}
                                            {/*    ) : (*/}
                                            {/*        item[key]*/}
                                            {/*    )*/}
                                            {/*)}*/}
                                        </TableCell>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomTable
