import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import {StoreOutlined, SupervisorAccountOutlined} from "@mui/icons-material";
import styled from "styled-components";
import {Button, Form, Input, TextArea} from "../components/FormContainer";
import {SubmitHandler, useForm} from "react-hook-form";
import {CompanyInfoFormInput, UserAdminFormInput} from "../types/Forms";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {CompanyInfo} from "../types/Company";
import {useLocalStorage} from "react-use";
import {jwtDecode} from "jwt-decode";
import {DecodedToken, LocalStorageData} from "../types/Token";

const AdminIcon = styled(SupervisorAccountOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`

const CompanyIcon = styled(StoreOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 2.5vw;
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1``

const AdminPage: React.FC = () => {

    const [activePage, setActivePage] = useState<string>("admin")
    const {register: registerCompany, handleSubmit: handleSubmitCompany} = useForm<CompanyInfoFormInput>();
    const {register: registerAdmin, handleSubmit: handleSubmitAdmin} = useForm<UserAdminFormInput>();
    const navigate = useNavigate()
    const [companyInfos, setCompanyInfos] = useState<Array<CompanyInfo>>([])
    const [currentUserAdd, setCurrentUserAdd] = useState<string>("")
    const [user, setUser] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(-1)

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            await axios.get('http://localhost:8080/api/companies/all').then(res => setCompanyInfos(res.data.content))
        })()
    }, [])

    const onCreateCompany: SubmitHandler<CompanyInfoFormInput> = async (data) => {
        const requestBody = {
            nameCompany: data.nameCompany,
            description: data.description
        }

        try {
            await axios.post('http://localhost:8080/api/companies/createCompanyInfo', requestBody).then(() => navigate(0))
        } catch (error: any) {
            alert(`Произошла ошибка при отправке запроса: ${error.message}`)
        }
    }

    const onCreateAdmin: SubmitHandler<UserAdminFormInput> = async (data) => {
        const {username, id_company_info} = data

        try {
            if (currentUserAdd === "admin") {
                await axios.post(`http://localhost:8080/api/users/createUserWithRoleUserAdmin?username=${username}&id_company_info=${id_company_info}`, {})
                    .then(() => navigate(0))
            } else if (currentUserAdd === "user") {
                await axios.post(`http://localhost:8080/api/users/createUserWithRoleUserUser?username=${username}&id_company_info=${id_company_info}`, {})
                    .then(() => navigate(0))
            } else if (currentUserAdd === "companyUser") {
                await axios.post(`http://localhost:8080/api/users/createUserWithRoleUserCompanyUser?username=${username}&id_company_info=${id_company_info}`, {})
                    .then(() => navigate(0))
            } else {
                alert("Выберите, кого хотите добавить")
            }
        } catch (error: any) {
            alert(`Произошла ошибка при отправке запроса: ${error.message}`)
        }
    }

    return (
        <Container>
            {isUser === 0 &&
                <AdminIcon style={{display: activePage === "admin" ? "block" : "none"}} fontSize="large"
                           onClick={() => setActivePage("company")}/>
            }
            {isUser === 0 &&
                <CompanyIcon style={{display: activePage === "company" ? "block" : "none"}} fontSize="large"
                             onClick={() => setActivePage("admin")}/>
            }
            <Main>
                {(isUser === 0 || isUser === 2) &&
                    <Title>{activePage === "admin" ? "Добавить админа" : "Добавить компанию"}</Title>
                }
                <Form style={{display: activePage === "company" ? "flex" : "none"}}
                      onSubmit={handleSubmitCompany(onCreateCompany)}>
                    <Input {...registerCompany('nameCompany')} type="text" placeholder="Название компании"/>
                    <TextArea {...registerCompany('description')} placeholder="Описание компании"/>
                    <Button type="submit">Создать</Button>
                </Form>
                {(isUser === 0 || isUser === 2) &&
                    <Form style={{display: activePage === "admin" ? "flex" : "none"}}
                          onSubmit={handleSubmitAdmin(onCreateAdmin)}>
                        <select onChange={(e) => {
                            setCurrentUserAdd(e.target.value)
                        }} style={{border: "none", outline: "none", padding: ".5vw", borderRadius: ".25vw"}}>
                            <option value="">Добавить пользователя</option>
                            {isUser === 0 &&
                                <option value="admin">Администратора компании поставщика</option>
                            }
                            {isUser === 2 &&
                                <option value="user">Пользователя компании поставщика</option>
                            }
                            {isUser === 0 &&
                                <option value="companyUser">Пользователя компании заказчика</option>
                            }
                        </select>
                        <Input {...registerAdmin('username')} type="text" placeholder="Имя пользователя"/>
                        <select style={{
                            border: "none",
                            outline: "none",
                            padding: ".5vw",
                            borderRadius: ".25vw"
                        }} {...registerAdmin('id_company_info')}>
                            <option value="">Выберите компанию</option>
                            {companyInfos.map((companyInfo, index) => (
                                <option key={index} value={companyInfo.idCompanyInfo}>{companyInfo.nameCompany}</option>
                            ))}
                        </select>
                        <Button type="submit">Создать</Button>
                    </Form>
                }
                <Button style={{backgroundColor: "red", marginTop: "5vw"}} onClick={() => {
                    setUser({id_company: -1, token: "", username: ""})
                    navigate("/")
                    navigate(0)
                }}>Выйти с аккаунта</Button>
            </Main>
        </Container>
    )
}

export default AdminPage
