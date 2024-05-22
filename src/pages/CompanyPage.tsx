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
    TablePagination
} from '@mui/material';
import {Container} from "../components/Container";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Company} from "../types/Company";

const Title = styled.h1`
`

const CompanyPage: React.FC = () => {
    const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false); // Состояние для диалога поиска
    const [searchQuery, setSearchQuery] = useState<string>(''); // Состояние для значения поиска
    const [companies, setCompanies] = useState<Array<Company>>([])
    const [pg, setPg] = useState<number>(0)

    const catalogId = useLocation().search.split("=")[1]

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/company`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });

                    setCompanies(response.data.list)
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }
            })();
        }
    }, [catalogId, token]);

    const handleSearchClick = () => {
        setOpenSearchDialog(true);
    }

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/company`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    searchWord: searchQuery
                }
            });
            setCompanies(response.data.list);

            setOpenSearchDialog(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    return (
        <Container>
            <Title>Компании</Title>
            <Button variant="contained" color="primary" onClick={handleSearchClick}>
                Поиск
            </Button>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Регистрационный номер</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.slice(pg * 5, pg * 5 + 5).map((company, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.description}</TableCell>
                                <TableCell>{company.address}</TableCell>
                                <TableCell>{company.uniqueNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[5]} component="div" count={companies.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)}>
                <DialogTitle>Поиск компании</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Поисковый запрос"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSearchDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSearch} color="primary">
                        Поиск
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CompanyPage
