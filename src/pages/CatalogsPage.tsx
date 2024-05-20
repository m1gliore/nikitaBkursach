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
import {Catalog} from "../types/Catalogs";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";

const Title = styled.h1`
`

const CatalogsPage: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Array<Catalog>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openAddCatalogDialog, setOpenAddCatalogDialog] = useState<boolean>(false);
    const [openEditCatalogDialog, setOpenEditCatalogDialog] = useState<boolean>(false);
    const [openDeleteCatalogDialog, setOpenDeleteCatalogDialog] = useState<boolean>(false);
    const [newCatalog, setNewCatalog] = useState<Catalog>({name: '', description: ''});
    const [idEditCatalog, setIdEditCatalog] = useState<number>(0)
    const [editCatalog, setEditCatalog] = useState<Catalog>({
        name: '',
        description: ''
    });
    const [deleteCatalogId, setDeleteCatalogId] = useState<number>(0)
    const navigate = useNavigate();
    const [token, setToken] = useState<string>("")
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [admin, setAdmin] = useState<string>("ROLE_USER")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                axios.get(`http://localhost:8080/server/coursework-auth/api/catalog`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setCatalogs(res.data.list));

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

    const handleAddCatalog = () => {
        setOpenAddCatalogDialog(true);
    }

    const handleSaveCatalog = () => {
        axios.post('http://localhost:8080/server/coursework-admin/api/catalog', newCatalog, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddCatalogDialog(false)
                navigate(0)
            })
    }

    const handleEditCatalog = () => {
        setOpenEditCatalogDialog(true);
    }

    const handleSaveEditedCatalog = () => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/catalog/${idEditCatalog}`, editCatalog, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditCatalogDialog(false)
                navigate(0)
            })
    }

    const handleDeleteCatalog = () => {
        setOpenDeleteCatalogDialog(true);
    }

    const handleConfirmDeleteCatalog = () => {
        axios.delete(`http://localhost:8080/server/coursework-admin/api/catalog/${deleteCatalogId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenDeleteCatalogDialog(false)
                navigate(0)
            })
    }

    return (
        <Container>
            <Title>Каталоги</Title>
            <div>
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                            onClick={handleAddCatalog}>
                        Добавить каталог
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                            onClick={handleEditCatalog}>
                        Изменить каталог
                    </Button>
                }
                {admin === "ROLE_ADMIN" &&
                    <Button variant="contained" color="error" onClick={handleDeleteCatalog}>
                        Удалить каталог
                    </Button>
                }
            </div>

            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {catalogs.slice(pg * 7, pg * 7 + 7).map((catalog, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={() => navigate(`/items?catalog=${catalog.id}`)}>
                                <TableCell>{catalog.name}</TableCell>
                                <TableCell>{catalog.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={catalogs.length} rowsPerPage={7} page={pg}
                             onPageChange={handleChangePage}/>
            <Dialog open={openAddCatalogDialog} onClose={() => setOpenAddCatalogDialog(false)}>
                <DialogTitle>Добавить новый каталог</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={newCatalog.name}
                        onChange={(e) => setNewCatalog({...newCatalog, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newCatalog.description}
                        onChange={(e) => setNewCatalog({...newCatalog, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddCatalogDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveCatalog} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditCatalogDialog} onClose={() => setOpenEditCatalogDialog(false)}>
                <DialogTitle>Изменить каталог</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-edit">Каталог</InputLabel>
                    <Select
                        labelId="catalog-select-label-edit"
                        id="catalog-select-edit"
                        value={idEditCatalog}
                        onChange={(e) => setIdEditCatalog(e.target.value as number)}
                        fullWidth
                    >
                        {catalogs.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.id}>{catalog.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={editCatalog.name}
                        onChange={(e) => setEditCatalog({...editCatalog, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={editCatalog.description}
                        onChange={(e) => setEditCatalog({...editCatalog, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddCatalogDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedCatalog} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteCatalogDialog} onClose={() => setOpenDeleteCatalogDialog(false)}>
                <DialogTitle>Удалить каталог</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-delete">Каталог</InputLabel>
                    <Select
                        labelId="catalog-select-label-delete"
                        id="catalog-select-edit"
                        value={deleteCatalogId}
                        onChange={(e) => setDeleteCatalogId(e.target.value as number)}
                        fullWidth
                    >
                        {catalogs.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.id}>{catalog.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteCatalogDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDeleteCatalog} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default CatalogsPage
