import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {
    BarChartOutlined,
    CreditCardOutlined,
    ExitToAppOutlined, NotificationsOutlined,
    PersonOutlined,
    RequestQuoteOutlined,
    ScoreOutlined,
    SegmentOutlined, StoreOutlined
} from "@mui/icons-material";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import axios from "axios";
import {Notification} from "../types/Notification";
import {Badge, List, ListItem, ListItemText, Popover} from "@mui/material";

const Wrapper = styled.div`
  flex: 1.5;
  background-color: rgb(255, 255, 255);
  color: rgb(51, 51, 51);
  padding: .8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5vw;
  min-height: 90vh;
  height: 100%;
  gap: 2.5vh;
  border-right: .15vw solid rgb(51, 51, 51);
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
`

const NotificationPopover = styled(Popover)`
  .MuiPopover-paper {
    padding: 1rem;
    max-width: 300px;
  }
`

const Notifications = styled(NotificationsOutlined)`
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`

const NavItem = styled.div`
  color: rgb(255, 255, 255);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`

const Sidebar: React.FC = () => {

    const [user, setUser] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [admin, setAdmin] = useState<string>("")
    const [notifications, setNotifications] = useState<Array<Notification>>([])
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

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

    const checkForUpdates = useCallback(async () => {
        if (token) {
            await axios.get(`http://localhost:8080/server/coursework-auth/api/notification`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error('Network response was not ok');
                    }
                    return res;
                })
                .then(res => {
                    setNotifications(res.data.notifications);
                    setTimeout(checkForUpdates, 2000);
                })
                .catch(err => {
                    alert(`There was a problem with the fetch operation: ${err}`);
                    setTimeout(checkForUpdates, 2000);
                });
        }
    }, [token]);

    useEffect(() => {
        checkForUpdates();
    }, [checkForUpdates]);

    const handleNotificationsClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        // @ts-ignore
        setAnchorEl(event.currentTarget)
    }

    const handleNotificationsClose = async (id?: number) => {
        setAnchorEl(null)
        if (id) {
            await axios.delete(`http://localhost:8080/server/coursework-auth/api/notification/${id}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then(() => {
                    checkForUpdates()
                })
        }
    }

    return (
        <Wrapper>
            <Logo to="/">Bank.</Logo>
            {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&
                <Badge badgeContent={notifications.length} color="secondary">
                    <Notifications onClick={handleNotificationsClick}/>
                </Badge>
            }
            {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&
                <SidebarLink to="/segments">
                    <SidebarItem>
                        <SegmentOutlined/>
                        <SidebarItemDesc>Сегменты</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {admin === "ROLE_ADMIN" &&
                <SidebarLink to="/scoring">
                    <SidebarItem>
                        <ScoreOutlined/>
                        <SidebarItemDesc>Методы оценки</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&
                <SidebarLink to="/loans">
                    <SidebarItem>
                        <RequestQuoteOutlined/>
                        <SidebarItemDesc>Заявки</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {admin === "ROLE_ADMIN" &&
                <SidebarLink to="/companies">
                    <SidebarItem>
                        <StoreOutlined/>
                        <SidebarItemDesc>Компании</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {admin === "ROLE_USER" &&
                <SidebarLink to="/user">
                    <SidebarItem>
                        <PersonOutlined/>
                        <SidebarItemDesc>Профиль</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {/*{admin === "ROLE_ADMIN" &&*/}
            {/*    <SidebarLink to="/admin">*/}
            {/*        <SidebarItem>*/}
            {/*            <AdminPanelSettingsOutlined/>*/}
            {/*            <SidebarItemDesc>Администратор</SidebarItemDesc>*/}
            {/*        </SidebarItem>*/}
            {/*    </SidebarLink>*/}
            {/*}*/}
            {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&
                <SidebarLink to="/finance">
                    <SidebarItem>
                        <CreditCardOutlined/>
                        <SidebarItemDesc>Финансовые данные</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {(admin === "ROLE_ADMIN" || admin === "ROLE_USER") &&
                <SidebarLink to="/statistics">
                    <SidebarItem>
                        <BarChartOutlined/>
                        <SidebarItemDesc>Статистика</SidebarItemDesc>
                    </SidebarItem>
                </SidebarLink>
            }
            {token === "" &&
                <SidebarLink to="/login">
                    <SidebarItem>
                        <ExitToAppOutlined/>
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
            <NotificationPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => handleNotificationsClose()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List>
                    {notifications.map((notification, index) => {
                        return (
                            <ListItem key={index}>
                                <NavItem style={{color: "black"}}
                                         onClick={() => handleNotificationsClose(notification.notificationId)}
                                >
                                    <ListItemText primary={notification.message}/>
                                </NavItem>
                            </ListItem>
                        )
                    })}
                </List>
            </NotificationPopover>
        </Wrapper>
    )
}

export default Sidebar
