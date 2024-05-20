import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField, IconButton, Menu
} from "@mui/material";
import {Container} from "../components/Container";
import {Tender} from "../types/Tenders";
import axios from "axios";
import {Item} from "../types/Items";
import {useNavigate} from "react-router-dom";
import {Catalog} from "../types/Catalogs";
import {Offer} from "../types/Offers";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";
import {FilterListOutlined} from "@mui/icons-material";

const Title = styled.h1``

const TendersPage: React.FC = () => {

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [tenders, setTenders] = useState<Array<Tender>>([])
    const [pg, setPg] = useState<number>(0)
    const [catalogs, setCatalogs] = useState<Array<Catalog>>([])
    const [catalogId, setCatalogId] = useState<number>(0)
    const [tenderId, setTenderId] = useState<number>(0)
    const [items, setItems] = useState<Array<Item>>([])
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [newTender, setNewTender] = useState<Tender>({
        itemId: 0,
        name: '',
        description: '',
        count: 0,
        deliveryTime: new Date()
    })
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false)
    const navigate = useNavigate()
    const [offersForWaitTender, setOffersForWaitTender] = useState<Array<Offer>>([])
    const [openAddOfferDialog, setOpenAddOfferDialog] = useState<boolean>(false)
    const [openDeleteTenderDialog, setOpenDeleteTenderDialog] = useState<boolean>(false)
    const [openEditTenderDialog, setOpenEditTenderDialog] = useState<boolean>(false)
    const [newOffer, setNewOffer] = useState<Offer>({
        name: '',
        description: '',
        deliveryTime: new Date(),
        possibleDelayTime: 0,
        price: 0,
        tenderId: 0
    })
    const [newEditTender, setNewEditTender] = useState<Tender>({
        id: 0,
        itemId: 0,
        name: '',
        description: '',
        count: 0,
        deliveryTime: new Date()
    })
    const [token, setToken] = useState<string>("")
    const [allItems, setAllItems] = useState<Item[]>([])
    const [oneTender, setOneTender] = useState<Tender>()
    const [offerId, setOfferId] = useState<number>(0)

    const [filterType, setFilterType] = useState<string>("ACTIVE");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const [admin, setAdmin] = useState<string>("ROLE_USER")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                axios.get(`http://localhost:8080/server/coursework-auth/api/catalog`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setCatalogs(res.data.list))

                axios.get(`http://localhost:8080/server/coursework-auth/api/tender`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        type: filterType
                    }
                })
                    .then(res => setTenders(res.data.list))

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

                admin === "ROLE_ADMIN" && await axios.get(`http://localhost:8080/server/coursework-admin/api/catalog/${catalogId}/item`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setItems(res.data.list))


                admin === "ROLE_ADMIN" && await axios.get(`http://localhost:8080/server/coursework-admin/api/item`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAllItems(res.data.list))
            })()
        }
    }, [admin, catalogId, filterType, token])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    const handleAddTender = () => {
        setOpenAddDialog(true);
    }

    const handleDeleteTender = () => {
        setOpenDeleteTenderDialog(true);
    }

    const handleEditTender = () => {
        setOpenEditTenderDialog(true);
    }

    const handleSaveTender = () => {
        axios.post(`http://localhost:8080/server/coursework-admin/api/tender`, newTender, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddDialog(false)
                navigate(0)
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    alert('Ошибка. К этому продукту уже создан тендер');
                } else {
                    alert(`Произошла ошибка при сохранении тендера: ${error}`,)
                }
            })
    }

    const handleRowClick = async (tender: Tender) => {
        setNewOffer({...newOffer, tenderId: tender?.id})
        const id = tender.id
        if (tender) {
            axios.get(`http://localhost:8080/server/coursework-auth/api/tender/${id}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then((res) => {
                    setOneTender(res.data)
                    axios.get(`http://localhost:8080/server/coursework-auth/api/tender/${res.data?.id}/offer`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                        .then(response => setOffersForWaitTender(response.data.list))
                        .catch(error => alert(`Произошла ошибка при получении предложений: ${error}`))
                })
                .catch(error => {
                    alert(`Произошла ошибка при получении описания тендера: ${error}`)
                })
        }
        if ((admin === "ROLE_ADMIN")) {
            setOpenDetailsDialog(true)
        } else if ((admin === "ROLE_USER")) {
            setOpenAddOfferDialog(true)
        }
    }

    const handleSaveOffer = async () => {
        console.log(newOffer)
        await axios.post(`http://localhost:8080/server/coursework-user/api/offer`, newOffer, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenAddOfferDialog(false)
                navigate(0)
            })
            .catch(error => {
                alert(`Произошла ошибка при сохранении предложения: ${error}`,)
            })
    }

    const handleRunTender = () => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/tender/${oneTender?.id}/updateStatus`, {}, {
            headers: {
                Authorization: `${token}`
            },
            params: {
                status: "ACTIVE"
            }
        })
            .then(() => {
                setOpenDetailsDialog(false)
                navigate(0)
            })
            .catch(error => {
                alert(`Произошла ошибка при запуске тендера: ${error}`,)
            })
    }

    const handleFinishTender = () => {

        const reqBody = {
            offerId: offerId
        }

        axios.put(`http://localhost:8080/server/coursework-admin/api/tender/${oneTender?.id}/action/end`, reqBody, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                setOpenDetailsDialog(false)
                navigate(0)
            })
            .catch(error => {
                alert(`Произошла ошибка при окончании тендера: ${error}`,)
            })
    }

    const deleteTender = async () => {
        await axios.delete(`http://localhost:8080/server/coursework-admin/api/tender/${tenderId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
                setOpenDeleteTenderDialog(false)
            })
            .catch(error => {
                alert(`Произошла ошибка при удалении тендера: ${error}`,)
            })
    }

    const editTender = async () => {
        axios.put(`http://localhost:8080/server/coursework-admin/api/tender/${tenderId}`, newEditTender, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => {
                navigate(0)
                setOpenEditTenderDialog(false)
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    alert('Ошибка. К этому продукту уже существует тендер');
                } else {
                    alert(`Произошла ошибка при изменении тендера: ${error}`,)
                }
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
            <Title>Тендеры</Title>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    {admin === "ROLE_ADMIN" &&
                        <Button variant="contained" style={{marginRight: "2.5vw"}} color="primary"
                                onClick={handleAddTender}>
                            Добавить Тендер
                        </Button>
                    }
                    {admin === "ROLE_ADMIN" &&
                        <Button variant="contained" style={{marginRight: "2.5vw"}} color="success"
                                onClick={handleEditTender}>
                            Изменить Тендер
                        </Button>
                    }
                    {admin === "ROLE_ADMIN" &&
                        <Button variant="contained" color="error" onClick={handleDeleteTender}>
                            Удалить Тендер
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
                        <MenuItem onClick={() => handleFilterClose("ACTIVE")}>Активные</MenuItem>
                        <MenuItem onClick={() => handleFilterClose("DELETED")}>Удалённые</MenuItem>
                    </Menu>
                </div>
            </div>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Дата создания</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tenders.slice(pg * 7, pg * 7 + 7).map((tender, index) => (
                            <TableRow style={{cursor: "pointer"}} key={index}
                                      onClick={() => handleRowClick(tender)}>
                                <TableCell>{tender.name}</TableCell>
                                <TableCell>
                                    {tender.status === 'HIDDEN' && "Скрыт"}
                                    {tender.status === 'ACTIVE' && "Активен"}
                                    {tender.status === 'REJECTED' && "Отклонен"}
                                    {tender.status === 'ACCEPTED' && "Принят"}
                                </TableCell>
                                <TableCell>
                                    {tender.created && new Date(new Date(tender.created).getTime() - 3 * 60 * 60 * 1000).toLocaleString('ru-RU', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={tenders.length} rowsPerPage={7}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Добавить новый тендер</DialogTitle>
                <DialogContent>
                    <InputLabel id="catalog-select-label-add">Каталог</InputLabel>
                    <Select
                        labelId="catalog-select-label-add"
                        id="catalog-select-add"
                        value={catalogId}
                        onChange={(e) => setCatalogId(e.target.value as number)}
                        fullWidth
                    >
                        {catalogs.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.id}>{catalog.name}</MenuItem>
                        ))}
                    </Select>
                    <InputLabel id="item-select-label-add">Продукция</InputLabel>
                    <Select
                        labelId="item-select-label-add"
                        id="item-select-add"
                        value={newTender.itemId}
                        onChange={(e) => setNewTender({...newTender, itemId: e.target.value as number})}
                        fullWidth
                    >
                        {items.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newTender.name}
                        onChange={(e) => setNewTender({...newTender, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newTender.description}
                        onChange={(e) => setNewTender({...newTender, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={newTender.count}
                        onChange={(e) => setNewTender({...newTender, count: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Время доставки"
                        type="datetime-local" // Предполагая, что вы хотите вводить время
                        value={newTender.deliveryTime ? newTender.deliveryTime.toISOString().substring(0, 16) : ''}
                        onChange={(e) => setNewTender({...newTender, deliveryTime: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveTender} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
                <DialogTitle>Детали тендера</DialogTitle>
                <DialogContent>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название:</strong> {oneTender?.name}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Описание:</strong> {oneTender?.description}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название товара:</strong> {oneTender?.item?.name}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Количество:</strong> {oneTender?.count}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Статус:</strong>{" "}
                        {oneTender?.status === 'HIDDEN' && "Скрыт"}
                        {oneTender?.status === 'ACTIVE' && "Активен"}
                        {oneTender?.status === 'REJECTED' && "Отклонен"}
                        {oneTender?.status === 'ACCEPTED' && "Принят"}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Дата
                            создания:</strong> {oneTender?.created && new Date(new Date(oneTender?.created).getTime() - 3 * 60 * 60 * 1000).toLocaleString('ru-RU', {
                        hour: 'numeric',
                        minute: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Дата
                            доставки:</strong> {oneTender?.deliveryTime && new Date(new Date(oneTender?.deliveryTime).getTime() - 3 * 60 * 60 * 1000).toLocaleString('ru-RU', {
                        hour: 'numeric',
                        minute: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </div>
                    {oneTender?.status === 'ACTIVE' &&
                        <div style={{marginBottom: "1vw", display: "flex", flexDirection: "column", gap: ".5vw"}}>
                            <strong>Офферы:</strong>
                            {offersForWaitTender.map((offer, index) => (
                                <div style={{cursor: "pointer"}} key={index}
                                     onClick={() => setOfferId(Number(offer?.id))}>
                                    {`Компания: ${offer.companyName} - Оффер: ${offer.name} - Цена: ${offer.price}`}
                                </div>
                            ))}
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailsDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    {oneTender?.status === 'HIDDEN' &&
                        <Button onClick={handleRunTender} color="primary">
                            Запустить
                        </Button>
                    }
                    {oneTender?.status === 'ACTIVE' &&
                        <Button onClick={handleFinishTender} color="primary">
                            Завершить
                        </Button>
                    }
                </DialogActions>
            </Dialog>

            <Dialog open={openAddOfferDialog} onClose={() => setOpenAddOfferDialog(false)}>
                <DialogTitle>Добавить новое предложение</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={newOffer.name}
                        onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Дата доставки"
                        type="datetime-local"
                        value={newOffer.deliveryTime ? newOffer.deliveryTime.toISOString().substring(0, 16) : ''}
                        onChange={(e) => setNewOffer({...newOffer, deliveryTime: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Возможное время задержки (в днях)"
                        type="number"
                        value={newOffer.possibleDelayTime}
                        onChange={(e) => setNewOffer({...newOffer, possibleDelayTime: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Цена"
                        type="number"
                        value={newOffer.price}
                        onChange={(e) => setNewOffer({...newOffer, price: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddOfferDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveOffer} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteTenderDialog} onClose={() => setOpenDeleteTenderDialog(false)}>
                <DialogTitle>Удалить тендер</DialogTitle>
                <DialogContent>
                    <InputLabel id="app-select-label-delete">Тендер</InputLabel>
                    <Select
                        labelId="app-select-label-delete"
                        id="app-select-delete"
                        value={tenderId}
                        onChange={(e) => setTenderId(e.target.value as number)}
                        fullWidth
                    >
                        {tenders.map((tender, index) => (
                            <MenuItem key={index}
                                      value={tender.id}>{tender.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteTenderDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={deleteTender} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditTenderDialog} onClose={() => setOpenEditTenderDialog(false)}>
                <DialogTitle>Изменить тендер</DialogTitle>
                <DialogContent>
                    <InputLabel id="app-select-label-edit">Тендер</InputLabel>
                    <Select
                        labelId="app-select-label-edit"
                        id="app-select-edit"
                        value={tenderId}
                        onChange={async (e) => {
                            const selectedTender = tenders.find(tender => tender.id === e.target.value);
                            setTenderId(e.target.value as number);
                            if (selectedTender) {
                                try {
                                    const response = await axios.get(`http://localhost:8080/server/coursework-auth/api/tender/${selectedTender.id}`, {
                                        headers: {
                                            Authorization: `${token}`
                                        }
                                    });
                                    console.log(response.data)
                                    const updatedTender = response.data;
                                    setNewEditTender({
                                        id: updatedTender.id,
                                        itemId: updatedTender.item.id,
                                        name: updatedTender.name,
                                        description: updatedTender.description,
                                        count: updatedTender.count,
                                        deliveryTime: updatedTender.deliveryTime ? new Date(new Date(updatedTender.deliveryTime).getTime() - 3 * 60 * 60 * 1000) : undefined
                                    })
                                } catch (error) {
                                    console.error('Error fetching updated tender:', error);
                                }
                            }
                        }}
                        fullWidth
                    >
                        {tenders
                            .filter(tender => tender.status === 'HIDDEN')
                            .map((tender, index) => (
                                <MenuItem key={index} value={tender.id}>
                                    {tender.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <InputLabel id="item-select-label-edit">Продукция</InputLabel>
                    <Select
                        labelId="item-select-label-edit"
                        id="item-select-edit"
                        value={newEditTender.itemId}
                        onChange={(e) => setNewEditTender({
                            ...newEditTender,
                            itemId: e.target.value as number
                        })}
                        fullWidth
                    >
                        {allItems.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newEditTender.name}
                        onChange={(e) => setNewEditTender({...newEditTender, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newEditTender.description}
                        onChange={(e) => setNewEditTender({...newEditTender, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={newEditTender.count}
                        onChange={(e) => setNewEditTender({...newEditTender, count: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Время доставки"
                        type="datetime-local" // Предполагая, что вы хотите вводить время
                        value={newEditTender.deliveryTime ? new Date(newEditTender.deliveryTime.getTime() + 3 * 60 * 60 * 1000).toISOString().substring(0, 16) : ''}
                        onChange={(e) => setNewEditTender({...newEditTender, deliveryTime: new Date(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditTenderDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={editTender} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default TendersPage
