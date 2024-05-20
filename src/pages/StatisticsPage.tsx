import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {BarChartOutlined, PieChartOutlineOutlined} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {CompanyInfo} from "../types/Company";
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
    const [companies, setCompanies] = useState<CompanyInfo[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [tenderCountingDebit, setTenderCountingDebit] = useState<{ value: number }>({ value: 0 });
    const [offerAllPriceGetByCompany, setOfferAllPriceGetByCompany] = useState<{ value: number }>({ value: 0 });
    const [offerAllPriceGetByCompanyDate, setOfferAllPriceGetByCompanyDate] = useState<{ value: number }>({ value: 0 });
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const [activePage, setActivePage] = useState<string>("diagram1");

    const [user,] = useLocalStorage<LocalStorageData>('user');
    const [token, setToken] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<string>("ROLE_USER")

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
                    .then(res => setIsAdmin(res.data.role));

                try {
                    const response = await axios.get(`http://localhost:8080/server/coursework-auth/api/company`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });

                    setCompanies(response.data.list)
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }

                try {
                    const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/tender/debit/total`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });

                    setTenderCountingDebit(response.data)
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }

                // try {
                //     const response = await axios.get(`server/coursework-admin/api/tenders/debit/analysis`, {
                //         headers: {
                //             Authorization: `${token}`
                //         }
                //     });
                //
                //     setTenderCountingCreditByCompany(response.data)
                // } catch (error) {
                //     console.error('Error fetching companies:', error);
                // }

                if (selectedCompanyId !== null) {
                    try {
                        const response = await axios.get(`http://localhost:8080/server/coursework-auth/api/company/${selectedCompanyId}/offer/debit`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        });

                        setOfferAllPriceGetByCompany(response.data);
                    } catch (error) {
                        console.error('Error fetching tender debit by company:', error);
                    }
                }
                
            })();
        }
    }, [selectedCompanyId, token]);

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

    useEffect(() => {
        if (selectedCompanyId !== null && selectedMonth !== null && selectedYear !== null) {
            (async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/server/coursework-auth/api/companies/${selectedCompanyId}/offers/debit/date`, {
                        headers: {
                            Authorization: `${token}`
                        },
                        params: {
                            month: selectedMonth,
                            year: selectedYear
                        }
                    });

                    setOfferAllPriceGetByCompanyDate(response.data);
                } catch (error) {
                    console.error('Error fetching offer debit by date:', error);
                }
            })();
        }
    }, [selectedCompanyId, selectedMonth, selectedYear, token]);

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

            <div style={{display: activePage === "diagram1" && isAdmin === "ROLE_ADMIN" ? "block" : "none"}}>
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

            <div style={{display: activePage === "diagram2" && isAdmin === "ROLE_ADMIN" ? "block" : "none"}}>
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

            <div style={{ display: activePage === "diagram1" && isAdmin === "ROLE_USER" ? "block" : "none" }}>
                <h1>Дебет предложений</h1>
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

            <div style={{ display: activePage === "diagram2" && isAdmin === "ROLE_USER" ? "block" : "none" }}>
                <h1>Дебет предложений по дате</h1>
                <TableContainer style={{ marginTop: '1vw' }}>
                    <Select value={selectedCompanyId} onChange={handleCompanySelectChange}>
                        {companies.map(company => (
                            <MenuItem key={company.id} value={company.id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedMonth} onChange={handleMonthSelectChange}>
                        <MenuItem value={1}>Январь</MenuItem>
                        <MenuItem value={2}>Февраль</MenuItem>
                        <MenuItem value={3}>Март</MenuItem>
                        <MenuItem value={4}>Апрель</MenuItem>
                        <MenuItem value={5}>Май</MenuItem>
                        <MenuItem value={6}>Июнь</MenuItem>
                        <MenuItem value={7}>Июль</MenuItem>
                        <MenuItem value={8}>Август</MenuItem>
                        <MenuItem value={9}>Сентябрь</MenuItem>
                        <MenuItem value={10}>Октябрь</MenuItem>
                        <MenuItem value={11}>Ноябрь</MenuItem>
                        <MenuItem value={12}>Декабрь</MenuItem>
                    </Select>
                    <Select value={selectedYear} onChange={handleYearSelectChange}>
                        <MenuItem value={2017}>2017</MenuItem>
                        <MenuItem value={2018}>2018</MenuItem>
                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2022}>2022</MenuItem>
                        <MenuItem value={2023}>2023</MenuItem>
                        <MenuItem value={2024}>2024</MenuItem>
                    </Select>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>Значение</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>{offerAllPriceGetByCompanyDate.value}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    );
};

export default StatisticsPage;
