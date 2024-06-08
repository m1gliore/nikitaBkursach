import React, {useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import {Box, Toolbar} from '@mui/material';
import {BarChart} from '@mui/icons-material';
import {Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip} from 'recharts';
import {Payment, PaymentMethod} from "../types/Payment";
import {BudgetPlanning} from "../types/BudgetPlanning";
import {convertStatus} from "../methods/convertStatus";

const Title = styled.h1``;

const StatisticsPage: React.FC = () => {
    const [selectedStat, setSelectedStat] = useState<string>('Payments');

    const handleStatChange = (stat: string) => {
        setSelectedStat(stat);
    }

    const renderPaymentsStatistics = () => {
        const paymentsData: Payment[] = [
            {
                id: 1,
                userid: 1,
                campaignId: 1,
                amount: 100,
                paymentDate: new Date(),
                paymentMethod: convertStatus('creditCard', PaymentMethod)
            },
            {
                id: 2,
                userid: 2,
                campaignId: 2,
                amount: 150,
                paymentDate: new Date(),
                paymentMethod: convertStatus('erip', PaymentMethod)
            },
            // Добавьте другие данные по платежам
        ];

        return (
            <Box>
                <Title>Статистика платежей</Title>
                <RechartsBarChart width={400} height={300} data={paymentsData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="id" tickFormatter={(value) => `Платеж ${value}`}/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="amount" fill="#8884d8" name="Сумма"/>
                    <Bar dataKey="paymentMethod" fill="#82ca9d" name="Метод оплаты"/>
                </RechartsBarChart>
            </Box>
        );
    };

    const renderBudgetPlanningStatistics = () => {
        const budgetPlanningData: BudgetPlanning[] = [
            {id: 1, campaignId: 1, monthlyBudget: 1000, allocated: 500},
            {id: 2, campaignId: 2, monthlyBudget: 1500, allocated: 750},
            // Добавьте другие данные по планированию бюджета
        ];

        return (
            <Box>
                <Title>Статистика планирования бюджета</Title>
                <RechartsBarChart width={400} height={300} data={budgetPlanningData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="id" tickFormatter={(value) => `Бюджет ${value}`}/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="monthlyBudget" fill="#8884d8" name="Месячный бюджет"/>
                    <Bar dataKey="allocated" fill="#82ca9d" name="Распределено на текущий момент"/>
                </RechartsBarChart>
            </Box>
        );
    };

    const renderStatistics = () => {
        switch (selectedStat) {
            case 'Payments':
                return renderPaymentsStatistics();
            case 'BudgetPlanning':
                return renderBudgetPlanningStatistics();
            default:
                return null;
        }
    }

    return (
        <Container>
            <Toolbar>
                <div style={{
                    color: selectedStat === 'Payments' ? 'blue' : 'black',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                }} onClick={() => handleStatChange('Payments')}>
                    <BarChart/> Платежи
                </div>
                <div style={{
                    color: selectedStat === 'BudgetPlanning' ? 'blue' : 'black',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                }} onClick={() => handleStatChange('BudgetPlanning')}>
                    <BarChart/> Планирование бюджета
                </div>
            </Toolbar>
            <Box mt={2}>
                {renderStatistics()}
            </Box>
        </Container>
    );
}

export default StatisticsPage;
