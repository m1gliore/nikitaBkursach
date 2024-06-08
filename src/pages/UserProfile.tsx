import React, { useEffect, useState } from 'react';
import { Container } from "../components/Container";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from "react-use";
import { LocalStorageData } from "../types/Token";
import { User } from "../types/User";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { AdCategory } from "../types/AdMaterial";
import { Campaign } from "../types/Campaign";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Title = styled.h1``

const UserProfile: React.FC = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);

    useEffect(() => {
        // Здесь вы можете сделать запрос к серверу, чтобы получить данные пользователя
        // Здесь просто заглушка для тестирования
        const dummyUser: User = {
            id: 1,
            username: "Mikita",
            email: "raintruwalker@gmail.com"
        };
        setUser(dummyUser);
        setEditedUser(dummyUser);
    }, []);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = () => {
        if (editedUser) {
            // Здесь вы можете отправить измененные данные на сервер
            // В данном примере просто обновим состояние
            setUser(editedUser);
            setEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
        }
    };

    return (
        <Container>
            <Main>
                <Title>
                    Здравствуйте, {user?.username}
                </Title>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Имя:</Typography>
                        {editing ? (
                            <TextField name="username" value={editedUser?.username} onChange={handleChange} />
                        ) : (
                            <Typography>{user?.username}</Typography>
                        )}
                        <Typography variant="h6">Email:</Typography>
                        {editing ? (
                            <TextField name="email" value={editedUser?.email} onChange={handleChange} />
                        ) : (
                            <Typography>{user?.email}</Typography>
                        )}
                    </CardContent>
                    {editing ? (
                        <DialogActions>
                            <Button onClick={handleSaveClick}>Сохранить</Button>
                        </DialogActions>
                    ) : (
                        <DialogActions>
                            <Button onClick={handleEditClick}>Редактировать</Button>
                        </DialogActions>
                    )}
                </Card>
            </Main>
        </Container>
    )
}

export default UserProfile;