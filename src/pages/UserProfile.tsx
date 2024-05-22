import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {User} from "../types/User";
import {
    Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField, Typography
} from "@mui/material";
import {Segment} from "../types/Segments";
import {Company} from "../types/Company";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Title = styled.h1``

const UserProfile: React.FC = () => {

    const navigate = useNavigate()
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [userInfo, setUserInfo] = useState<User>()
    const [segments, setSegments] = useState<Array<Segment>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditUserInfoDialog, setOpenEditUserInfoDialog] = useState<boolean>(false);
    const [openEditCompanyDialog, setOpenEditCompanyDialog] = useState<boolean>(false);
    const [newUserInfo, setNewUserInfo] = useState<User>({
        email: '',
        oldPassword: '',
        newPassword: '',
        username: ''
    })
    const [newCompany, setNewCompany] = useState<Company>({
        name: '',
        address: '',
        description: '',
        //сделать бимбим TODO
        fileImageBrand: 5
    })
    const [companyImage, setCompanyImage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    const response = await axios.get('http://localhost:8080/server/coursework-auth/api/user/fullInfo', {
                        headers: {
                            Authorization: `${token}`
                        }
                    });

                    setUserInfo(response.data);

                    if (response.data.company && response.data.company.fileImageBrand) {
                        const fileId = response.data.company.fileImageBrand;

                        try {
                            const fileResponse = await axios.get(`http://localhost:8080/server/coursework-auth/api/file/${fileId}/view`, {
                                headers: {
                                    Authorization: `${token}`
                                },
                                responseType: 'arraybuffer'
                            });

                            const blob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });
                            setCompanyImage(URL.createObjectURL(blob));
                        } catch (error) {
                            console.error('Error fetching image:', error);
                        }
                    }

                } catch (error: any) {
                    alert(`Произошла ошибка при отправке запроса: ${error.message}`)
                }

                axios.get(`http://localhost:8080/server/coursework-user/api/company/segment`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setSegments(res.data.list))
            })()
        }
    }, [token])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleRowClick = async (idSegment: number | undefined) => {
        axios.delete(`http://localhost:8080/server/coursework-user/api/company/segment/${idSegment}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
            })
    }

    const handleEditUserInfo = () => {
        setOpenEditUserInfoDialog(true);
    }

    const handleEditCompany = () => {
        setOpenEditCompanyDialog(true);
    }

    const handleSaveEditedUserInfo = () => {
        const { email, oldPassword, newPassword, username } = newUserInfo;

        // Создаем массив промисов для выполнения всех запросов
        const requests = [];

        // Проверяем каждое поле и добавляем соответствующий запрос в массив
        if (email?.trim() !== '') {
            const emailReq = axios.put('http://localhost:8080/server/coursework-auth/api/user/email', { email }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            requests.push(emailReq);
        }

        if (username?.trim() !== '') {
            const usernameReq = axios.put('http://localhost:8080/server/coursework-auth/api/user/username', { username }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            requests.push(usernameReq);
        }

        if (oldPassword?.trim() !== '' && newPassword?.trim() !== '') {
            const passwordReq = axios.put('http://localhost:8080/server/coursework-auth/api/user/password', { oldPassword, newPassword }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            requests.push(passwordReq);
        } else if ((oldPassword?.trim() !== '' && newPassword?.trim() === '') || (oldPassword?.trim() === '' && newPassword?.trim() !== '')) {
            alert("Введите пароль");
            return;
        }

        // Выполняем все запросы параллельно
        Promise.all(requests)
            .then(() => {
                setOpenEditUserInfoDialog(false);
                navigate(0);
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    alert("Вы ввели неверный пароль");
                } else {
                    alert(`Произошла ошибка при отправке запроса: ${error.message}`);
                }
            });
    };

    const handleSaveEditedCompany = () => {
        axios.put(`http://localhost:8080/server/coursework-user/api/company`, newCompany, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenEditCompanyDialog(false)
                navigate(0)
            })
    }

    return (
        <Container>
            <Main>
                <Title>
                    Здравствуйте, {userInfo?.username}
                </Title>
                <Grid container spacing={3} style={{ marginBottom: "2.5vw" }}>
                    <Grid item xs={12} sm={6}>
                        <Card sx={{height: '25vh'}}>
                            <CardContent>
                                <Typography variant="h5">Информация о пользователе</Typography>
                                {companyImage && <img src={companyImage} alt="Company" style={{ marginTop: '1rem', width: '2.5vw', height: '2.5vw' }} />}
                                <Typography>Email: {userInfo?.email}</Typography>
                                <Typography>Имя пользователя: {userInfo?.username}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card sx={{height: '25vh'}}>
                            <CardContent>
                                <Typography variant="h5">Информация о компании</Typography>
                                <Typography>Название: {userInfo?.company?.name}</Typography>
                                <Typography>Описание: {userInfo?.company?.description}</Typography>
                                <Typography>Адрес: {userInfo?.company?.address}</Typography>
                                <Typography>Уникальный номер: {userInfo?.company?.uniqueNumber}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <h2 style={{marginBottom: "0"}}>
                    Ваши сегменты
                </h2>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                {/*<TableCell>Коэффициент</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {segments.slice(pg * 2, pg * 2 + 2).map((segment, index) => (
                                <TableRow key={index} style={{cursor: "pointer"}}
                                          onClick={() => handleRowClick(segment.id)}>
                                    <TableCell>{segment.name}</TableCell>
                                    {/*<TableCell>{segment.coefficient}</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[2]} component="div" count={segments.length} rowsPerPage={2}
                                 page={pg}
                                 onPageChange={handleChangePage}/>
                <div style={{marginTop: "2.5vw"}}>
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="primary"
                            onClick={handleEditUserInfo}>
                        Изменить данные пользователя
                    </Button>
                    <Button style={{marginRight: "2.5vw"}} variant="contained" color="success"
                            onClick={handleEditCompany}>
                        Изменить данные компании
                    </Button>
                </div>
            </Main>
            <Dialog open={openEditUserInfoDialog} onClose={() => setOpenEditUserInfoDialog(false)}>
                <DialogTitle>Изменить данные пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        type="email"
                        value={newUserInfo.email}
                        onChange={(e) => setNewUserInfo({...newUserInfo, email: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Имя пользователя"
                        value={newUserInfo.username}
                        onChange={(e) => setNewUserInfo({...newUserInfo, username: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Старый пароль"
                        type="password"
                        value={newUserInfo.oldPassword}
                        onChange={(e) => setNewUserInfo({...newUserInfo, oldPassword: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Новый пароль"
                        type="password"
                        value={newUserInfo.newPassword}
                        onChange={(e) => setNewUserInfo({...newUserInfo, newPassword: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditUserInfoDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedUserInfo} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditCompanyDialog} onClose={() => setOpenEditCompanyDialog(false)}>
                <DialogTitle>Изменить данные компании</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название компании"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Адрес"
                        value={newCompany.address}
                        onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newCompany.description}
                        onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditCompanyDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveEditedCompany} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default UserProfile
