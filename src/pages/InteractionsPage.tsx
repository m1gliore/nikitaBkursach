import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination, InputLabel, Select, MenuItem, Tooltip, IconButton
} from '@mui/material';
import {Container} from "../components/Container";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Add, Delete, Edit} from "@mui/icons-material";
import {Interaction, InteractionType} from "../types/Interaction";

const Title = styled.h1`
`

const InteractionsPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [interactions, setInteractions] = useState<Array<Interaction>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedInteraction, setSelectedInteraction] = useState<any | null>(null);
    const navigate = useNavigate()

    // const [user,] = useLocalStorage<LocalStorageData>('user')
    // const [token, setToken] = useState<string>("")

    // useEffect(() => {
    //     if (user?.token) {
    //         setToken(user.token)
    //     }
    // }, [user])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage);
    }

    const handleEditClick = (interaction: Interaction) => {
        setSelectedInteraction(interaction);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedInteraction(null);
        setOpenEditDialog(true);
    }

    const handleDelete = async (id: number | undefined) => {
        // if (id) {
        //     try {
        //         await axios.delete(`http://localhost:8080/server/coursework-admin/api/adcategories/${id}`, {
        //             headers: {
        //                 Authorization: `${token}`
        //             }
        //         });
        //         setAdCategories(interactions.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedInteraction) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedInteraction.id}`, selectedInteraction, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedInteraction)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedInteraction, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedInteraction)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Платежи и бюджетирование</Title>
            {isAdmin &&
                <Tooltip title="Добавить платёж">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>URL материала</TableCell>
                            <TableCell>Тип взаимодействия</TableCell>
                            <TableCell>Метод платежа</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>https://www.youtube.com</TableCell>
                            <TableCell>{InteractionType.banner}</TableCell>
                            <TableCell>{new Date('2025-01-01T12:00:00').toLocaleString()}</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            material: {
                                                contentUrl: 'https://www.youtube.com'
                                            },
                                            interactionType: InteractionType.banner,
                                            interactionDate: new Date('2025-01-01T12:00:00')
                                        })}>
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton onClick={() => handleDelete(undefined)}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                        {interactions.slice(pg * 5, pg * 5 + 5).map((interaction, index) => (
                            <TableRow key={index}>
                                <TableCell>{interaction?.material?.contentUrl}</TableCell>
                                <TableCell>{interaction.interactionType}</TableCell>
                                <TableCell>{interaction.interactionDate ? new Date(interaction.interactionDate).toLocaleString() : 'Дата не указана'}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(interaction)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(interaction.id)}>
                                                <Delete/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[5]} component="div" count={interactions.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedInteraction ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="URL материала"
                        select
                        value={selectedInteraction?.material?.contentUrl || ''}
                        onChange={(e) => setSelectedInteraction({...selectedInteraction, material: {contentUrl: e.target.value}})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        <MenuItem value="https://www.youtube.com">https://www.youtube.com</MenuItem>
                        <MenuItem value="https://www.twitch.tv">https://www.twitch.tv</MenuItem>
                    </TextField>
                    <TextField
                        label="Тип взаимодействия"
                        select
                        value={selectedInteraction?.interactionType || ''}
                        onChange={(e) => setSelectedInteraction({...selectedInteraction, interactionType: e.target.value as InteractionType})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        {Object.values(InteractionType).map((intType) => (
                            <MenuItem key={intType} value={intType}>
                                {intType}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Дата и время взаимодействия"
                        type="datetime-local"
                        value={selectedInteraction?.interactionDate ? selectedInteraction.interactionDate.toISOString().slice(0, 16) : ''}
                        onChange={(e) => setSelectedInteraction({...selectedInteraction, interactionDate: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default InteractionsPage
