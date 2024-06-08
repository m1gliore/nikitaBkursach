import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {ExitToAppOutlined, NotificationsOutlined} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import axios from "axios";

const Wrapper = styled.div`
  flex: 1.5;
  background-color: rgb(215, 219, 220);
  color: rgb(51, 51, 51);
  padding: .8vw;
  display: flex;
  align-items: center;
  width: calc(100% - 1.6vw);
  min-height: 5vh;
  height: 100%;
  gap: 2.5vw;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  cursor: pointer;
  color: rgb(51, 51, 51);
  text-decoration: none;
  margin: 1rem 0;
  font-weight: bold;

  &:hover {
    opacity: .8;
  }
`

const SidebarLink = styled(Link)`
  color: rgb(51, 51, 51);
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
  font-size: 1.5rem;
`

const Sidebar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {

    // const [user, setUser] = useLocalStorage<LocalStorageData>('user')
    // const [token, setToken] = useState<string>("")
    // const [admin, setAdmin] = useState<string>("")

    const navigate = useNavigate()

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
    //
    //     }
    // }, [token])

    return (
        <Wrapper>
            <Logo to="/">BM.</Logo>
            {/*{admin === "ROLE_ADMIN" &&*/}
            {(isAdmin || !isAdmin) &&
                <SidebarLink to="/campaigns">
                    <SidebarItem>
                        <SidebarItemDesc>Кампании</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
            {isAdmin &&
                <SidebarLink to="/admaterials">
                    <SidebarItem>
                        <SidebarItemDesc>Рекламные материалы</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{admin === "ROLE_ADMIN" &&*/}
            {isAdmin &&
                <SidebarLink to="/targeting">
                    <SidebarItem>
                        <SidebarItemDesc>Таргетинг</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
            {isAdmin &&
                <SidebarLink to="/payments">
                    <SidebarItem>
                        <SidebarItemDesc>Бюджетирование</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
            {isAdmin &&
                <SidebarLink to="/interactions">
                    <SidebarItem>
                        <SidebarItemDesc>Взаимодействия</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
            {isAdmin &&
                <SidebarLink to="/finance">
                    <SidebarItem>
                        <SidebarItemDesc>Планирование бюджета</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{admin === "ROLE_USER" &&*/}
            {!isAdmin &&
                <SidebarLink to="/user">
                    <SidebarItem>
                        <SidebarItemDesc>Профиль</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&*/}
            {isAdmin &&
                <SidebarLink to="/statistics">
                    <SidebarItem>
                        <SidebarItemDesc>Статистика</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{token === "" &&*/}
            {/*    <SidebarLink to="/login">*/}
            {/*        <SidebarItem>*/}
            {/*            <SidebarItemDesc>Войти</SidebarItemDesc>*/}
            {/*        </SidebarItem>*/}
            {/*    </SidebarLink>*/}
            {/*}*/}
            {/*{token !== "" &&*/}
                <SidebarItem>
                    {/*<ExitToAppOutlined onClick={async () => {*/}
                    {/*    await axios.delete(`http://localhost:8080/server/coursework/api/logout/single`, {*/}
                    {/*        headers: {*/}
                    {/*            Authorization: `${token}`*/}
                    {/*        },*/}
                    {/*        params: {*/}
                    {/*            token: token*/}
                    {/*        }*/}
                    {/*    })*/}
                    {/*        .then(() => {*/}
                    {/*            setUser({token: ""})*/}
                    {/*            navigate("/")*/}
                    {/*            navigate(0)*/}
                    {/*        })*/}
                    {/*}}/>*/}
                    <SidebarItemDesc>Выйти</SidebarItemDesc>
                </SidebarItem>
            {/*}*/}
        </Wrapper>
    )
}

export default Sidebar
