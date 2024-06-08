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
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Add, Delete, Edit} from "@mui/icons-material";
import {BudgetPlanning} from "../types/BudgetPlanning";
import {Targeting} from "../types/Targeting";

const Title = styled.h1`
`

const TargetingPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [targetings, setTargetings] = useState<Array<Targeting>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedTargeting, setSelectedTargeting] = useState<Targeting | null>(null);
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

    const handleEditClick = (targeting: Targeting) => {
        setSelectedTargeting(targeting);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedTargeting(null);
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
        //         setAdCategories(targetings.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedTargeting) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedTargeting.id}`, selectedTargeting, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedTargeting)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedTargeting, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedTargeting)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Таргетинг</Title>
            {isAdmin &&
                <Tooltip title="Добавить таргетинг">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Возрастной диапазон</TableCell>
                            <TableCell>Местоположение</TableCell>
                            <TableCell>Интересы</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>18-24</TableCell>
                            <TableCell>Минск, ул. Такая-то, д. 45</TableCell>
                            <TableCell>Спорт, технологии</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            ageRange: '18-24',
                                            location: 'Минск, ул. Такая-то, д. 45',
                                            interests: 'Спорт, технологии'
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
                        {targetings.slice(pg * 5, pg * 5 + 5).map((targeting, index) => (
                            <TableRow key={index}>
                                <TableCell>{targeting.ageRange}</TableCell>
                                <TableCell>{targeting.location}</TableCell>
                                <TableCell>{targeting.interests}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(targeting)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(targeting.id)}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={targetings.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedTargeting ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Возрастной диапазон"
                        value={selectedTargeting?.ageRange || ''}
                        onChange={(e) => setSelectedTargeting({...selectedTargeting, ageRange: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Местоположение"
                        value={selectedTargeting?.location || ''}
                        onChange={(e) => setSelectedTargeting({...selectedTargeting, location: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Интересы"
                        value={selectedTargeting?.interests || ''}
                        onChange={(e) => setSelectedTargeting({...selectedTargeting, interests: e.target.value})}
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

export default TargetingPage
