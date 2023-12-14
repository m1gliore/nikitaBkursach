import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {CompanyAcceptOfferData} from "../types/Statistics";
import {BarChartOutlined, PieChartOutlineOutlined} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

const Title = styled.h1``;

const BarChartIcon = styled(BarChartOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`

const PieChartIcon = styled(PieChartOutlineOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`

const StatisticsPage: React.FC = () => {
    const [percentAcceptOfferData, setPercentAcceptOfferData] = useState<number>(0);
    const [companyAcceptOfferData, setCompanyAcceptOfferData] = useState<CompanyAcceptOfferData>({});
    const [percentFinishApplicationData, setPercentFinishApplicationData] = useState<number>(0);
    const [activePage, setActivePage] = useState<string>("percentAcceptOffer")

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
            const percentAcceptOfferResponse = await axios.get(`http://localhost:8080/api/offers/2/percent-accept-offer`);
            setPercentAcceptOfferData(percentAcceptOfferResponse.data);

            const companyAcceptOfferResponse = await axios.get(`http://localhost:8080/api/offers/percents-accept-offer`);
            setCompanyAcceptOfferData(companyAcceptOfferResponse.data);

            const percentFinishApplicationResponse = await axios.get(`http://localhost:8080/api/offers/percent-finish-application`);
            setPercentFinishApplicationData(percentFinishApplicationResponse.data);
        })();
    }, []);

    const transformedCompanyData = Object.keys(companyAcceptOfferData).map((company) => ({
        company,
        "Принятые предложения": isNaN(companyAcceptOfferData[company]) ? 0 : companyAcceptOfferData[company],
    }));

    return (
        <Container>
            <Title>Статистика</Title>
            {isUser === 2 &&
                <BarChartIcon style={{display: activePage === "percentAcceptOffer" ? "block" : "none"}} fontSize="large"
                           onClick={() => setActivePage("companyAcceptOffer")}/>
            }
            {isUser === 2 &&
                <PieChartIcon style={{display: activePage === "companyAcceptOffer" ? "block" : "none"}} fontSize="large"
                             onClick={() => setActivePage("percentAcceptOffer")}/>
            }
            {/* Круговая диаграмма для количества успешно принятых предложений в процентах */}
            {isUser === 2 &&
                <div style={{display: activePage === "percentAcceptOffer" ? "block" : "none"}}>
                    <h1>Процент выполненных предложений</h1>
                    <PieChart width={400} height={400}>
                        <Pie data={[{name: 'Принято', value: percentAcceptOfferData * 100}, {
                            name: 'Осталось',
                            value: 100 - (percentAcceptOfferData * 100)
                        }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {percentAcceptOfferData !== 0 && percentAcceptOfferData !== 100 &&
                                <Cell key={1} fill="#82ca9d"/>}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </div>
            }

            {/* Гистограмма для компаний и количества принятых предложений */}
            {isUser === 2 &&
                <div style={{display: activePage === "companyAcceptOffer" ? "block" : "none"}}>
                    <h1>Количетсво принятых предложений</h1>
                    <BarChart width={600} height={300} data={transformedCompanyData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="company"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="Принятые предложения" fill="#8884d8"/>
                    </BarChart>
                </div>
            }

            {/* Круговая диаграмма для количества завершённых заявок */}
            {isUser === 0 &&
                <div>
                    <h1>Процент завершённых заявок</h1>
                    <PieChart width={400} height={400}>
                        <Pie data={[{name: 'Завершено', value: percentFinishApplicationData * 100}, {
                            name: 'Осталось',
                            value: 100 - (percentFinishApplicationData * 100)
                        }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {percentFinishApplicationData !== 0 && percentFinishApplicationData !== 100 &&
                                <Cell key={1} fill="#82ca9d"/>}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </div>
            }
        </Container>
    );
};

export default StatisticsPage;
