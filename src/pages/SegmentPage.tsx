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
import {Segment} from "../types/Segments";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {ScoringMethod} from "../types/ScoringMethod";
import {Company} from "../types/Company";

const Title = styled.h1`
`

const SegmentPage: React.FC = () => {
    const [segments, setSegments] = useState<Array<Segment>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openAddSegmentDialog, setOpenAddSegmentDialog] = useState<boolean>(false);
    const [openEditSegmentDialog, setOpenEditSegmentDialog] = useState<boolean>(false);
    const [openDeleteSegmentDialog, setOpenDeleteSegmentDialog] = useState<boolean>(false);
    const [newSegment, setNewSegment] = useState<Segment>({
        methodId: 0,
        name: '',
        coefficient: 0
    });
    const [idEditSegment, setIdEditSegment] = useState<number>(0)
    const [editSegment, setEditSegment] = useState<Segment>({
        methodId: 0,
        name: '',
        coefficient: 0
    });
    const [deleteSegmentId, setDeleteSegmentId] = useState<number>(0)
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("")
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [admin, setAdmin] = useState<string>("")
    const [scoringMethods, setScoringMethods] = useState<Array<ScoringMethod>>([]);
    const [company, setCompany] = useState<Company>()

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/segment`, {
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

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/scoringMethod`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setScoringMethods(res.data.list));

                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/segment`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setSegments(res.data.list))

                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/company`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setCompany(res.data))
            })();
        }
    }, [admin, token]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleAddSegment = () => {
        setOpenAddSegmentDialog(true);
    }

    const handleSaveSegment = () => {
        axios.post('http://localhost:8080/server/coursework-admin/api/segment', newSegment, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddSegmentDialog(false)
                navigate(0)
            })
    }

    const handleEditSegment = () => {
        setOpenEditSegmentDialog(true);
    }

    const handleSaveEditedSegment = () => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/segment/${idEditSegment}`, editSegment, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditSegmentDialog(false)
                navigate(0)
            })
    }

    const handleDeleteSegment = () => {
        setOpenDeleteSegmentDialog(true);
    }

    const handleConfirmDeleteSegment = () => {
        axios.delete(`http://localhost:8080/server/coursework-admin/api/segment/${deleteSegmentId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenDeleteSegmentDialog(false)
                navigate(0)
            })
    }

    const handleRowClick = async (idSegment: number | undefined) => {
        axios.post(`http://localhost:8080/server/coursework-user/api/company/${company?.id}/segment/${idSegment}`, {}, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
            })
    }

    return (
        <Container>
            <Title>Сегменты</Title>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            {admin === "ROLE_ADMIN" && (
                                <TableCell>Коэффициент</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {segments.slice(pg * 7, pg * 7 + 7).map((segment, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={admin === "ROLE_USER" ? () => handleRowClick(segment.id) : undefined}>
                                <TableCell>{segment.name}</TableCell>
                                {admin === "ROLE_ADMIN" && (
                                    <TableCell>{segment.coefficient}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={segments.length} rowsPerPage={7} page={pg}
                             onPageChange={handleChangePage}/>
            <div style={{marginTop: "2.5vw"}}>
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                            onClick={handleAddSegment}>
                        Добавить сегмент
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                            onClick={handleEditSegment}>
                        Изменить сегмент
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button variant="contained" color="error" onClick={handleDeleteSegment}>
                        Удалить сегмент
                    </Button>
                }
            </div>
            <Dialog open={openAddSegmentDialog} onClose={() => setOpenAddSegmentDialog(false)}>
                <DialogTitle>Добавить новый сегмент</DialogTitle>
                <DialogContent>
                    <InputLabel id="scoring-select-label-add">Метод оценки</InputLabel>
                    <Select
                        labelId="scoring-select-label-add"
                        id="scoring-select-add"
                        value={newSegment.methodId}
                        onChange={(e) => setNewSegment({...newSegment, methodId: e.target.value as number})}
                        fullWidth
                    >
                        {scoringMethods.map((method, index) => (
                            <MenuItem key={index} value={method.id}>{method.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newSegment.name}
                        onChange={(e) => setNewSegment({...newSegment, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={newSegment.coefficient > 0 && newSegment.coefficient}
                        onChange={(e) => setNewSegment({
                            ...newSegment,
                            coefficient: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddSegmentDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveSegment} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditSegmentDialog} onClose={() => setOpenEditSegmentDialog(false)}>
                <DialogTitle>Изменить сегмент</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-edit">Сегмент</InputLabel>
                    <Select
                        labelId="catalog-select-label-edit"
                        id="catalog-select-edit"
                        value={idEditSegment}
                        onChange={async (e) => {
                            const selectedSegment = segments.find(segment => segment.id === e.target.value);
                            setIdEditSegment(e.target.value as number)
                            if (selectedSegment) {
                                try {
                                    const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/segment/${selectedSegment.id}`, {
                                        headers: {
                                            Authorization: `${token}`
                                        }
                                    });
                                    const updatedSegment = response.data;
                                    setEditSegment({
                                        name: updatedSegment.name,
                                        coefficient: updatedSegment.coefficient
                                    })
                                } catch (error) {
                                    console.error('Error fetching updated tender:', error);
                                }
                            }
                        }}
                        fullWidth
                    >
                        {segments.map((segment, index) => (
                            <MenuItem key={index} value={segment.id}>{segment.name}</MenuItem>
                        ))}
                    </Select>
                    <InputLabel id="scoring-select-label-add">Метод оценки</InputLabel>
                    <Select
                        labelId="scoring-select-label-add"
                        id="scoring-select-add"
                        value={editSegment.methodId}
                        onChange={(e) => setEditSegment({...editSegment, methodId: e.target.value as number})}
                        fullWidth
                    >
                        {scoringMethods.map((method, index) => (
                            <MenuItem key={index} value={method.id}>{method.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={editSegment.name}
                        onChange={(e) => setEditSegment({...editSegment, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Коэффициент"
                        type="number"
                        InputProps={{inputProps: {step: '0.01'}}}
                        value={editSegment.coefficient > 0 && editSegment.coefficient}
                        onChange={(e) => setEditSegment({
                            ...editSegment,
                            coefficient: parseFloat(e.target.value)
                        })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddSegmentDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedSegment} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteSegmentDialog} onClose={() => setOpenDeleteSegmentDialog(false)}>
                <DialogTitle>Удалить сегмент</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-delete">Сегмент</InputLabel>
                    <Select
                        labelId="catalog-select-label-delete"
                        id="catalog-select-delete"
                        value={deleteSegmentId}
                        onChange={(e) => setDeleteSegmentId(e.target.value as number)}
                        fullWidth
                    >
                        {segments.map((segment, index) => (
                            <MenuItem key={index} value={segment.id}>{segment.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteSegmentDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDeleteSegment} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default SegmentPage
