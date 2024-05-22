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
    TablePagination, InputLabel, Select, MenuItem, IconButton, Menu
} from '@mui/material';
import {Container} from "../components/Container";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Loan} from "../types/Loan";
import {Company} from "../types/Company";
import {FilterListOutlined} from "@mui/icons-material";

const Title = styled.h1`
`

const LoanPage: React.FC = () => {
    const [loans, setLoans] = useState<Array<Loan>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openAddLoanDialog, setOpenAddLoanDialog] = useState<boolean>(false);
    const [openEditLoanDialog, setOpenEditLoanDialog] = useState<boolean>(false);
    const [newLoan, setNewLoan] = useState<Loan>({
        amount: 0,
        interestRate: 0,
        termMonth: 0
    });
    const [idEditLoan, setIdEditLoan] = useState<number>(0)
    const [editLoan, setEditLoan] = useState<Loan>({
        amount: 0,
        interestRate: 0,
        termMonth: 0
    });
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("")
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [admin, setAdmin] = useState<string>("")
    const [idCompanyView, setIdCompanyView] = useState<number>(0)
    const [companies, setCompanies] = useState<Company[]>([])

    const [filterType, setFilterType] = useState<string>("ACCEPTED,REJECTED,ACTIVE,HIDDEN");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/loan`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        statuses: filterType
                    }
                })
                    .then(res => setLoans(res.data.list));

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/${idCompanyView}/loan`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        statuses: filterType
                    }
                })
                    .then(res => setLoans(res.data.list));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setCompanies(res.data.list));
            })();
        }
    }, [admin, filterType, idCompanyView, token]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleAddLoan = () => {
        setOpenAddLoanDialog(true);
    }

    const handleSaveLoan = () => {
        axios.post('http://localhost:8080/server/coursework-user/api/loan', newLoan, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddLoanDialog(false)
                navigate(0)
            })
    }

    const handleEditLoan = () => {
        setOpenEditLoanDialog(true);
    }

    const handleSaveEditedLoan = () => {
        axios.put(`http://localhost:8080/server/coursework-user/api/loan/${idEditLoan}`, editLoan, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditLoanDialog(false)
                navigate(0)
            })
    }

    const handleRowClick = async (idLoan: number | undefined) => {
        // axios.put(`http://localhost:8080/server/coursework-user/api/loan/${idLoan}/activated`, {}, {
        //     headers: {
        //         Authorization: `${token}`
        //     }
        // })
        //     .then(() => {
        //         navigate(0)
        //     })
    }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (newFilter?: string) => {
        setAnchorEl(null);
        if (newFilter) {
            setFilterType(newFilter);
        }
    };

    return (
        <Container>
            <Title>Заявки</Title>
            {admin === "ROLE_ADMIN" &&
                <>
                    <InputLabel id="catalog-select-label-view">Компания</InputLabel>
                    <Select
                        labelId="catalog-select-label-view"
                        id="catalog-select-view"
                        value={idCompanyView}
                        onChange={(e) => setIdCompanyView(e.target.value as number)}
                        sx={{width: '10vw'}}
                    >
                        {companies.map((company, index) => (
                            <MenuItem key={index} value={company.id}>{company.name}</MenuItem>
                        ))}
                    </Select>
                </>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название компании</TableCell>
                            <TableCell>Uuid</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.slice(pg * 7, pg * 7 + 7).map((loan, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={admin === "ROLE_USER" ? () => handleRowClick(loan.id) : undefined}>
                                <TableCell>{loan.companyName}</TableCell>
                                <TableCell>{loan.uuid}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={loans.length} rowsPerPage={7} page={pg}
                             onPageChange={handleChangePage}/>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2.5vw'}}>
                <div>
                    {admin === "ROLE_USER" &&
                        <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                                onClick={handleAddLoan}>
                            Добавить заявку
                        </Button>
                    }
                    {admin === "ROLE_USER" &&
                        <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                                onClick={handleEditLoan}>
                            Изменить заявку
                        </Button>
                    }
                </div>
                <div style={{marginLeft: "2.5vw"}}>
                    <IconButton
                        aria-controls="filter-menu"
                        aria-haspopup="true"
                        onClick={handleFilterClick}
                        sx={{padding: '0'}}
                    >
                        <FilterListOutlined fontSize="large"/>
                    </IconButton>
                    <Menu
                        id="filter-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => handleFilterClose()}
                    >
                        <MenuItem onClick={() => handleFilterClose("ACCEPTED,REJECTED,ACTIVE,HIDDEN")}>Все</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("ACCEPTED")}>Принятые</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("REJECTED")}>Отклонённые</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("ACTIVE")}>Активные</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("HIDDEN")}>Неактивные</MenuItem>
                    </Menu>
                </div>
            </div>
            <Dialog open={openAddLoanDialog} onClose={() => setOpenAddLoanDialog(false)}>
                <DialogTitle>Добавить новую заявку</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Количество"
                        type="number"
                        value={newLoan.amount > 0 && newLoan.amount}
                        onChange={(e) => setNewLoan({...newLoan, amount: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Предпочтительная ставка"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newLoan.interestRate > 0 && newLoan.interestRate}
                        onChange={(e) => setNewLoan({...newLoan, interestRate: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Срок (в месяцах)"
                        type="number"
                        value={newLoan.termMonth}
                        onChange={(e) => setNewLoan({...newLoan, termMonth: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddLoanDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveLoan} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditLoanDialog} onClose={() => setOpenEditLoanDialog(false)}>
                <DialogTitle>Изменить заявку</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-edit">Заявка</InputLabel>
                    <Select
                        labelId="catalog-select-label-edit"
                        id="catalog-select-edit"
                        value={idEditLoan}
                        onChange={(e) => setIdEditLoan(e.target.value as number)}
                        fullWidth
                    >
                        {loans.map((loan, index) => (
                            <MenuItem key={index} value={loan.id}>{loan.companyName}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Количество"
                        type="number"
                        value={editLoan.amount > 0 && editLoan.amount}
                        onChange={(e) => setEditLoan({...newLoan, amount: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Предпочтительная ставка"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editLoan.interestRate > 0 && editLoan.interestRate}
                        onChange={(e) => setEditLoan({...editLoan, interestRate: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Срок (в месяцах)"
                        type="number"
                        value={editLoan.termMonth}
                        onChange={(e) => setEditLoan({...editLoan, termMonth: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddLoanDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedLoan} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default LoanPage
