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
import {AdMaterial, AdMaterialType} from "../types/AdMaterial";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Add, Delete, Edit} from "@mui/icons-material";
import {CampaignStatus} from "../types/Campaign";

const Title = styled.h1`
`

const AdMaterialsPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [adMaterials, setAdMaterials] = useState<Array<AdMaterial>>([]);
    const [pg, setPg] = useState<number>(0);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
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

    const handleEditClick = (category: AdMaterial) => {
        setSelectedMaterial(category);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedMaterial(null);
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
        //         setAdCategories(adMaterials.filter(category => category.id !== id));
        //     } catch (error) {
        //         console.error('Error deleting category:', error);
        //     }
        // }
    }

    const handleEditSave = async () => {
        if (selectedMaterial) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/adcategories/${selectedMaterial.id}`, selectedMaterial, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating category:', error);
            // }
            console.log(selectedMaterial)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/adcategories`, selectedMaterial, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating category:', error);
            // }
            console.log(selectedMaterial)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Рекламные материалы</Title>
            {isAdmin &&
                <Tooltip title="Добавить категорию">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Тип</TableCell>
                            <TableCell>URL</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{AdMaterialType.video}</TableCell>
                            <TableCell>https://www.youtube.com</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            type: AdMaterialType.video,
                                            contentUrl: 'https://www.youtube.com',
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
                        {adMaterials.slice(pg * 5, pg * 5 + 5).map((material, index) => (
                            <TableRow key={index}>
                                <TableCell>{material.type}</TableCell>
                                <TableCell>{material.contentUrl}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(material)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(material.id)}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={adMaterials.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedMaterial ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Тип"
                        select
                        value={selectedMaterial?.type || ''}
                        onChange={(e) => setSelectedMaterial({...selectedMaterial, type: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        {Object.values(AdMaterialType).map((statusValue) => (
                            <MenuItem key={statusValue} value={statusValue}>
                                {statusValue}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="URL"
                        value={selectedMaterial?.contentUrl || ''}
                        onChange={(e) => setSelectedMaterial({...selectedMaterial, contentUrl: e.target.value})}
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

export default AdMaterialsPage
