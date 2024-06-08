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
import CampaignsPage from "./pages/CampaignsPage";
import axios from "axios";
import RegistrationPage from "./pages/RegistrationPage";
import AdCategoriesPage from "./pages/AdCategoriesPage";
import TargetingPage from "./pages/TargetingPage";
import UserProfile from "./pages/UserProfile";
import BudgetPlanningPage from "./pages/BudgetPlanningPage";
import PaymentsPage from "./pages/PaymentsPage";
import SingleCampaignPage from "./pages/SingleCampaignPage";
import AdMaterialsPage from "./pages/AdMaterialsPage";
import InteractionsPage from "./pages/InteractionsPage";

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

    // const [user,] = useLocalStorage<LocalStorageData>('user')
    // const [token, setToken] = useState<string>("")
    // const [admin, setAdmin] = useState<string>("ROLE_USER")

    // useEffect(() => {
    //     if (user?.token) {
    //         setToken(user.token)
    //     }
    // }, [user])

    // useEffect(() => {
    //     if (token) {
    //         axios.get(`http://localhost:8080/server/coursework/api/role`, {
    //             headers: {
    //                 Authorization: `${token}`
    //             }
    //         })
    //             .then(res => setAdmin(res.data.role));
    //     }
    // }, [token])
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    return (
        <Wrapper>
            <Router>
                <Sidebar isAdmin={isAdmin}/>
                <Main>
                    <Routes>
                        <Route path="*" element={<ErrorPage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<RegistrationPage/>}/>
                        {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
                        {/*    <Route path="/statistics" element={<StatisticsPage/>}/>}*/}
                        {isAdmin && <Route path="/statistics" element={<StatisticsPage/>}/>}
                        <Route path="/campaigns" element={<CampaignsPage isAdmin={isAdmin}/>}/>
                        {/*campaignId*/}
                        {(isAdmin || !isAdmin) && <Route path="/campaigns/1" element={<SingleCampaignPage isAdmin={isAdmin}/>}/>}
                        {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
                        {/*    <Route path="/segments" element={<AdMaterialsPage/>}/>}*/}
                        {isAdmin && <Route path="/admaterials" element={<AdCategoriesPage isAdmin={isAdmin}/>}/>}
                        {isAdmin && <Route path="/admaterials/1" element={<AdMaterialsPage isAdmin={isAdmin}/>}/>}
                        {/*{admin === "ROLE_ADMIN" && <Route path="/scoring" element={<TargetingPage/>}/>}*/}
                        {isAdmin && <Route path="/targeting" element={<TargetingPage isAdmin={isAdmin}/>}/>}
                        {/*{admin === "ROLE_USER" && <Route path="/user" element={<UserProfile/>}/>}*/}
                        {!isAdmin && <Route path="/user" element={<UserProfile/>}/>}
                        {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
                        {/*    <Route path="/finance" element={<BudgetPlanningPage/>}/>}*/}
                        {isAdmin && <Route path="/finance" element={<BudgetPlanningPage isAdmin={isAdmin}/>}/>}
                        {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
                        {/*    <Route path="/loans" element={<PaymentsPage/>}/>}*/}
                        {isAdmin && <Route path="/payments" element={<PaymentsPage isAdmin={isAdmin}/>}/>}
                        {isAdmin && <Route path="/interactions" element={<InteractionsPage isAdmin={isAdmin}/>}/>}
                    </Routes>
                </Main>
                <Footer/>
            </Router>
        </Wrapper>
    )
}

export default App
