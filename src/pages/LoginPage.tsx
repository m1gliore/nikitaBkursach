import React from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import {SubmitHandler, useForm} from "react-hook-form";
import {LoginFormInput} from "../types/Forms";
import axios from "axios";
import {Button, Form, Input} from "../components/FormContainer";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "react-use";

const Title = styled.h1``

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LoginPage: React.FC = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>()
    const navigate = useNavigate()
    const [, setUser] = useLocalStorage('user', "")

    const onLogin: SubmitHandler<LoginFormInput> = async (data) => {

        const requestBody = {
            username: data.username,
            password: data.password
        }

        try {
            await axios.post('http://localhost:8080/api/users/authentication', requestBody).then((res) => {
                setUser(res.data)
                navigate("/")
                navigate(0)
            })
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                alert('Ошибка авторизации: Неверное имя пользователя или пароль')
            } else {
                alert(`Произошла ошибка при отправке запроса: ${error.message}`)
            }
        }
    }

    return (
        <Container>
            <Main>
                <Title>Войти в аккаунт</Title>
                <Form onSubmit={handleSubmit(onLogin)}>
                    <Input
                        {...register('username', {
                            required: 'Имя пользователя обязательно',
                            pattern: {
                                value: /^[A-Z]\w*$/,
                                message: 'Имя пользователя должно начинаться с заглавной буквы'
                            }
                        })}
                        type="text"
                        placeholder="Имя пользователя"
                    />
                    {errors.username && <p style={{color: "red", textAlign: "center"}}>{errors.username.message}</p>}
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
                    {errors.password && <p style={{color: "red", textAlign: "center"}}>{errors.password.message}</p>}
                    <Button type="submit">Войти</Button>
                </Form>
            </Main>
        </Container>
    )
}

export default LoginPage
