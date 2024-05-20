import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton, Menu
} from '@mui/material';
import {Container} from "../components/Container";
import {Cost, Offer} from "../types/Offers";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";
import {FilterListOutlined} from "@mui/icons-material";

const Title = styled.h1`
`

const OffersPage: React.FC = () => {

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [isUser, setIsUser] = useState<number>(2)
    const [offers, setOffers] = useState<Array<Offer>>([])
    const [pg, setPg] = useState<number>(0)
    const [offerId, setOfferId] = useState<number>(0)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false)
    const [newEditOffer, setNewEditOffer] = useState<Offer>({
        name: '',
        description: '',
        deliveryTime: new Date(),
        possibleDelayTime: 0,
        price: 0
    })
    const [oneOffer, setOneOffer] = useState<Offer>()
    const navigate = useNavigate()

    const selectedOfferObject = offers.find((offer) => offer.id === offerId)

    const [filterType, setFilterType] = useState<string>("MY");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                axios.get(`http://localhost:8080/server/coursework-user/api/offer`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        statuses: "ACTIVE,ACCEPTED,REJECTED",
                        offerFiltrationType: filterType
                    }
                })
                    .then(res => {
                        setOffers(res.data.list)
                    })

                if (selectedOfferObject) {
                    // const updatedNewEditOffer = { ...newEditOffer, idProduct: selectedOfferObject.idProduct };
                    // setNewEditOffer(updatedNewEditOffer);
                }
            })()
        }
    }, [filterType, selectedOfferObject, token])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    const handleDeleteOffer = () => {
        setOpenDeleteDialog(true);
    }

    const handleEditOffer = () => {
        setOpenEditDialog(true);
    }

    const handleRowClick = (offer: Offer) => {
        setSelectedOffer(offer)
        const id = offer.id
        if (offer) {
            axios.get(`http://localhost:8080/server/coursework-auth/api/offer/${id}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then((res) => {
                    setOneOffer(res.data)
                })
                .catch(error => {
                    alert(`Произошла ошибка при получении описания тендера: ${error}`,)
                })
        }
        setOpenDetailsDialog(true)
    }

    const deleteOffer = async () => {
        await axios.delete(`http://localhost:8080/server/coursework-user/api/offer/${offerId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
                setOpenDeleteDialog(false)
            })
            .catch(error => {
                alert(`Произошла ошибка при удалении тендера: ${error}`,)
            })
    }

    const editOffer = async () => {
        axios.put(`http://localhost:8080/server/coursework-user/api/offer/${offerId}`, newEditOffer, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
                setOpenEditDialog(false)
            })
            .catch(error => {
                alert(`Произошла ошибка при изменении предложения: ${error}`,)
            })
    }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (newFilter?: string) => {
        setAnchorEl(null);
        if (newFilter) {
            setFilterType(newFilter);
        }
    };

    return (
        <Container>
            <Title>Предложения</Title>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    {isUser === 2 &&
                        <Button variant="contained" style={{marginRight: "2.5vw"}} color="success"
                                onClick={handleEditOffer}>
                            Изменить предложение
                        </Button>
                    }
                    {isUser === 2 &&
                        <Button variant="contained" color="error" onClick={handleDeleteOffer}>
                            Удалить предложение
                        </Button>
                    }
                </div>
                <div style={{marginLeft: "5vw"}}>
                    <IconButton
                        aria-controls="filter-menu"
                        aria-haspopup="true"
                        onClick={handleFilterClick}
                    >
                        <FilterListOutlined fontSize="large"/>
                    </IconButton>
                    <Menu
                        id="filter-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => handleFilterClose()}
                    >
                        <MenuItem onClick={() => handleFilterClose("MY")}>Мои</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("COMPANY")}>Компания</MenuItem>
                    </Menu>
                </div>
            </div>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Компания</TableCell>
                            <TableCell>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offers.slice(pg * 7, pg * 7 + 7).map((offer, index) => (
                            <TableRow style={{cursor: "pointer"}} key={index}
                                      onClick={() => handleRowClick(offer)}>
                                <TableCell>{offer.name}</TableCell>
                                <TableCell>{offer.companyName}</TableCell>
                                <TableCell>
                                    {offer.status === 'ACTIVE' && "Активен"}
                                    {offer.status === 'REJECTED' && "Отклонен"}
                                    {offer.status === 'ACCEPTED' && "Принят"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={offers.length} rowsPerPage={7}
                             page={pg}
                             onPageChange={handleChangePage}/>
            <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
                <DialogTitle>Детали предложения</DialogTitle>
                <DialogContent>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название:</strong> {oneOffer?.name}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Описание:</strong> {oneOffer?.description}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Компания:</strong> {oneOffer?.company?.name}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Автор предложения:</strong> {oneOffer?.profile?.fullName}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Цена:</strong> {oneOffer?.price}
                    </div>
                    {/*<div style={{marginBottom: "1vw"}}>*/}
                    {/*    <strong>Статус:</strong>{" "}*/}
                    {/*    {oneOffer?.status === 'ACTIVE' && "Активен"}*/}
                    {/*    {oneOffer?.status === 'ACTIVE' && "Активен"}*/}
                    {/*    {oneOffer?.status === 'REJECTED' && "Отклонен"}*/}
                    {/*    {oneOffer?.status === 'ACCEPTED' && "Принят"}*/}
                    {/*</div>*/}
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Дата
                            создания:</strong> {oneOffer?.created && new Date(new Date(oneOffer?.created).getTime() - 3 * 60 * 60 * 1000).toLocaleString('ru-RU', {
                        hour: 'numeric',
                        minute: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Дата
                            доставки:</strong> {oneOffer?.deliveryTime && new Date(new Date(oneOffer?.deliveryTime).getTime() - 3 * 60 * 60 * 1000).toLocaleString('ru-RU', {
                        hour: 'numeric',
                        minute: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Возможное время задержки (в днях):</strong> {oneOffer?.possibleDelayTime}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailsDialog(false)} color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Удалить предложение</DialogTitle>
                <DialogContent>
                    <InputLabel id="offer-select-label-delete">Предложения</InputLabel>
                    <Select
                        labelId="offer-select-label-delete"
                        id="offer-select-delete"
                        value={offerId}
                        onChange={(e) => setOfferId(e.target.value as number)}
                        fullWidth
                    >
                        {offers.map((offer, index) => (
                            <MenuItem key={index} value={offer.id}>{offer.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={deleteOffer} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Изменить новое предложение</DialogTitle>
                <DialogContent>
                    <InputLabel id="offer-select-label-edit">Предложение</InputLabel>
                    <Select
                        labelId="offer-select-label-edit"
                        id="offer-select-edit"
                        value={offerId}
                        onChange={async (e) => {
                            const selectedOffer = offers.find(offer => offer.id === e.target.value);
                            setOfferId(e.target.value as number)
                            if (selectedOffer) {
                                try {
                                    const response = await axios.get(`http://localhost:8080/server/coursework-auth/api/offer/${selectedOffer.id}`, {
                                        headers: {
                                            Authorization: `${token}`
                                        }
                                    });
                                    console.log(response.data)
                                    const updatedOffer = response.data;
                                    setNewEditOffer({
                                        name: updatedOffer.name,
                                        description: updatedOffer.description,
                                        deliveryTime: updatedOffer.deliveryTime ? new Date(new Date(updatedOffer.deliveryTime).getTime() - 3 * 60 * 60 * 1000) : undefined,
                                        possibleDelayTime: updatedOffer.possibleDelayTime,
                                        price: updatedOffer.price
                                    })
                                } catch (error) {
                                    console.error('Error fetching updated offer:', error);
                                }
                            }
                        }}
                        fullWidth
                    >
                        {offers
                            // .filter(offer => offer.status === "ACTIVE")
                            .map((offer, index) => (
                                <MenuItem key={index} value={offer?.id}>
                                    {offer?.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newEditOffer.name}
                        onChange={(e) => setNewEditOffer({...newEditOffer, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newEditOffer.description}
                        onChange={(e) => setNewEditOffer({...newEditOffer, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Дата доставки"
                        type="datetime-local"
                        value={newEditOffer.deliveryTime ? newEditOffer.deliveryTime.toISOString().substring(0, 16) : ''}
                        onChange={(e) => setNewEditOffer({...newEditOffer, deliveryTime: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Возможное время задержки (в днях)"
                        type="number"
                        value={newEditOffer.possibleDelayTime}
                        onChange={(e) => setNewEditOffer({...newEditOffer, possibleDelayTime: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Цена"
                        type="number"
                        value={newEditOffer.price}
                        onChange={(e) => setNewEditOffer({...newEditOffer, price: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={editOffer} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default OffersPage
