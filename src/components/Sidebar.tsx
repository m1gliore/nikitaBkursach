import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {
    AdminPanelSettingsOutlined,
    ArticleOutlined,
    BarChartOutlined, BusinessOutlined, ExitToAppOutlined, InventoryOutlined, LoginOutlined,
    RequestQuoteOutlined,
    TabletAndroidOutlined
} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {jwtDecode} from "jwt-decode";
import {DecodedToken, LocalStorageData} from "../types/Token";
import axios from "axios";

const Wrapper = styled.div`
  flex: 1.5;
  background-color: rgb(51, 51, 51);
  color: rgb(255, 255, 255);
  padding: .8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5vw;
  min-height: 90vh;
  height: 100%;
  gap: 2.5vh;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  cursor: pointer;
  color: rgb(255, 255, 255);
  text-decoration: none;
  margin: 1rem 0;
  font-weight: bold;

  &:hover {
    opacity: .8;
  }
`

const SidebarLink = styled(Link)`
  color: rgb(255, 255, 255);
  text-decoration: none;
`

const SidebarItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`

const SidebarItemDesc = styled.span`
  text-align: center;
`

const Sidebar: React.FC = () => {

    const [user, setUser] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(0)
    const [token, setToken] = useState<string>("")
    const [admin, setAdmin] = useState<string>("ROLE_USER")

    const navigate = useNavigate()

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
            <Logo to="/">Pm.</Logo>
            <SidebarLink to="/catalogs">
                <SidebarItem>
                    <TabletAndroidOutlined/>
                    <SidebarItemDesc>Каталог</SidebarItemDesc>
                </SidebarItem>
            </SidebarLink>
            <SidebarLink to="/tenders">
                <SidebarItem>
                    <RequestQuoteOutlined/>
                    <SidebarItemDesc>Тендеры</SidebarItemDesc>
                </SidebarItem>
            </SidebarLink>
            {admin === "ROLE_USER" &&
                <SidebarLink to="/offers">
                    <SidebarItem>
                        <InventoryOutlined/>
                        <SidebarItemDesc>Предложения</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            <SidebarLink to="/companies">
                <SidebarItem>
                    <BusinessOutlined/>
                    <SidebarItemDesc>Компании</SidebarItemDesc>
                </SidebarItem>
            </SidebarLink>
            {admin === "ROLE_ADMIN" &&
                <SidebarLink to="/admin">
                    <SidebarItem>
                        <AdminPanelSettingsOutlined/>
                        <SidebarItemDesc>Администратор</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            <SidebarLink to="/statistics">
                <SidebarItem>
                    <BarChartOutlined/>
                    <SidebarItemDesc>Статистика</SidebarItemDesc>
                </SidebarItem>
            </SidebarLink>
            {token === "" &&
                <SidebarLink to="/login">
                    <SidebarItem>
                        <LoginOutlined/>
                        <SidebarItemDesc>Вход</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {token !== "" &&
                <SidebarItem>
                    <ExitToAppOutlined onClick={async () => {
                        await axios.delete(`http://localhost:8080/server/coursework/api/logout/single`, {
                            headers: {
                                Authorization: `${token}`
                            },
                            params: {
                                token: token
                            }
                        })
                            .then(() => {
                                setUser({token: ""})
                                navigate("/")
                                navigate(0)
                            })
                    }}/>
                    <SidebarItemDesc>Выход</SidebarItemDesc>
                </SidebarItem>
            }
        </Wrapper>
    )
}

export default Sidebar
