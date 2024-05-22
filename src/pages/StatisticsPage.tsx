import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {BarChartOutlined, PieChartOutlineOutlined} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Company} from "../types/Company";
import {
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

const Title = styled.h1``;

const BarChartIcon = styled(BarChartOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`;

const PieChartIcon = styled(PieChartOutlineOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`;

const StatisticsPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [tenderCountingDebit, setTenderCountingDebit] = useState<{ value: number }>({ value: 0 });
    const [offerAllPriceGetByCompany, setOfferAllPriceGetByCompany] = useState<{ value: number }>({ value: 0 });
    const [offerAllPriceGetByCompanyDate, setOfferAllPriceGetByCompanyDate] = useState<{ value: number }>({ value: 0 });
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [activePage, setActivePage] = useState<string>("diagram1");

    const [user,] = useLocalStorage<LocalStorageData>('user');
    const [token, setToken] = useState<string>("");
    const [admin, setAdmin] = useState<string>("")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token);
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            (async () => {

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

                admin === "ROLE_USER" && axios.get(`http://localhost:8080/server/coursework-user/api/loan/statistic`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => console.log(res.data));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/statistic`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => console.log(res.data));
            })();
        }
    }, [admin, selectedCompanyId, token]);

    const handleCompanySelectChange = (event: SelectChangeEvent<number | null>) => {
        const companyId = event.target.value; // companyId может быть строкой или числом
        setSelectedCompanyId(typeof companyId === 'string' ? parseInt(companyId) : companyId);
    };

    const handleMonthSelectChange = (event: SelectChangeEvent<number | null>) => {
        const month = event.target.value
        setSelectedMonth(typeof month === 'string' ? parseInt(month) : month);
    };

    const handleYearSelectChange = (event: SelectChangeEvent<number | null>) => {
        const year = event.target.value
        setSelectedYear(typeof year === 'string' ? parseInt(year) : year);
    };

    const data = [
        { name: 'Янв', value: 400 },
        { name: 'Фев', value: 300 },
        { name: 'Мар', value: 200 },
        { name: 'Апр', value: 278 },
        { name: 'Май', value: 189 },
    ];

    return (
        <Container>
            <Title>Статистика</Title>
            <BarChartIcon style={{display: activePage === "diagram1" ? "block" : "none"}} fontSize="large"
                          onClick={() => setActivePage("diagram2")}/>
            <PieChartIcon style={{display: activePage === "diagram2" ? "block" : "none"}}
                          fontSize="large"
                          onClick={() => setActivePage("diagram1")}/>

            <div style={{display: activePage === "diagram1" && admin === "ROLE_ADMIN" ? "block" : "none"}}>
                <h1>Дебет тендеров</h1>
                <TableContainer style={{marginTop: '1vw'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>Значение</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>{tenderCountingDebit.value}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div style={{display: activePage === "diagram2" && admin === "ROLE_ADMIN" ? "block" : "none"}}>
                <h1>Анализ дебета тендеров</h1>
                <BarChart width={600} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </div>

            <div style={{ display: activePage === "diagram1" && admin === "ROLE_USER" ? "block" : "none" }}>
                <h1>USER_LOAN_STATISTIC</h1>
                <TableContainer style={{ marginTop: '1vw' }}>
                    <Select value={selectedCompanyId} onChange={handleCompanySelectChange}>
                        {companies.map(company => (
                            <MenuItem key={company.id} value={company.id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>Значение</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>{offerAllPriceGetByCompany.value}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    )
}

export default StatisticsPage;
