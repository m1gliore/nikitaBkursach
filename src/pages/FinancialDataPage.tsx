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
import {Segment} from "../types/Segments";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {FinData} from "../types/FinData";
import {FilterListOutlined} from "@mui/icons-material";

const Title = styled.h1`
`

const FinancialDataPage: React.FC = () => {
    const [segments, setSegments] = useState<Array<Segment>>([]);
    const [finDatas, setFinDatas] = useState<FinData[]>([])
    const [pg, setPg] = useState<number>(0);
    const [openAddFinDataDialog, setOpenAddFinDataDialog] = useState<boolean>(false);
    const [openEditFinDataDialog, setOpenEditFinDataDialog] = useState<boolean>(false);
    const [newFinData, setNewFinData] = useState<FinData>({
        segmentId: 0,
        quarter: 0,
        year: 0,
        netIncome: 0,
        totalAssets: 0,
        totalEquity: 0,
        totalLiabilities: 0,
        salesRevenue: 0,
        marketValue: 0,
        cashFlow: 0
    });
    const [idEditFinData, setIdEditFinData] = useState<number>(0)
    const [editFinData, setEditFinData] = useState<FinData>({
        quarter: 0,
        year: 0,
        netIncome: 0,
        totalAssets: 0,
        totalEquity: 0,
        totalLiabilities: 0,
        salesRevenue: 0,
        marketValue: 0,
        cashFlow: 0
    });
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("")
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [admin, setAdmin] = useState<string>("")

    const [filterType, setFilterType] = useState<string>("ALL");
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
                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/company/segment`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setSegments(res.data.list));

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/financialData`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setFinDatas(res.data.segments));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/financialData`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        type: filterType
                    }
                })
                    .then(res => setFinDatas(res.data.segments));
            })();
        }
    }, [admin, filterType, token]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleAddFinData = () => {
        setOpenAddFinDataDialog(true);
    }

    const handleSaveFinData = () => {
        axios.put('http://localhost:8080/server/coursework-user/api/financialData', newFinData, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddFinDataDialog(false)
                navigate(0)
            })
    }

    const handleEditFinData = () => {
        setOpenEditFinDataDialog(true);
    }

    const handleSaveEditedFinData = () => {
        axios.put(`http://localhost:8080/server/coursework-user/api/financialData/${idEditFinData}`, editFinData, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditFinDataDialog(false)
                navigate(0)
            })
    }

    const handleRowClick = async (idSegment: number | undefined) => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/financialData/${idSegment}`, {}, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
            })
    }

    const handleQuarterAndYear = (date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const quarter = Math.floor(month / 3) + 1;
        return {quarter, year};
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const {quarter, year} = handleQuarterAndYear(date);
        setNewFinData({
            ...newFinData,
            quarter,
            year
        });
    };

    const handleDateChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const {quarter, year} = handleQuarterAndYear(date);
        setEditFinData({
            ...newFinData,
            quarter,
            year
        });
    };

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
            <Title>Финансовые данные</Title>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название сегмента</TableCell>
                            <TableCell>Название компании</TableCell>
                            <TableCell>Квартал</TableCell>
                            <TableCell>Год</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finDatas.slice(pg * 7, pg * 7 + 7).map((finData, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={admin === "ROLE_ADMIN" ? () => handleRowClick(finData.id) : undefined}>
                                <TableCell>{finData.segmentName}</TableCell>
                                <TableCell>{finData.companyName}</TableCell>
                                <TableCell>{finData.quarter}</TableCell>
                                <TableCell>{finData.year}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={segments.length} rowsPerPage={7} page={pg}
                             onPageChange={handleChangePage}/>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2.5vw'}}>
                <div>
                    {admin === "ROLE_USER" &&
                        <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                                onClick={handleAddFinData}>
                            Добавить финансовые данные
                        </Button>
                    }
                    {admin === "ROLE_USER" &&
                        <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                                onClick={handleEditFinData}>
                            Изменить финансовые данные
                        </Button>
                    }
                </div>
                {admin === "ROLE_ADMIN" &&
                    <div style={{marginLeft: "5vw"}}>
                        <IconButton
                            aria-controls="filter-menu"
                            aria-haspopup="true"
                            onClick={handleFilterClick}
                        >
                            <FilterListOutlined fontSize="large"/>
                        </IconButton>
                        <Menu
                            id="filter-menu"
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={() => handleFilterClose()}
                        >
                            <MenuItem onClick={() => handleFilterClose("ALL")}>Все</MenuItem>
                            <MenuItem onClick={() => handleFilterClose("ACTIVE")}>Активные</MenuItem>
                        </Menu>
                    </div>
                }
            </div>
            <Dialog open={openAddFinDataDialog} onClose={() => setOpenAddFinDataDialog(false)}>
                <DialogTitle>Добавить финансовые данные</DialogTitle>
                <DialogContent>
                    <InputLabel id="fin-select-label-add">Сегмент</InputLabel>
                    <Select
                        labelId="fin-select-label-add"
                        id="fin-select-add"
                        value={newFinData.segmentId}
                        onChange={(e) => setNewFinData({...newFinData, segmentId: Number(e.target.value)})}
                        fullWidth
                    >
                        {segments.map((segment, index) => (
                            <MenuItem key={index} value={segment.id}>{segment.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Дата"
                        type="date"
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={handleDateChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Чистая прибыль"
                        type="number"
                        value={newFinData.netIncome}
                        onChange={(e) => setNewFinData({...newFinData, netIncome: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общие активы"
                        type="number"
                        value={newFinData.totalAssets}
                        onChange={(e) =>
                            setNewFinData({...newFinData, totalAssets: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общий капитал"
                        type="number"
                        value={newFinData.totalEquity}
                        onChange={(e) =>
                            setNewFinData({...newFinData, totalEquity: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общие обязательства"
                        type="number"
                        value={newFinData.totalLiabilities}
                        onChange={(e) =>
                            setNewFinData({...newFinData, totalLiabilities: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Выручка от продаж"
                        type="number"
                        value={newFinData.salesRevenue}
                        onChange={(e) =>
                            setNewFinData({...newFinData, salesRevenue: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Рыночная стоимость"
                        type="number"
                        value={newFinData.marketValue}
                        onChange={(e) =>
                            setNewFinData({...newFinData, marketValue: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Денежный поток"
                        type="number"
                        value={newFinData.cashFlow}
                        onChange={(e) =>
                            setNewFinData({...newFinData, cashFlow: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddFinDataDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveFinData} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditFinDataDialog} onClose={() => setOpenEditFinDataDialog(false)}>
                <DialogTitle>Изменить финансовые данные</DialogTitle>
                <DialogContent>
                    <InputLabel id="fin-data-select-label-edit">Финансовые данные</InputLabel>
                    <Select
                        labelId="fin-data-select-label-edit"
                        id="fin-data-select-edit"
                        value={idEditFinData}
                        onChange={(e) =>
                            setIdEditFinData(Number(e.target.value))
                        }
                        fullWidth
                    >
                        {finDatas.map((finData, index) => (
                            <MenuItem key={index} value={finData.id}>
                                {finData.segmentName}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Дата"
                        type="date"
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={handleDateChangeEdit}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Чистая прибыль"
                        type="number"
                        value={editFinData.netIncome}
                        onChange={(e) => setEditFinData({...editFinData, netIncome: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общие активы"
                        type="number"
                        value={editFinData.totalAssets}
                        onChange={(e) =>
                            setEditFinData({...editFinData, totalAssets: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общий капитал"
                        type="number"
                        value={editFinData.totalEquity}
                        onChange={(e) =>
                            setEditFinData({...editFinData, totalEquity: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Общие обязательства"
                        type="number"
                        value={editFinData.totalLiabilities}
                        onChange={(e) =>
                            setEditFinData({...editFinData, totalLiabilities: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Выручка от продаж"
                        type="number"
                        value={editFinData.salesRevenue}
                        onChange={(e) =>
                            setEditFinData({...editFinData, salesRevenue: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Рыночная стоимость"
                        type="number"
                        value={editFinData.marketValue}
                        onChange={(e) =>
                            setEditFinData({...editFinData, marketValue: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Денежный поток"
                        type="number"
                        value={editFinData.cashFlow}
                        onChange={(e) =>
                            setEditFinData({...editFinData, cashFlow: Number(e.target.value)})
                        }
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddFinDataDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedFinData} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default FinancialDataPage
