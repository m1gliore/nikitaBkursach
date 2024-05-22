import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {Tooltip, PieChart, Pie, Cell} from 'recharts';
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";

const Title = styled.h1``;

const StatisticsPage: React.FC = () => {
    const [user,] = useLocalStorage<LocalStorageData>('user');
    const [token, setToken] = useState<string>("");
    const [admin, setAdmin] = useState<string>("")

    const [userData, setUserData] = useState<{ name: string, value: number }[]>([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

                admin === "ROLE_ADMIN" && axios.get(`http://localhost:8080/server/coursework-admin/api/company/statistic`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => console.log(res.data));
            })();
        }
    }, [admin, token]);

    return (
        <Container>
            <Title>Статистика</Title>
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </>
            )}
        </Container>
    )
}

export default StatisticsPage;
