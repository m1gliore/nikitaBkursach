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
    TablePagination, DialogTitle, DialogContent, DialogActions, Dialog, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import {Container} from "../components/Container";
import {Cost, Offer} from "../types/Offers";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

const Title = styled.h1`
`

const OffersPage: React.FC = () => {


    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(-1)
    const [offers, setOffers] = useState<Array<Offer>>([])
    const [pg, setPg] = useState<number>(0)
    const [offerId, setOfferId] = useState<number>(0)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false)
    const [newEditOffer, setNewEditOffer] = useState<Offer>({
        idOffers: 0,
        idProduct: 0,
        idUser: user?.id_company,
        nameOffer: '',
        count: 0,
        costsDTOS: []
    })
    const navigate = useNavigate()

    const selectedOfferObject = offers.find((offer) => offer.idOffers === offerId)

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            axios.get(`http://localhost:8080/api/offers/company/${user?.id_company}`)
                .then(res => {
                    setOffers(res.data.content)
                })

            if (selectedOfferObject) {
                const updatedNewEditOffer = { ...newEditOffer, idProduct: selectedOfferObject.idProduct };
                setNewEditOffer(updatedNewEditOffer);
            }
        })()
    }, [newEditOffer, selectedOfferObject, user])

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
        setOpenDetailsDialog(true)
    }

    const deleteOffer = async () => {
        await axios.delete(`http://localhost:8080/api/offers/${offerId}`)
            .then(() => {
                navigate(0)
                setOpenDeleteDialog(false)
            })
    }

    const editOffer = async () => {
        axios.put(`http://localhost:8080/api/offers/update?id_company=${user?.id_company}`, newEditOffer)
            .then(() => {
                navigate(0)
                setOpenEditDialog(false)
            })
    }

    return (
        <Container>
            <Title>Предложения</Title>
            <div>
                {isUser === 2 &&
                    <Button variant="contained" style={{marginRight: "2.5vw"}} color="success" onClick={handleEditOffer}>
                        Изменить предложение
                    </Button>
                }
                {isUser === 2 &&
                    <Button variant="contained" color="error" onClick={handleDeleteOffer}>
                        Удалить предложение
                    </Button>
                }
            </div>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Общая стоимость</TableCell>
                            <TableCell>Количество товаров</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Продукт</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offers.slice(pg * 7, pg * 7 + 7).map((offer, index) => (
                            <TableRow style={{cursor: "pointer"}} key={index}
                                      onClick={() => handleRowClick(offer)}>
                                <TableCell>{offer.nameOffer}</TableCell>
                                <TableCell>{offer.allCost ?? 0}</TableCell>
                                <TableCell>{offer.count}</TableCell>
                                <TableCell>{offer.isAccept ? 'Принят' : 'Не принят'}</TableCell>
                                <TableCell>{offer.productDTO?.nameProduct}</TableCell>
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
                    <div>
                        <strong>Название:</strong> {selectedOffer?.nameOffer}
                    </div>
                    <div>
                        <strong>Количество товара:</strong> {selectedOffer?.count}
                    </div>
                    <div>
                        <strong>Название товара:</strong> {selectedOffer?.productDTO?.nameProduct}
                    </div>
                    <div>
                        <strong>Статус:</strong>{" "}
                        {selectedOffer?.isAccept
                            ? "Принят"
                            : "Не принят"}
                    </div>
                    <div>
                        <strong>Заказы:</strong>
                        {selectedOffer?.costsDTOS?.map((cost: Cost, index) => (
                            <div key={index}>
                                {`Адрес: ${cost.address} - Стоимость: ${cost.costAll} (${cost.acceptCount ? "Принято" : "Не принято"})`}
                            </div>
                        ))}
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
                            <MenuItem key={index} value={offer.idOffers}>{offer.nameOffer}</MenuItem>
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
                        onChange={(e) => {
                            setOfferId(e.target.value as number)
                            setNewEditOffer({...newEditOffer, idOffers: e.target.value as number})
                        }}
                        fullWidth
                    >
                        {offers
                            .filter(offer => !offer.isAccept)
                            .map((application, index) => (
                                <MenuItem key={index} value={application.idOffers}>
                                    {application.nameOffer}
                                </MenuItem>
                            ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newEditOffer.nameOffer}
                        onChange={(e) => setNewEditOffer({...newEditOffer, nameOffer: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={newEditOffer.count}
                        onChange={(e) => setNewEditOffer({...newEditOffer, count: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    {selectedOfferObject && selectedOfferObject.costsDTOS?.map((cost, index) => (
                        <TextField
                            key={index}
                            label={`Сумма на адрес ${index + 1}`}
                            type="number"
                            onChange={(e) => {
                                setNewEditOffer((prevOffer) => {
                                    const updatedCostsDTOS = [...(prevOffer.costsDTOS || [])];
                                    updatedCostsDTOS[index] = {
                                        idCost: cost.idCost,
                                        idApplicationInfo: cost.idApplicationInfo,
                                        costAll: e.target.value !== '' ? Number(e.target.value) : 0
                                    }
                                    return {
                                        ...prevOffer,
                                        costsDTOS: updatedCostsDTOS
                                    }
                                })
                            }}
                            fullWidth
                            margin="normal"
                        />
                    ))}
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
