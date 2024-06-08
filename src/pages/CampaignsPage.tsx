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
    TablePagination,
    Tooltip,
    IconButton,
    MenuItem
} from '@mui/material';
import {Container} from "../components/Container";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {Campaign, CampaignStatus} from "../types/Campaign";
import {Add, Delete, Edit} from '@mui/icons-material';
import {convertStatus} from "../methods/convertStatus";

const Title = styled.h1`
`

const CampaignsPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([{
        id: 1,
        name: 'Примерная кампания',
        budget: 1000,
        startDate: new Date('01.01.2025'),
        endDate: new Date('02.01.2025'),
        status: convertStatus('paused', CampaignStatus)
    }])
    const [pg, setPg] = useState<number>(0)
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
    const navigate = useNavigate()

    // const [user,] = useLocalStorage<LocalStorageData>('user')
    // const [token, setToken] = useState<string>("")

    // useEffect(() => {
    //     if (user?.token) {
    //         setToken(user.token)
    //     }
    // }, [user])

    // useEffect(() => {
    //     if (token) {
    //         (async () => {
    //             try {
    //                 const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/company`, {
    //                     headers: {
    //                         Authorization: `${token}`
    //                     }
    //                 });
    //
    //                 setCampaigns(response.data.list)
    //             } catch (error) {
    //                 console.error('Error fetching campaigns:', error);
    //             }
    //         })();
    //     }
    // }, [catalogId, token]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    const handleEditClick = (campaign: any) => {
        setSelectedCampaign(campaign);
        setOpenEditDialog(true);
    }

    const handleAddClick = () => {
        setSelectedCampaign(null);
        setOpenEditDialog(true);
    }

    const handleDelete = async (id: number | undefined) => {
        // try {
        //     await axios.delete(`http://localhost:8080/server/coursework-admin/api/campaigns/${id}`, {
        //         headers: {
        //             Authorization: `${token}`
        //         }
        //     });
        //     setCampaigns(campaigns.filter(campaign => campaign.campaign_id !== id));
        // } catch (error) {
        //     console.error('Error deleting campaign:', error);
        // }
    }

    const handleEditSave = async () => {
        if (selectedCampaign) {
            // try {
            //     await axios.put(`http://localhost:8080/server/coursework-admin/api/campaigns/${selectedCampaign.campaign_id}`, selectedCampaign, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error updating campaign:', error);
            // }
            console.log(selectedCampaign)
        } else {
            // try {
            //     const response = await axios.post(`http://localhost:8080/server/coursework-admin/api/campaigns`, selectedCampaign, {
            //         headers: {
            //             Authorization: `${token}`
            //         }
            //     });
            // } catch (error) {
            //     console.error('Error creating campaign:', error);
            // }
            console.log(selectedCampaign)
        }
        setOpenEditDialog(false);
    }

    return (
        <Container>
            <Title>Рекламные кампании</Title>
            {isAdmin &&
                <Tooltip title="Добавить кампанию">
                    <IconButton onClick={handleAddClick}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Бюджет</TableCell>
                            <TableCell>Дата начала</TableCell>
                            <TableCell>Дата окончания</TableCell>
                            <TableCell>Статус</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell onClick={() => navigate('/campaigns/1')}>Примерная кампания</TableCell>
                            <TableCell>1000 ₽</TableCell>
                            <TableCell>01.01.2025</TableCell>
                            <TableCell>01.02.2025</TableCell>
                            <TableCell>{CampaignStatus.active}</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            name: 'Примерная кампания',
                                            budget: 1000,
                                            startDate: '2025-01-01',
                                            endDate: '2025-02-01',
                                            status: CampaignStatus.active
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
                        {campaigns.slice(pg * 5, pg * 5 + 5).map((campaign, index) => (
                            <TableRow key={index}>
                                <TableCell onClick={() => navigate(`/campaigns/${campaign.id}`)}>{campaign.name}</TableCell>
                                <TableCell>{campaign.budget} ₽</TableCell>
                                <TableCell>{new Date(campaign.startDate || '').toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(campaign.endDate || '').toLocaleDateString()}</TableCell>
                                <TableCell>{campaign.status}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(campaign)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(campaign.id)}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={campaigns.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{selectedCampaign ? "Редактировать кампанию" : "Добавить кампанию"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={selectedCampaign?.name || ''}
                        onChange={(e) => setSelectedCampaign({...selectedCampaign, name: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Бюджет (₽)"
                        type="number"
                        value={selectedCampaign?.budget || ''}
                        onChange={(e) => setSelectedCampaign({...selectedCampaign, budget: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Дата начала"
                        type="date"
                        value={selectedCampaign?.startDate || ''}
                        onChange={(e) => setSelectedCampaign({...selectedCampaign, startDate: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Дата окончания"
                        type="date"
                        value={selectedCampaign?.endDate || ''}
                        onChange={(e) => setSelectedCampaign({...selectedCampaign, endDate: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Статус"
                        select
                        value={selectedCampaign?.status || ''}
                        onChange={(e) => setSelectedCampaign({...selectedCampaign, status: e.target.value})}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        {Object.values(CampaignStatus).map((statusValue) => (
                            <MenuItem key={statusValue} value={statusValue}>
                                {statusValue}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CampaignsPage
