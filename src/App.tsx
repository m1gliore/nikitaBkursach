import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import OffersPage from "./pages/OffersPage";
import TendersPage from "./pages/TendersPage";
import ItemsPage from "./pages/ItemsPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import StatisticsPage from "./pages/StatisticsPage";
import CatalogsPage from "./pages/CatalogsPage";
import SingleItemPage from "./pages/SingleItemPage";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "./types/Token";
import CompanyPage from "./pages/CompanyPage";
import axios from "axios";

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
                        {admin === "ROLE_USER" && <Route path="/offers" element={<OffersPage/>}/>}
                        <Route path="/tenders" element={<TendersPage/>}/>
                        <Route path="/items" element={<ItemsPage/>}/>
                        {admin === "ROLE_ADMIN" && <Route path="/admin" element={<AdminPage/>}/>}
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/statistics" element={<StatisticsPage/>}/>
                        <Route path="/catalogs" element={<CatalogsPage/>}/>
                        <Route path="/items/:itemId" element={<SingleItemPage/>}/>
                        <Route path="/companies" element={<CompanyPage/>}/>
                    </Routes>
                </Main>
                <Footer/>
            </Router>
        </Wrapper>
    )
}

export default App
