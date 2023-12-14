import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import OffersPage from "./pages/OffersPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProductsPage from "./pages/ProductsPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import StatisticsPage from "./pages/StatisticsPage";
import CatalogsPage from "./pages/CatalogsPage";
import SingleProductPage from "./pages/SingleProductPage";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "./types/Token";
import {jwtDecode} from "jwt-decode";

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
    const [isUser, setIsUser] = useState<number>(-1)

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    return (
        <Wrapper>
            <Router>
                <Main>
                    <Sidebar/>
                    <Routes>
                        <Route path="*" element={<ErrorPage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        {(isUser === 2 || isUser === 3) && (
                            <Route path="/offers" element={<OffersPage/>}/>
                            )}
                        {isUser !== -1 &&
                            <Route path="/applications" element={<ApplicationsPage/>}/>
                        }
                        {isUser === -1 &&
                            <Route path="/products" element={<ProductsPage/>}/>
                        }
                        {isUser !== -1 &&
                            <Route path="/admin" element={<AdminPage/>}/>
                        }
                        {isUser === - 1 &&
                            <Route path="/login" element={<LoginPage/>}/>
                        }
                        {(isUser === 0 || isUser === 2) &&
                            <Route path="/statistics" element={<StatisticsPage/>}/>
                        }
                        {isUser !== -1 &&
                            <Route path="/catalogs" element={<CatalogsPage/>}/>
                        }
                        {isUser !== -1 &&
                            <Route path="/products/:productId" element={<SingleProductPage/>}/>
                        }
                    </Routes>
                </Main>
                <Footer/>
            </Router>
        </Wrapper>
    )
}

export default App
