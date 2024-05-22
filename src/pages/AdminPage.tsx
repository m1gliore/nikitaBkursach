import React, {useEffect, useState} from 'react';
import {Container} from "../components/Container";
import {AddOutlined, DeleteOutlined, EditOutlined, StoreOutlined, SupervisorAccountOutlined} from "@mui/icons-material";
import styled from "styled-components";
import {Button, Form, Input, TextArea} from "../components/FormContainer";
import {SubmitHandler, useForm} from "react-hook-form";
import {CompanyInfoFormInput, UserFormInput} from "../types/Forms";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {Company} from "../types/Company";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";

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
    const {register: registerAdmin, handleSubmit: handleSubmitAdmin} = useForm<UserFormInput>();
    const navigate = useNavigate()
    const [companyId, setCompanyId] = useState<number>(0)
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [activeAction, setActiveAction] = useState<string>("add")
    const [companies, setCompanies] = useState<Company[]>([])
    const [currentCompanyId, setCurrentCompanyId] = useState<number>(0)

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {

                try {
                    const response = await axios.get('http://localhost:8080/server/coursework-auth/api/company', {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                    setCompanies(response.data.list)
                } catch (error: any) {
                    alert(`Произошла ошибка при отправке запроса: ${error.message}`)
                }
            })()
        }
    }, [token])

    const onCreateCompany: SubmitHandler<CompanyInfoFormInput> = async (data) => {
        const requestBody = {
            name: data.name,
            address: data.address,
            uniqNumber: data.uniqNumber,
            description: data.description
        }

        await axios.post('http://localhost:8080/server/coursework-admin/api/company', requestBody, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => navigate(0))
            .catch(error => {
                alert(`Произошла ошибка при создании компании: ${error}`,)
            })
    }

    const onEditCompany: SubmitHandler<CompanyInfoFormInput> = async (data) => {
        const requestBody = {
            name: data.name,
            address: data.address,
            uniqNumber: data.uniqNumber,
            description: data.description
        }

        await axios.put(`http://localhost:8080/server/coursework-admin/api/company/${currentCompanyId}`, requestBody, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => navigate(0))
            .catch(error => {
                alert(`Произошла ошибка при изменении компании: ${error}`,)
            })
    }

    const onDeleteCompany: SubmitHandler<CompanyInfoFormInput> = async () => {

        await axios.delete(`http://localhost:8080/server/coursework-admin/api/company/${currentCompanyId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => navigate(0))
            .catch(error => {
                alert(`Произошла ошибка при удалении компании: ${error}`,)
            })
    }

    const onCreateUser: SubmitHandler<UserFormInput> = async (data) => {
        const requestBody = {
            companyId: companyId,
            email: data.email,
            name: data.name,
            surname: data.surname,
            patronymic: data.patronymic,
            avatar: "avatar"
        }

        try {
            await axios.post('http://localhost:8080/server/coursework-admin/api/user', requestBody, {
                headers: {
                    Authorization: `${token}`
                }
            }).then(() => navigate(0))
        } catch (error: any) {
            alert(`Произошла ошибка при отправке запроса: ${error.message}`)
        }
    }

    return (
        <Container>
            <AdminIcon style={{display: activePage === "admin" ? "block" : "none"}} fontSize="large"
                       onClick={() => setActivePage("company")}/>
            <CompanyIcon style={{display: activePage === "company" ? "block" : "none"}} fontSize="large"
                         onClick={() => setActivePage("admin")}/>
            <Main>
                <Title>
                    {activeAction === "add" ? "Добавить" :
                        activeAction === "edit" ? "Изменить" :
                            "Удалить"}
                    {activePage === "admin" ? " пользователя" : " компанию"}
                </Title>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <EditOutlined style={{
                        display: activeAction === "add" ? "flex" : "none",
                        margin: "0 2.5vw 1.5vw 0", cursor: "pointer"
                    }} fontSize="large"
                                  onClick={() => setActiveAction("edit")}/>
                    <AddOutlined style={{
                        display: activeAction !== "add" ? "flex" : "none",
                        margin: "0 2.5vw 1.5vw 0", cursor: "pointer"
                    }} fontSize="large"
                                 onClick={() => setActiveAction("add")}/>
                    <DeleteOutlined style={{
                        display: activeAction !== "delete" ? "flex" : "none",
                        marginBottom: "1.5vw", cursor: "pointer"
                    }} fontSize="large"
                                    onClick={() => setActiveAction("delete")}/>
                    <EditOutlined style={{
                        display: activeAction === "delete" ? "flex" : "none",
                        marginBottom: "1.5vw", cursor: "pointer"
                    }} fontSize="large"
                                  onClick={() => setActiveAction("edit")}/>
                </div>
                <Form style={{display: activePage === "company" && activeAction === "add" ? "flex" : "none"}}
                      onSubmit={handleSubmitCompany(onCreateCompany)}>
                    <Input {...registerCompany('name')} type="text" placeholder="Название компании"/>
                    <Input {...registerCompany('address')} type="text" placeholder="Адрес"/>
                    <Input {...registerCompany('uniqNumber')} type="text" placeholder="Регистрационный номер"/>
                    <TextArea {...registerCompany('description')} placeholder="Описание компании"/>
                    <Button type="submit">Создать</Button>
                </Form>

                <Form style={{display: activePage === "company" && activeAction === "edit" ? "flex" : "none"}}
                      onSubmit={handleSubmitCompany(onEditCompany)}>
                    <select onChange={(e) => {
                        setCurrentCompanyId(Number(e.target.value))
                    }} style={{border: "none", outline: "none", padding: ".5vw", borderRadius: ".25vw"}}>
                        <option value="">Выберите компанию</option>
                        {companies?.map((company, index) => (
                            <option key={index} value={company?.id}>{company?.name}</option>
                        ))}
                    </select>
                    <Input {...registerCompany('name')} type="text" placeholder="Название компании"/>
                    <Input {...registerCompany('address')} type="text" placeholder="Адрес"/>
                    <Input {...registerCompany('uniqNumber')} type="text" placeholder="Регистрационный номер"/>
                    <TextArea {...registerCompany('description')} placeholder="Описание компании"/>
                    <Button type="submit">Изменить</Button>
                </Form>

                <Form style={{display: activePage === "company" && activeAction === "delete" ? "flex" : "none"}}
                      onSubmit={handleSubmitCompany(onDeleteCompany)}>
                    <select onChange={(e) => {
                        setCurrentCompanyId(Number(e.target.value))
                    }} style={{border: "none", outline: "none", padding: ".5vw", borderRadius: ".25vw"}}>
                        <option value="">Выберите компанию</option>
                        {companies?.map((company, index) => (
                            <option key={index} value={company?.id}>{company?.name}</option>
                        ))}
                    </select>
                    <Button type="submit">Удалить</Button>
                </Form>

                <Form style={{display: activePage === "admin" ? "flex" : "none"}}
                      onSubmit={handleSubmitAdmin(onCreateUser)}>
                    <select onChange={(e) => {
                        setCompanyId(Number(e.target.value))
                    }} style={{border: "none", outline: "none", padding: ".5vw", borderRadius: ".25vw"}}>
                        <option value={0}>Выберите компанию</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                    <Input {...registerAdmin('email')} type="email" placeholder="Email"/>
                    <Input {...registerAdmin('surname')} placeholder="Фамилия"/>
                    <Input {...registerAdmin('name')} placeholder="Имя"/>
                    <Input {...registerAdmin('patronymic')} placeholder="Отчество"/>
                    <Button type="submit">Создать</Button>
                </Form>
            </Main>
        </Container>
    )
}

export default AdminPage
