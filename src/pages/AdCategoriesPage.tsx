import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination, InputLabel, Select, MenuItem, Tooltip, IconButton
} from '@mui/material';
import {Container} from "../components/Container";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AdCategory} from "../types/AdMaterial";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Add, Delete, Edit} from "@mui/icons-material";

const Title = styled.h1`
`

const AdCategoriesPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [adCategories, setAdCategories] = useState<Array<AdCategory>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<AdCategory | null>(null);
    const navigate = useNavigate()

    // const [user,] = useLocalStorage<LocalStorageData>('user')
    // const [token, setToken] = useState<string>("")

    // useEffect(() => {
    //     if (user?.token) {
    //         setToken(user.token)
    //     }
    // }, [user])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleEditClick = (category: AdCategory) => {
        setSelectedCategory(category);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedCategory(null);
        setOpenEditDialog(true);
    }

    const handleDelete = async (id: number | undefined) => {
        // if (id) {
        //     try {
        //         await axios.delete(`http://localhost:8080/server/coursework-admin/api/adcategories/${id}`, {
        //             headers: {
        //                 Authorization: `${token}`
        //             }
        //         });
        //         setAdCategories(adCategories.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedCategory) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedCategory.id}`, selectedCategory, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedCategory)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedCategory, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedCategory)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Рекламные категории</Title>
            {isAdmin &&
                <Tooltip title="Добавить категорию">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell onClick={() => navigate('/admaterials/1')}>Примерная категория</TableCell>
                            <TableCell>Описание категории</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            name: 'Примерная категория',
                                            description: 'Описание категории',
                                        })}>
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton onClick={() => handleDelete(undefined)}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                        {adCategories.slice(pg * 5, pg * 5 + 5).map((category, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={() => navigate(`/admaterials/${category.id}`)}>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(category)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(category.id)}>
                                                <Delete/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[5]} component="div" count={adCategories.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedCategory ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={selectedCategory?.name || ''}
                        onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Описание"
                        value={selectedCategory?.description || ''}
                        onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default AdCategoriesPage
