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
import {CompanyInfo} from "../types/Company";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

const Title = styled.h1`
`

const CatalogsPage: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Array<Catalog>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openAddCatalogDialog, setOpenAddCatalogDialog] = useState<boolean>(false);
    const [openEditCatalogDialog, setOpenEditCatalogDialog] = useState<boolean>(false);
    const [openDeleteCatalogDialog, setOpenDeleteCatalogDialog] = useState<boolean>(false);
    const [newCatalog, setNewCatalog] = useState<Catalog>({nameCatalog: '', description: '', idCompanyInfo: 0});
    const [editCatalog, setEditCatalog] = useState<Catalog>({idCatalog: 0, nameCatalog: '', description: '', idCompanyInfo: 0});
    const [deleteCatalogId, setDeleteCatalogId] = useState<number>(0)
    const [companies, setCompanies] = useState<Array<CompanyInfo>>([]);
    const navigate = useNavigate();

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(-1)

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            axios.get(`http://localhost:8080/api/catalogs/pageCatalogs`)
                .then(res => setCatalogs(res.data.content));

            axios.get(`http://localhost:8080/api/companies/all`)
                .then(res => setCompanies(res.data.content));
        })();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleAddCatalog = () => {
        setOpenAddCatalogDialog(true);
    }

    const handleSaveCatalog = () => {
        axios.post('http://localhost:8080/api/catalogs/saveCatalog', newCatalog)
            .then(() => {
                setOpenAddCatalogDialog(false)
                navigate(0)
            })
    }

    const handleEditCatalog = () => {
        setOpenEditCatalogDialog(true);
    }

    const handleSaveEditedCatalog = () => {
        axios.put('http://localhost:8080/api/catalogs/updateCatalog', editCatalog)
            .then(() => {
                setOpenEditCatalogDialog(false)
                navigate(0)
            })
    }

    const handleDeleteCatalog = () => {
        setOpenDeleteCatalogDialog(true);
    }

    const handleConfirmDeleteCatalog = () => {
        axios.delete(`http://localhost:8080/api/catalogs/deleteCatalog/${deleteCatalogId}?id_company_info=${user?.id_company}`)
            .then(() => {
                setOpenDeleteCatalogDialog(false)
                navigate(0)
            })
    }

    return (
        <Container>
            <Title>Каталоги</Title>
            <div>
                {isUser === 0 &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary" onClick={handleAddCatalog}>
                        Добавить каталог
                    </Button>
                }
                {isUser === 0 &&
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="success" onClick={handleEditCatalog}>
                        Изменить каталог
                    </Button>
                }
                {isUser === 0 &&
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
                                      onClick={() => navigate(`/products?catalog=${catalog.idCatalog}`)}>
                                <TableCell>{catalog.nameCatalog}</TableCell>
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
                        value={newCatalog.nameCatalog}
                        onChange={(e) => setNewCatalog({...newCatalog, nameCatalog: e.target.value})}
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
                    {/* Добавляем выпадающий список для выбора компании */}
                    <InputLabel id="company-select-label">Компания</InputLabel>
                    <Select
                        labelId="company-select-label"
                        id="company-select"
                        value={newCatalog.idCompanyInfo}
                        onChange={(e) => setNewCatalog({...newCatalog, idCompanyInfo: e.target.value as number})}
                        fullWidth
                    >
                        {companies.map((company, index) => (
                            <MenuItem key={index} value={company.idCompanyInfo}>{company.nameCompany}</MenuItem>
                        ))}
                    </Select>
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
                        value={editCatalog.idCatalog}
                        onChange={(e) => setEditCatalog({...editCatalog, idCatalog: e.target.value as number})}
                        fullWidth
                    >
                        {catalogs.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.idCatalog}>{catalog.nameCatalog}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={editCatalog.nameCatalog}
                        onChange={(e) => setEditCatalog({...editCatalog, nameCatalog: e.target.value})}
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
                    <InputLabel id="company-select-label-edit">Компания</InputLabel>
                    <Select
                        labelId="company-select-label-edit"
                        id="company-select-edit"
                        value={editCatalog.idCompanyInfo}
                        onChange={(e) => setEditCatalog({...editCatalog, idCompanyInfo: e.target.value as number})}
                        fullWidth
                    >
                        {companies.map((company, index) => (
                            <MenuItem key={index} value={company.idCompanyInfo}>{company.nameCompany}</MenuItem>
                        ))}
                    </Select>
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
                            <MenuItem key={index} value={catalog.idCatalog}>{catalog.nameCatalog}</MenuItem>
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
