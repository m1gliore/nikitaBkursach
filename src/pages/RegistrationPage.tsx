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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onReg: SubmitHandler<SignUpFormInput> = async (data) => {

        if (data.password === data.repPassword) {
            if (selectedFile) {
                let newFileId: number = 0
                if (selectedFile instanceof File) {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('fileType', "SYSTEM");
                    try {
                        const response = await axios.post('http://localhost:8080/server/coursework-public/api/file', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        newFileId = response.data.id
                    } catch (error) {
                        alert(`Произошла ошибка при отправке запроса: ${error}`);
                    }
                }

                const reqBody = {
                    email: data.email,
                    password: data.password,
                    companyName: data.companyName,
                    companyDescription: data.companyDescription,
                    companyAddress: data.companyAddress,
                    companyUniqueNumber: data.companyUniqueNumber,
                    fileImageBrand: newFileId
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
                        {...register('companyName')}
                        placeholder="Название компании"
                    />
                    <Input
                        {...register('companyDescription')}
                        placeholder="Описание компании"
                    />
                    <Input
                        {...register('companyAddress')}
                        placeholder="Адрес компании"
                    />
                    <Input
                        {...register('companyUniqueNumber')}
                        placeholder="Регистрационный номер компании"
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
                    <div style={{marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                        <input
                            id="image-upload"
                            type="file"
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="image-upload" style={{marginRight: '8px'}}>
                            <ButtonMUI component="span" variant="contained" startIcon={<CloudUpload/>}
                                       color="primary">
                                Загрузить изображение
                            </ButtonMUI>
                        </label>
                        {filePreview && (
                            <img
                                src={filePreview}
                                alt="Предварительный просмотр"
                                style={{width: '50px', height: '50px', marginRight: '8px'}}
                            />
                        )}
                    </div>
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
