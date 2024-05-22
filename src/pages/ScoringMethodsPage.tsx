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
    TablePagination, InputLabel, Select, MenuItem
} from '@mui/material';
import {Container} from "../components/Container";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {ScoringMethod} from "../types/ScoringMethod";

const Title = styled.h1`
`

const ScoringMethodsPage: React.FC = () => {
    const [scoringMethods, setScoringMethods] = useState<Array<ScoringMethod>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openAddScoringMethodDialog, setOpenAddScoringMethodDialog] = useState<boolean>(false);
    const [openEditScoringMethodDialog, setOpenEditScoringMethodDialog] = useState<boolean>(false);
    const [openDeleteScoringMethodDialog, setOpenDeleteScoringMethodDialog] = useState<boolean>(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false)
    const [newScoringMethod, setNewScoringMethod] = useState<ScoringMethod>({
        name: '',
        coeffNetIncome: 0,
        coeffTotalAssets: 0,
        coeffTotalEquity: 0,
        coeffTotalLiabilities: 0,
        coeffSalesRevenue: 0,
        coeffMarketValue: 0,
        coeffCashFlow: 0,
        coeffMonth: 0,
        coeffAmount: 0
    });
    const [idEditScoringMethod, setIdEditScoringMethod] = useState<number>(0)
    const [editScoringMethod, setEditScoringMethod] = useState<ScoringMethod>({
        name: '',
        coeffNetIncome: 0,
        coeffTotalAssets: 0,
        coeffTotalEquity: 0,
        coeffTotalLiabilities: 0,
        coeffSalesRevenue: 0,
        coeffMarketValue: 0,
        coeffCashFlow: 0,
        coeffMonth: 0,
        coeffAmount: 0
    });
    const [deleteScoringMethodId, setDeleteScoringMethodId] = useState<number>(0)
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("")
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [admin, setAdmin] = useState<string>("ROLE_USER")
    const [oneScoringMethod, setOneScoringMethod] = useState<ScoringMethod>()

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                axios.get(`http://localhost:8080/server/coursework-admin/api/scoringMethod`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setScoringMethods(res.data.list));

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));
            })();
        }
    }, [token]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleAddScoringMethod = () => {
        setOpenAddScoringMethodDialog(true);
    }

    const handleSaveScoringMethod = () => {
        axios.post('http://localhost:8080/server/coursework-admin/api/scoringMethod', newScoringMethod, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddScoringMethodDialog(false)
                navigate(0)
            })
    }

    const handleEditScoringMethod = () => {
        setOpenEditScoringMethodDialog(true);
    }

    const handleSaveEditedScoringMethod = () => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/scoringMethod/${idEditScoringMethod}`, editScoringMethod, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditScoringMethodDialog(false)
                navigate(0)
            })
    }

    const handleDeleteScoringMethod = () => {
        setOpenDeleteScoringMethodDialog(true);
    }

    const handleConfirmDeleteScoringMethod = () => {
        axios.delete(`http://localhost:8080/server/coursework-admin/api/scoringMethod/${deleteScoringMethodId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenDeleteScoringMethodDialog(false)
                navigate(0)
            })
    }

    const handleRowClick = async (method: ScoringMethod) => {
        const id = method.id
        if (method) {
            axios.get(`http://localhost:8080/server/coursework-admin/api/scoringMethod/${id}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then((res) => {
                    setOneScoringMethod(res.data)
                })
                .catch(error => {
                    alert(`Произошла ошибка при получении описания тендера: ${error}`)
                })
            setOpenDetailsDialog(true)
        }
    }

    return (
        <Container>
            <Title>Методы оценки</Title>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scoringMethods.slice(pg * 7, pg * 7 + 7).map((catalog, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={() => handleRowClick(catalog)}>
                                <TableCell>{catalog.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={scoringMethods.length} rowsPerPage={7}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <div style={{marginTop: "2.5vw"}}>
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                            onClick={handleAddScoringMethod}>
                        Добавить метод оценки
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                            onClick={handleEditScoringMethod}>
                        Изменить метод оценки
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button variant="contained" color="error" onClick={handleDeleteScoringMethod}>
                        Удалить метод оценки
                    </Button>
                }
            </div>
            <Dialog open={openAddScoringMethodDialog} onClose={() => setOpenAddScoringMethodDialog(false)}>
                <DialogTitle>Добавить новый метод оценки</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={newScoringMethod.name}
                        onChange={(e) => setNewScoringMethod({...newScoringMethod, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент чистой прибыли"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffNetIncome > 0 && newScoringMethod.coeffNetIncome}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffNetIncome: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общих активов"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffTotalAssets > 0 && newScoringMethod.coeffTotalAssets}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffTotalAssets: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общего капитала"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffTotalEquity > 0 && newScoringMethod.coeffTotalEquity}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffTotalEquity: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общих обязательств"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffTotalLiabilities > 0 && newScoringMethod.coeffTotalLiabilities}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffTotalLiabilities: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент выручки от продаж"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffSalesRevenue > 0 && newScoringMethod.coeffSalesRevenue}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffSalesRevenue: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент рыночной стоимости"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffMarketValue > 0 && newScoringMethod.coeffMarketValue}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffMarketValue: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент денежного потока"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffCashFlow > 0 && newScoringMethod.coeffCashFlow}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffCashFlow: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Месячный коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffMonth > 0 && newScoringMethod.coeffMonth}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffMonth: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Суммарный коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newScoringMethod.coeffAmount > 0 && newScoringMethod.coeffAmount}
                        onChange={(e) => setNewScoringMethod({
                            ...newScoringMethod,
                            coeffAmount: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddScoringMethodDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveScoringMethod} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditScoringMethodDialog} onClose={() => setOpenEditScoringMethodDialog(false)}>
                <DialogTitle>Изменить метод оценки</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-edit">Метод оценки</InputLabel>
                    <Select
                        labelId="catalog-select-label-edit"
                        id="catalog-select-edit"
                        value={idEditScoringMethod}
                        onChange={async (e) => {
                            const selectedMethod = scoringMethods.find(method => method.id === e.target.value);
                            setIdEditScoringMethod(e.target.value as number)
                            if (selectedMethod) {
                                try {
                                    const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/scoringMethod/${selectedMethod.id}`, {
                                        headers: {
                                            Authorization: `${token}`
                                        }
                                    });
                                    const updatedMethod = response.data;
                                    setEditScoringMethod({
                                        name: updatedMethod.name,
                                        coeffNetIncome: updatedMethod.coeffNetIncome,
                                        coeffTotalAssets: updatedMethod.coeffTotalAssets,
                                        coeffTotalEquity: updatedMethod.coeffTotalEquity,
                                        coeffTotalLiabilities: updatedMethod.coeffTotalLiabilities,
                                        coeffSalesRevenue: updatedMethod.coeffSalesRevenue,
                                        coeffMarketValue: updatedMethod.coeffMarketValue,
                                        coeffCashFlow: updatedMethod.coeffCashFlow,
                                        coeffMonth: updatedMethod.coeffMonth,
                                        coeffAmount: updatedMethod.coeffAmount
                                    })
                                } catch (error) {
                                    console.error('Error fetching updated tender:', error);
                                }
                            }
                        }}
                        fullWidth
                    >
                        {scoringMethods.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.id}>{catalog.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={editScoringMethod.name}
                        onChange={(e) => setEditScoringMethod({...editScoringMethod, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент чистой прибыли"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffNetIncome > 0 && editScoringMethod.coeffNetIncome}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffNetIncome: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общих активов"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffTotalAssets > 0 && editScoringMethod.coeffTotalAssets}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffTotalAssets: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общего капитала"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffTotalEquity > 0 && editScoringMethod.coeffTotalEquity}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffTotalEquity: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент общих обязательств"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffTotalLiabilities > 0 && editScoringMethod.coeffTotalLiabilities}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffTotalLiabilities: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент выручки от продаж"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffSalesRevenue > 0 && editScoringMethod.coeffSalesRevenue}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffSalesRevenue: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент рыночной стоимости"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffMarketValue > 0 && editScoringMethod.coeffMarketValue}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffMarketValue: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент денежного потока"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffCashFlow > 0 && editScoringMethod.coeffCashFlow}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffCashFlow: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Месячный коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffMonth > 0 && editScoringMethod.coeffMonth}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffMonth: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Суммарный коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editScoringMethod.coeffAmount > 0 && editScoringMethod.coeffAmount}
                        onChange={(e) => setEditScoringMethod({
                            ...editScoringMethod,
                            coeffAmount: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddScoringMethodDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedScoringMethod} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteScoringMethodDialog} onClose={() => setOpenDeleteScoringMethodDialog(false)}>
                <DialogTitle>Удалить метод оценки</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-delete">Метод оценки</InputLabel>
                    <Select
                        labelId="catalog-select-label-delete"
                        id="catalog-select-edit"
                        value={deleteScoringMethodId}
                        onChange={(e) => setDeleteScoringMethodId(e.target.value as number)}
                        fullWidth
                    >
                        {scoringMethods.map((method, index) => (
                            <MenuItem key={index} value={method.id}>{method.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteScoringMethodDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDeleteScoringMethod} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
                <DialogTitle>Детали метода оценки</DialogTitle>
                <DialogContent>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название:</strong> {oneScoringMethod?.name}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffNetIncome:</strong> {oneScoringMethod?.coeffNetIncome}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffTotalAssets:</strong> {oneScoringMethod?.coeffTotalAssets}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffTotalEquity:</strong> {oneScoringMethod?.coeffTotalEquity}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffTotalLiabilities:</strong> {oneScoringMethod?.coeffTotalLiabilities}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffSalesRevenue:</strong> {oneScoringMethod?.coeffSalesRevenue}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffMarketValue:</strong> {oneScoringMethod?.coeffMarketValue}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffCashFlow:</strong> {oneScoringMethod?.coeffCashFlow}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffMonth:</strong> {oneScoringMethod?.coeffMonth}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>coeffAmount:</strong> {oneScoringMethod?.coeffAmount}
                    </div>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default ScoringMethodsPage
