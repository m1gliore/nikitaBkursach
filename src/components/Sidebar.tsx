import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {
    AdminPanelSettingsOutlined,
    BarChartOutlined, InventoryOutlined, LoginOutlined,
    RequestQuoteOutlined,
    TabletAndroidOutlined
} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {jwtDecode} from "jwt-decode";
import {DecodedToken, LocalStorageData} from "../types/Token";

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
            <Logo to="/">Pm.</Logo>
            {isUser !== -1 &&
                <SidebarLink to="/catalogs">
                    <SidebarItem>
                        <TabletAndroidOutlined/>
                        <SidebarItemDesc>Каталог</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {isUser !== -1 &&
                <SidebarLink to="/applications">
                    <SidebarItem>
                        <RequestQuoteOutlined/>
                        <SidebarItemDesc>Заявки</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {(isUser === 2 || isUser === 3) &&
                <SidebarLink to="/offers">
                    <SidebarItem>
                        <InventoryOutlined/>
                        <SidebarItemDesc>Предложения</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {isUser !== -1 &&
                <SidebarLink to="/admin">
                    <SidebarItem>
                        <AdminPanelSettingsOutlined/>
                        <SidebarItemDesc>{(isUser === 0 || isUser === 2) ? "Администратор" : "Пользователь"}</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {(isUser === 0 || isUser === 2) &&
                <SidebarLink to="/statistics">
                    <SidebarItem>
                        <BarChartOutlined/>
                        <SidebarItemDesc>Статистика</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {isUser === -1 &&
                <SidebarLink to="/login">
                    <SidebarItem>
                        <LoginOutlined/>
                        <SidebarItemDesc>Вход</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
        </Wrapper>
    )
}

export default Sidebar
