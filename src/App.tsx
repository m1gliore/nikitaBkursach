import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import StatisticsPage from "./pages/StatisticsPage";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "./types/Token";
import CompanyPage from "./pages/CompanyPage";
import axios from "axios";
import RegistrationPage from "./pages/RegistrationPage";
import SegmentPage from "./pages/SegmentPage";
import ScoringMethodsPage from "./pages/ScoringMethodsPage";
import UserProfile from "./pages/UserProfile";
import FinancialDataPage from "./pages/FinancialDataPage";
import LoanPage from "./pages/LoanPage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Main = styled.div`
  display: flex;
  height: fit-content;
`

const App: React.FC = () => {

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [admin, setAdmin] = useState<string>("ROLE_USER")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:8080/server/coursework/api/role`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then(res => setAdmin(res.data.role));
        }
    }, [token])

    return (
        <Wrapper>
            <Router>
                <Main>
                    <Sidebar/>
                    <Routes>
                        <Route path="*" element={<ErrorPage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        {/*{admin === "ROLE_ADMIN" && <Route path="/admin" element={<AdminPage/>}/>}*/}
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<RegistrationPage/>}/>
                        {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") && <Route path="/statistics" element={<StatisticsPage/>}/>}
                        <Route path="/companies" element={<CompanyPage/>}/>
                        {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") && <Route path="/segments" element={<SegmentPage/>}/>}
                        {admin === "ROLE_ADMIN" && <Route path="/scoring" element={<ScoringMethodsPage/>}/>}
                        {admin === "ROLE_USER" && <Route path="/user" element={<UserProfile/>}/>}
                        {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") && <Route path="/finance" element={<FinancialDataPage/>}/>}
                        {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") && <Route path="/loans" element={<LoanPage/>}/>}
                    </Routes>
                </Main>
                <Footer/>
            </Router>
        </Wrapper>
    )
}

export default App
