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
import {Payment, PaymentMethod} from "../types/Payment";

const Title = styled.h1`
`

const PaymentsPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [payments, setPayments] = useState<Array<Payment>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
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

    const handleEditClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedPayment(null);
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
        //         setAdCategories(payments.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedPayment) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedPayment.id}`, selectedPayment, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedPayment)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedPayment, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedPayment)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Платежи и бюджетирование</Title>
            {isAdmin &&
                <Tooltip title="Добавить платёж">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Сумма платежа</TableCell>
                            <TableCell>Дата и время платежа</TableCell>
                            <TableCell>Метод платежа</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>5255 ₽</TableCell>
                            <TableCell>{new Date('2025-01-01T12:00:00').toLocaleString()}</TableCell>
                            <TableCell>{PaymentMethod.erip}</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            amount: 5255,
                                            paymentDate: new Date('2025-01-01T12:00:00'),
                                            paymentMethod: PaymentMethod.erip
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
                        {payments.slice(pg * 5, pg * 5 + 5).map((payment, index) => (
                            <TableRow key={index}>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'Дата не указана'}</TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(payment)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(payment.id)}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={payments.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedPayment ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Сумма платежа"
                        value={selectedPayment?.amount || ''}
                        onChange={(e) => setSelectedPayment({...selectedPayment, amount: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Дата и время платежа"
                        type="datetime-local"
                        value={selectedPayment?.paymentDate ? selectedPayment.paymentDate.toISOString().slice(0, 16) : ''}
                        onChange={(e) => setSelectedPayment({...selectedPayment, paymentDate: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Метод платежа"
                        select
                        value={selectedPayment?.paymentMethod || ''}
                        onChange={(e) => setSelectedPayment({...selectedPayment, paymentMethod: e.target.value as PaymentMethod})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        {Object.values(PaymentMethod).map((method) => (
                            <MenuItem key={method} value={method}>
                                {method}
                            </MenuItem>
                        ))}
                    </TextField>
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

export default PaymentsPage
