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

const Title = styled.h1`
`

const BudgetPlanningPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [budgets, setBudgets] = useState<Array<BudgetPlanning>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedBudget, setSelectedBudget] = useState<BudgetPlanning | null>(null);
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

    const handleEditClick = (budget: BudgetPlanning) => {
        setSelectedBudget(budget);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedBudget(null);
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
        //         setAdCategories(budgets.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedBudget) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedBudget.id}`, selectedBudget, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedBudget)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedBudget, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedBudget)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Планирование бюджета</Title>
            {isAdmin &&
                <Tooltip title="Добавить план">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Месячный бюджет</TableCell>
                            <TableCell>Распределено на текущий момент</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>2500</TableCell>
                            <TableCell>1275</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            monthlyBudget: 2500,
                                            allocated: 1275,
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
                        {budgets.slice(pg * 5, pg * 5 + 5).map((budget, index) => (
                            <TableRow key={index}>
                                <TableCell>{budget.monthlyBudget}</TableCell>
                                <TableCell>{budget.allocated}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(budget)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(budget.id)}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={budgets.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedBudget ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        type="number"
                        value={selectedBudget?.monthlyBudget || ''}
                        onChange={(e) => setSelectedBudget({...selectedBudget, monthlyBudget: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Описание"
                        type="number"
                        value={selectedBudget?.allocated || ''}
                        onChange={(e) => setSelectedBudget({...selectedBudget, allocated: parseFloat(e.target.value)})}
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

export default BudgetPlanningPage
