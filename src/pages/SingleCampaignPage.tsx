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
import {
    CampaignChecklist,
    CampaignChecklistStatus,
    CampaignSchedule
} from "../types/Campaign";
import {Add, Delete, Edit} from '@mui/icons-material';
import {Feedback} from "../types/Feedback";

const Title = styled.h1`
`

const CommentContainer = styled.div`
    border: 1px solid #ddd;
    padding: 16px;
    margin-top: 8px;
    border-radius: 4px;
    background-color: #f9f9f9;
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CommentText = styled.p`
    margin: 8px 0;
`;

const SingleCampaignPage: React.FC<{ isAdmin: boolean }> = ({isAdmin}) => {
    const [checklists, setChecklists] = useState<CampaignChecklist[]>([])
    const [schedules, setSchedules] = useState<CampaignSchedule[]>([])
    const [checklistsPage, setChecklistsPage] = useState<number>(0);
    const [schedulesPage, setSchedulesPage] = useState<number>(0);
    const [selectedChecklist, setSelectedChecklist] = useState<any | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
    const [openChecklistDialog, setOpenChecklistDialog] = useState<boolean>(false);
    const [openScheduleDialog, setOpenScheduleDialog] = useState<boolean>(false);
    const [comments, setComments] = useState<Feedback[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [editingComment, setEditingComment] = useState<Feedback | null>(null);
    const [userId, setUserId] = useState<number | null>(1);  // Example user ID, replace with actual user ID from your auth system
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

    const handleChecklistsPageChange = (event: unknown, newPage: number) => {
        setChecklistsPage(newPage);
    };

    const handleSchedulesPageChange = (event: unknown, newPage: number) => {
        setSchedulesPage(newPage);
    };

    const handleEditClick = (item: any, type: string) => {
        if (type === 'checklist') {
            setSelectedChecklist(item);
            setOpenChecklistDialog(true);
        } else if (type === 'schedule') {
            setSelectedSchedule(item);
            setOpenScheduleDialog(true);
        }
    }

    const handleAddClick = (type: string) => {
        if (type === 'checklist') {
            setSelectedChecklist(null);
            setOpenChecklistDialog(true);
        } else if (type === 'schedule') {
            setSelectedSchedule(null);
            setOpenScheduleDialog(true);
        }
    }

    const handleDelete = async (id: number | undefined, type: string) => {
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

    const handleEditSave = async (type: string) => {
        if (type === 'checklist') {
            if (selectedChecklist) {
                // try {
                //     await axios.put(`http://localhost:8080/server/coursework-admin/api/campaigns/${selectedCampaign.campaign_id}`, selectedCampaign, {
                //         headers: {
                //             Authorization: `${token}`
                //         }
                //     });
                // } catch (error) {
                //     console.error('Error updating campaign:', error);
                // }
                console.log(selectedChecklist)
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
                console.log(selectedChecklist)
            }
            setOpenChecklistDialog(false);
        } else if (type === 'schedule') {
            if (selectedSchedule) {
                // try {
                //     await axios.put(`http://localhost:8080/server/coursework-admin/api/campaigns/${selectedCampaign.campaign_id}`, selectedCampaign, {
                //         headers: {
                //             Authorization: `${token}`
                //         }
                //     });
                // } catch (error) {
                //     console.error('Error updating campaign:', error);
                // }
                console.log(selectedSchedule)
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
                console.log(selectedSchedule)
            }
            setOpenScheduleDialog(false);
        }
    }

    const handleAddComment = () => {
        const newFeedback: Feedback = {
            id: comments.length + 1,
            userId: userId!,
            campaignId: 1, // Example campaign ID, replace with actual campaign ID
            rating: 5, // Example rating, replace with actual rating input
            comment: newComment,
            createdAt: Date.now(),
        };
        setComments([...comments, newFeedback]);
        setNewComment('');
    }

    const handleEditComment = (comment: Feedback) => {
        setEditingComment(comment);
    }

    const handleSaveEditComment = (id: number) => {
        setComments(comments.map((comment) => comment.id === id ? editingComment! : comment));
        setEditingComment(null);
    }

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter((comment) => comment.id !== id));
    }

    return (
        <Container>
            <Title>Чек-листы</Title>
            {isAdmin &&
                <Tooltip title="Добавить чек-лист">
                    <IconButton onClick={() => handleAddClick('checklist')}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Задача</TableCell>
                            <TableCell>Статус</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Примерная задача</TableCell>
                            <TableCell>{CampaignChecklistStatus.pending}</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            task: 'Примерная задача',
                                            status: CampaignChecklistStatus.pending
                                        }, 'checklist')}>
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton onClick={() => handleDelete(undefined, 'checklist')}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                        {checklists.map((checklist, index) => (
                            <TableRow key={index}>
                                <TableCell>{checklist.task}</TableCell>
                                <TableCell>{checklist.status}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(checklist, 'checklist')}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(checklist.id, 'checklist')}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={checklists.length} rowsPerPage={5}
                             page={checklistsPage}
                             onPageChange={handleChecklistsPageChange}/>

            <Title>Расписания</Title>
            {isAdmin &&
                <Tooltip title="Добавить расписание">
                    <IconButton onClick={() => handleAddClick('schedule')}>
                        <Add fontSize="large"/>
                    </IconButton>
                </Tooltip>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>День недели</TableCell>
                            <TableCell>Время начала</TableCell>
                            <TableCell>Время окончания</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Понедельник</TableCell>
                            <TableCell>08:00:00</TableCell>
                            <TableCell>19:00:00</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditClick({
                                            dayOfWeek: 'Понедельник',
                                            startTime: '08:00:00',
                                            endTime: '19:00:00'
                                        }, 'schedule')}>
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton onClick={() => handleDelete(undefined, 'schedule')}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                        {schedules.map((schedule, index) => (
                            <TableRow key={index}>
                                <TableCell>{schedule.dayOfWeek}</TableCell>
                                <TableCell>{schedule.startTime}</TableCell>
                                <TableCell>{schedule.endTime}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => handleEditClick(schedule, 'schedule')}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => handleDelete(schedule.id, 'schedule')}>
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
            <TablePagination rowsPerPageOptions={[5]} component="div" count={schedules.length} rowsPerPage={5}
                             page={schedulesPage}
                             onPageChange={handleSchedulesPageChange}/>

            <Title>Комментарии</Title>
            <TextField
                label="Оставить комментарий"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
            />
            <Button onClick={handleAddComment} color="primary" variant="contained">
                Добавить
            </Button>
            {comments.map((comment) => (
                <CommentContainer key={comment.id}>
                    <CommentHeader>
                        <div>
                            <strong>Migliore</strong>
                            <span> - {new Date(comment.createdAt!).toLocaleString()}</span>
                        </div>
                        <div>
                            {isAdmin || comment.userId === userId ? (
                                <>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleEditComment(comment)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton onClick={() => handleDeleteComment(comment.id!)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : null}
                        </div>
                    </CommentHeader>
                    {editingComment && editingComment.id === comment.id ? (
                        <TextField
                            value={editingComment.comment}
                            onChange={(e) => setEditingComment({ ...editingComment, comment: e.target.value })}
                            fullWidth
                            variant="outlined"
                            multiline
                        />
                    ) : (
                        <CommentText>{comment.comment}</CommentText>
                    )}
                    {editingComment && editingComment.id === comment.id ? (
                        <Button onClick={() => handleSaveEditComment(comment.id!)} color="primary" variant="contained">
                            Сохранить
                        </Button>
                    ) : null}
                </CommentContainer>
            ))}

            {/* Диалог редактирования чек-листа */}
            <Dialog open={openChecklistDialog} onClose={() => setOpenChecklistDialog(false)}>
                <DialogTitle>{selectedChecklist ? "Редактировать чек-лист" : "Добавить чек-лист"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Описание задачи"
                        value={selectedChecklist?.task  || ''}
                        onChange={(e) => setSelectedChecklist({ ...selectedChecklist, task: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Статус"
                        select
                        value={selectedChecklist?.status || ''}
                        onChange={(e) => setSelectedChecklist({ ...selectedChecklist, status: e.target.value as CampaignChecklistStatus })}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    >
                        {Object.values(CampaignChecklistStatus).map((statusValue) => (
                            <MenuItem key={statusValue} value={statusValue}>
                                {statusValue}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditSave('checklist')} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования расписания */}
            <Dialog open={openScheduleDialog} onClose={() => setOpenScheduleDialog(false)}>
                <DialogTitle>{selectedSchedule ? "Редактировать расписание" : "Добавить расписание"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="День недели"
                        value={selectedSchedule?.dayOfWeek || ''}
                        onChange={(e) => setSelectedSchedule({ ...selectedSchedule, dayOfWeek: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Время начала"
                        value={selectedSchedule?.startTime || ''}
                        onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startTime: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                    <TextField
                        label="Время окончания"
                        value={selectedSchedule?.endTime || ''}
                        onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endTime: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditSave('schedule')} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SingleCampaignPage
