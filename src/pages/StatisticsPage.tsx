import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {Tooltip, PieChart, Pie, Cell, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar} from 'recharts';
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Company} from "../types/Company";
import {InputLabel, MenuItem, Select} from "@mui/material";
import {Segment} from "../types/Segments";

const Title = styled.h1``;

const StatisticsPage: React.FC = () => {
    const [user,] = useLocalStorage<LocalStorageData>('user');
    const [token, setToken] = useState<string>("");
    const [admin, setAdmin] = useState<string>("")
    const [companies, setCompanies] = useState<Company[]>([])
    const [idCompany, setIdCompany] = useState<number>(0)
    const [segments, setSegments] = useState<Segment[]>([])
    const [idSegment, setIdSegment] = useState<number>(0)
    const [financialValueType, setFinancialValueType] = useState<string>('VALUE_NET_INCOME')

    const [userData, setUserData] = useState<{ name: string, value: number }[]>([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [currentStat, setCurrentStat] = useState<string>('stat1')

    const [adminData1, setAdminData1] = useState<{ uuid: string, value: number }[]>([]);
    const [adminData2, setAdminData2] = useState<{ uuid: string, value: number }[]>([]);
    const [adminData3, setAdminData3] = useState<{ name: string, value: number }[]>([]);
    const [adminData4, setAdminData4] = useState<{ name: string, value: number }[]>([]);

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
                    .then(res => setUserData([{name: 'Принято', value: (res.data.value * 100)}, {
                        name: 'Отклонено',
                        value: 100 - (res.data.value * 100)
                    }]));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/${idCompany}/statistic/scoring/dynamic`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        type: financialValueType
                    }
                })
                    .then(res => {
                        const transformedData = Object.entries(res.data.loans).map(([key, value]) => {
                            const uuidMatch = key.match(/uuid=([a-f0-9\-]+)/);
                            return {
                                uuid: uuidMatch ? uuidMatch[1] : key,
                                value: Number(value)
                            };
                        });
                        setAdminData1(transformedData);
                    });

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/${idCompany}/segment/${idSegment}/statistic/scoring`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        type: financialValueType
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        const transformedData = Object.entries(res.data.loans).map(([key, value]) => {
                            const uuidMatch = key.match(/uuid=([a-f0-9\-]+)/);
                            return {
                                uuid: uuidMatch ? uuidMatch[1] : key,
                                value: Number(value)
                            };
                        });
                        setAdminData2(transformedData);
                    });

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/${idCompany}/statistic/loan`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdminData3([{name: 'Принято', value: (res.data.value * 100)}, {
                        name: 'Отклонено',
                        value: 100 - (res.data.value * 100)
                    }]));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/statistic`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        const transformedData2 = Object.entries(res.data).map(([key, value]) => {
                            const nameMatch = key.match(/name=([^,]+)/);
                            return {
                                name: nameMatch ? nameMatch[1] : key,
                                value: (Number(value) * 100)
                            };
                        }).filter(item => !isNaN(item.value));
                        setAdminData4(transformedData2)
                    });

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setCompanies(res.data.list));

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/segment`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setSegments(res.data.list));
            })();
        }
    }, [admin, financialValueType, idCompany, idSegment, token]);

    return (
        <Container>
            <Title>Статистика</Title>
            <div style={{display: 'flex', gap: '15vw'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <InputLabel id="company-select-label-edit">Компания</InputLabel>
                    <Select
                        labelId="company-select-label-edit"
                        id="company-select-edit"
                        value={idCompany}
                        onChange={async (e) => setIdCompany(e.target.value as number)}
                        fullWidth
                        sx={{width: '10vw'}}
                    >
                        {companies.map((company, index) => (
                            <MenuItem key={index} value={company.id}>{company.name}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <InputLabel id="segment-select-label-edit">Сегмент</InputLabel>
                    <Select
                        labelId="segment-select-label-edit"
                        id="segment-select-edit"
                        value={idSegment}
                        onChange={async (e) => setIdSegment(e.target.value as number)}
                        fullWidth
                        sx={{width: '10vw'}}
                    >
                        {segments.map((segment, index) => (
                            <MenuItem key={index} value={segment.id}>{segment.name}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <InputLabel id="fin-select-label-edit">Сегмент</InputLabel>
                    <Select
                        labelId="fin-select-label-edit"
                        id="fin-select-edit"
                        value={financialValueType}
                        onChange={async (e) => setFinancialValueType(e.target.value)}
                        fullWidth
                        sx={{width: '10vw'}}
                    >
                        <MenuItem value='VALUE_NET_INCOME'>Чистая прибыль</MenuItem>
                        <MenuItem value='VALUE_TOTAL_ASSETS'>Общие активы</MenuItem>
                        <MenuItem value='VALUE_TOTAL_EQUITY'>Общий капитал</MenuItem>
                        <MenuItem value='VALUE_TOTAL_LIABILITIES'>Общие обязательства</MenuItem>
                        <MenuItem value='VALUE_SALES_REVENUE'>Выручка от продаж</MenuItem>
                        <MenuItem value='VALUE_MARKET_VALUE'>Рыночная стоимость</MenuItem>
                        <MenuItem value='VALUE_CASH_FLOW'>Денежный поток</MenuItem>
                        <MenuItem value='VALUE_AMOUNT'>Сумма</MenuItem>
                        <MenuItem value='VALUE_ALL'>Общая прибыль</MenuItem>
                    </Select>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <InputLabel id="stat-select-label-edit">Статистика</InputLabel>
                    <Select
                        labelId="stat-select-label-edit"
                        id="stat-select-edit"
                        value={currentStat}
                        onChange={async (e) => setCurrentStat(e.target.value)}
                        fullWidth
                        sx={{width: '10vw'}}
                    >
                        <MenuItem value='stat1'>Динамика скоринга</MenuItem>
                        <MenuItem value='stat2'>Статистика скоринга по сегменту компании</MenuItem>
                        <MenuItem value='stat3'>Статистика принятых займов по компании</MenuItem>
                        <MenuItem value='stat4'>Общая статистика принятых займов по всем компаниям</MenuItem>
                    </Select>
                </div>
            </div>
            {admin === "ROLE_USER" && userData.length > 0 && (
                <>
                    <h2>Процент принятых и отклоненных заявок</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={userData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {userData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </>
            )}
            {admin === "ROLE_ADMIN" && currentStat === 'stat1' && (
                <>
                    <h2>Динамика скоринга</h2>
                    <BarChart width={600} height={300} data={adminData1}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="uuid" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </>
            )}
            {admin === "ROLE_ADMIN" && currentStat === 'stat2' && (
                <>
                    <h2>Статистика скоринга по сегменту компании</h2>
                    <BarChart width={600} height={300} data={adminData2}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="uuid" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </>
            )}
            {admin === "ROLE_ADMIN" && currentStat === 'stat3' && (
                <>
                    <h2>Статистика принятых займов по компании</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={adminData3}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {adminData3.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </>
            )}
            {admin === "ROLE_ADMIN" && currentStat === 'stat4' && (
                <>
                    <h2>Общая статистика принятых займов по всем компаниям</h2>
                    <BarChart width={600} height={300} data={adminData4}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </>
            )}
        </Container>
    )
}

export default StatisticsPage;
