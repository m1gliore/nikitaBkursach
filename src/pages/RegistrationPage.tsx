import React, {useState} from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import {SubmitHandler, useForm} from "react-hook-form";
import {SignUpFormInput} from "../types/Forms";
import axios from "axios";
import {Button, Form, Input} from "../components/FormContainer";
import {Link, useNavigate} from "react-router-dom";
import {Button as ButtonMUI} from '@mui/material';
import {CloudUpload} from "@mui/icons-material";

const Title = styled.h1``

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SignIn = styled(Link)`
  color: rgb(0, 0, 0);
  text-decoration: none;
`

const RegistrationPage: React.FC = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFormInput>()
    const navigate = useNavigate()

    const onReg: SubmitHandler<SignUpFormInput> = async (data) => {

        if (data.password === data.repPassword) {

            const reqBody = {
                email: data.email,
                password: data.password,
                companyName: data.username
            }

            try {
                await axios.post('http://localhost:8080/server/coursework/api/singUp', reqBody)
                    .then(() => {
                        navigate('/login')
                        navigate(0)
                    })
            } catch (error: any) {
                alert(`Произошла ошибка при регистрации: ${error}`)
            }
        } else {
            alert(`Пароли не совпадают`)
        }
    }

    return (
        <Container>
            <Main>
                <Title>Зарегистрироваться</Title>
                <Form onSubmit={handleSubmit(onReg)}>
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="Email"
                    />
                    <Input
                        {...register('username')}
                        placeholder="Имя пользователя"
                    />
                    {errors.email && <p style={{color: "red", textAlign: "center"}}>{errors.email.message}</p>}
                    <Input
                        {...register('password', {
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 8,
                                message: 'Пароль должен содержать не менее 8 символов'
                            }
                        })}
                        type="password"
                        placeholder="Пароль"
                    />
                    <Input
                        {...register('repPassword', {
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 8,
                                message: 'Пароль должен содержать не менее 8 символов'
                            }
                        })}
                        type="password"
                        placeholder="Повторите пароль"
                    />
                    {errors.password &&
                        <p style={{color: "red", textAlign: "center"}}>{errors.password.message}</p>}
                    <Button type="submit">Зарегистрироваться</Button>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <SignIn to="/login">Войти</SignIn>
                    </div>
                </Form>
            </Main>
        </Container>
    )
}

export default RegistrationPage
