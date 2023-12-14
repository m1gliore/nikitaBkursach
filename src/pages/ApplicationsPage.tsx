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
    TableRow, TextField
} from "@mui/material";
import {Container} from "../components/Container";
import {Application, ProductInfo} from "../types/Applications";
import axios from "axios";
import {Product} from "../types/Products";
import {useNavigate} from "react-router-dom";
import {Catalog} from "../types/Catalogs";
import {Offer} from "../types/Offers";
import {Matrix} from "../types/Logic";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

const Title = styled.h1``

const ApplicationsPage: React.FC = () => {


    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(-1)
    const [applications, setApplications] = useState<Array<Application>>([])
    const [pg, setPg] = useState<number>(0)
    const [catalogs, setCatalogs] = useState<Array<Catalog>>([])
    const [catalogId, setCatalogId] = useState<number>(0)
    const [applicationId, setApplicationId] = useState<number>(0)
    const [products, setProducts] = useState<Array<Product>>([])
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [newApplication, setNewApplication] = useState<Application>({
        idUser: user?.id_company,
        idProduct: 0,
        nameApplication: '',
        description: '',
        productsInfos: []
    })
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false)
    const navigate = useNavigate()
    const [offersForWaitApplication, setOffersForWaitApplication] = useState<Array<Offer>>([])
    const [costMatrix, setCostMatrix] = useState([[0, 0], [0, 0]])
    const [solution, setSolution] = useState([[0, 0], [0, 0]])
    const [openAddOfferDialog, setOpenAddOfferDialog] = useState<boolean>(false)
    const [openDeleteApplicationDialog, setOpenDeleteApplicationDialog] = useState<boolean>(false)
    const [openEditApplicationDialog, setOpenEditApplicationDialog] = useState<boolean>(false)
    const [newOffer, setNewOffer] = useState<Offer>({
        idUser: user?.id_company,
        idProduct: 0,
        nameOffer: '',
        count: 0,
        costsDTOS: []
    })
    const [newEditApplication, setNewEditApplication] = useState<Application>({
        idApplication: 0,
        idUser: user?.id_company,
        idProduct: 0,
        nameApplication: '',
        description: '',
        productsInfos: []
    })
    const [productsForApplication, setProductsForApplication] = useState<Array<Product>>([])

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            axios.get(`http://localhost:8080/api/catalogs/pageCatalogs`)
                .then(res => setCatalogs(res.data.content))
            axios.get(`http://localhost:8080/api/applications/by-company/${user?.id_company}`)
                .then(res => {
                    setApplications(res.data.content)
                })
            axios.get(`http://localhost:8080/api/products/productsForCatalog/${catalogId}`)
                .then(res => setProducts(res.data.content))
        })()
    }, [catalogId, user])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    const handleAddApplication = () => {
        setOpenAddDialog(true);
    }

    const handleDeleteApplication = () => {
        setOpenDeleteApplicationDialog(true);
    }

    const handleEditApplication = () => {
        setOpenEditApplicationDialog(true);
    }

    const handleAddProductInfo = () => {
        setNewApplication((prevApplication) => {
            const updatedProductsInfos = [
                ...(prevApplication.productsInfos || []),
                {
                    applicationProductCount: 0,
                    address: '',
                }
            ]

            return {
                ...prevApplication,
                productsInfos: updatedProductsInfos
            }
        })
    }

    const handleSaveApplication = () => {
        axios.post(`http://localhost:8080/api/applications/createApplication?id_company=${user?.id_company}`, newApplication)
            .then(() => {
                setOpenAddDialog(false)
                navigate(0)
            })
    }

    const handleRowClick = async (application: Application) => {
        setSelectedApplication(application)
        const id = application.idApplication
        if ((isUser === 0 || isUser === 1)) {
            setOpenDetailsDialog(true)
            if (application) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/offers/application/${id}/list`)
                    setOffersForWaitApplication(response.data)
                    const response1 = await axios.get(`http://localhost:8080/api/logic/costMatrix/${id}`)
                    setCostMatrix(response1.data)
                    const response2 = await axios.get(`http://localhost:8080/api/logic/minCost/${id}`)
                    const response3 = await axios.get(`http://localhost:8080/api/logic/solution/${id}`)
                    setSolution(response3.data)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        } else if (isUser === 3) {
            setOpenAddOfferDialog(true)
            await axios.get(`http://localhost:8080/api/products/productsForApplication/${id}`)
                .then(res => {
                    setProductsForApplication(res.data.content)
                    setNewOffer({...newOffer, idProduct: res.data.content[0].idProduct})
                })
        }
    }

    const handleSaveOffer = async () => {
        await axios.post(`http://localhost:8080/api/offers/create?id_application=${selectedApplication?.idApplication}&id_company=${user?.id_company}`, newOffer)
            .then(() => {
                setOpenAddOfferDialog(false)
                navigate(0)
            })
    }

    const handleRunApplication = () => {
        axios.put(`http://localhost:8080/api/applications/start?id_application=${selectedApplication?.idApplication}&id_company=${user?.id_company}`, {})
            .then(() => {
                setOpenDetailsDialog(false)
                navigate(0)
            })
    }

    const handleFinishApplication = () => {
        axios.put(`http://localhost:8080/api/applications/finish?id_application=${selectedApplication?.idApplication}&id_company=${user?.id_company}`, {})
            .then(() => {
                setOpenDetailsDialog(false)
                navigate(0)
            })
    }

    const transposeMatrix = (matrix: Matrix): Matrix => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
    }

    const transposedCostMatrix = transposeMatrix(costMatrix)

    const transposedSolution = transposeMatrix(solution)

    const deleteApplication = async () => {
        await axios.delete(`http://localhost:8080/api/applications/${applicationId}?id_company=${user?.id_company}`)
            .then(() => {
                navigate(0)
                setOpenDeleteApplicationDialog(false)
            })
    }

    const selectedApplicationObject = applications.find(app => app.idApplication === applicationId)

    const editApplication = async () => {
        axios.put(`http://localhost:8080/api/applications/update?id_company=${user?.id_company}`, newEditApplication)
            .then(() => {
                navigate(0)
                setOpenEditApplicationDialog(false)
            })
    }

    return (
        <Container>
            <Title>Заявки</Title>
            <div>
                {isUser === 1 &&
                    <Button variant="contained" color="primary"
                            onClick={handleAddApplication}>
                        Добавить Заявку
                    </Button>
                }
                {isUser === 0 &&
                    <Button variant="contained" style={{marginRight: "2.5vw"}} color="success"
                            onClick={handleEditApplication}>
                        Изменить Заявку
                    </Button>
                }
                {isUser === 0 &&
                    <Button variant="contained" color="error" onClick={handleDeleteApplication}>
                        Удалить Заявку
                    </Button>
                }
            </div>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Название товара</TableCell>
                            <TableCell>Общее количество</TableCell>
                            <TableCell>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.slice(pg * 7, pg * 7 + 7).map((application, index) => (
                            <TableRow style={{cursor: "pointer"}} key={index}
                                      onClick={() => handleRowClick(application)}>
                                <TableCell>{application.nameApplication}</TableCell>
                                <TableCell>{application.description}</TableCell>
                                <TableCell>{application.productDTO?.nameProduct}</TableCell>
                                <TableCell>
                                    {application.productsInfos?.reduce((totalCost, productInfo) => {
                                        const count = productInfo.applicationProductCount || 0
                                        return totalCost + count
                                    }, 0)}
                                </TableCell>
                                <TableCell>
                                    {application.isStart && !application.isFinish
                                        ? "Выполняется"
                                        : application.isStart && application.isFinish
                                            ? "Завершена"
                                            : "В ожидании"
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[7]} component="div" count={applications.length} rowsPerPage={7}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Добавить новую заявку</DialogTitle>
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
                            <MenuItem key={index} value={catalog.idCatalog}>{catalog.nameCatalog}</MenuItem>
                        ))}
                    </Select>
                    <InputLabel id="product-select-label-add">Продукт</InputLabel>
                    <Select
                        labelId="product-select-label-add"
                        id="product-select-add"
                        value={newApplication.idProduct}
                        onChange={(e) => setNewApplication({...newApplication, idProduct: e.target.value as number})}
                        fullWidth
                    >
                        {products.map((product, index) => (
                            <MenuItem key={index} value={product.idProduct}>{product.nameProduct}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newApplication.nameApplication}
                        onChange={(e) => setNewApplication({...newApplication, nameApplication: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newApplication.description}
                        onChange={(e) => setNewApplication({...newApplication, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    {newApplication.productsInfos?.map((productInfo, index) => (
                        <div key={index}>
                            <TextField
                                label={`Количество товара ${index + 1}`}
                                type="number"
                                value={productInfo.applicationProductCount}
                                onChange={(e) =>
                                    setNewApplication({
                                        ...newApplication,
                                        productsInfos: newApplication.productsInfos?.map((pi, i) =>
                                            i === index
                                                ? {...pi, applicationProductCount: Number(e.target.value)}
                                                : pi
                                        ),
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label={`Адрес товара ${index + 1}`}
                                value={productInfo.address}
                                onChange={(e) =>
                                    setNewApplication({
                                        ...newApplication,
                                        productsInfos: newApplication.productsInfos?.map((pi, i) =>
                                            i === index ? {...pi, address: e.target.value} : pi
                                        ),
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddProductInfo}>
                        Добавить место
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveApplication} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
                <DialogTitle>Детали заявки</DialogTitle>
                <DialogContent>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название:</strong> {selectedApplication?.nameApplication}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Описание:</strong> {selectedApplication?.description}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Название товара:</strong> {selectedApplication?.productDTO?.nameProduct}
                    </div>
                    <div style={{marginBottom: "1vw"}}>
                        <strong>Статус:</strong>{" "}
                        {selectedApplication?.isStart && !selectedApplication?.isFinish
                            ? "Выполняется"
                            : selectedApplication?.isStart && selectedApplication?.isFinish
                                ? "Завершена"
                                : "В ожидании"}
                    </div>
                    {selectedApplication?.isStart &&
                        <div style={{marginBottom: "1vw", display: "flex", flexDirection: "column", gap: ".5vw"}}>
                            <strong>Офферы:</strong>
                            {offersForWaitApplication.map((offer, index) => (
                                <div key={index}>
                                    {`Оффер: ${offer.nameOffer} - Количество товара: ${offer.count}`}
                                </div>
                            ))}
                        </div>
                    }
                    <div style={{display: "flex", gap: "2.5vw"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "1.2vw"}}>
                            <strong>Места:</strong>
                            {selectedApplication?.productsInfos?.map((productInfo: ProductInfo, index) => (
                                <div key={index}>
                                    {`Адрес: ${productInfo.address} - Количество товара: ${productInfo.applicationProductCount}`}
                                </div>
                            ))}
                        </div>
                        {selectedApplication?.isStart && selectedApplication?.isFinish &&
                            <div>
                                <strong>Матрица:</strong>
                                <table style={{borderCollapse: 'collapse', marginTop: '10px'}}>
                                    <tbody>
                                    {transposedCostMatrix.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((value, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        padding: '8px',
                                                    }}
                                                >
                                                    {value} / {transposedSolution?.[rowIndex]?.[colIndex]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailsDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    {!selectedApplication?.isStart && !selectedApplication?.isFinish && isUser === 1 &&
                        <Button onClick={handleRunApplication} color="primary">
                            Запустить
                        </Button>
                    }
                    {selectedApplication?.isStart && !selectedApplication?.isFinish && isUser === 1 &&
                        <Button onClick={handleFinishApplication} color="primary">
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
                        value={newOffer.nameOffer}
                        onChange={(e) => setNewOffer({...newOffer, nameOffer: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={newOffer.count}
                        onChange={(e) => setNewOffer({...newOffer, count: Number(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    {productsForApplication.map((product, index) => (
                        <TextField
                            key={index}
                            label={`Сумма на адрес ${index + 1}`}
                            type="number"
                            value={(newOffer.costsDTOS && newOffer.costsDTOS[index]?.costAll) || ''}
                            onChange={(e) => setNewOffer((prevOffer) => {
                                const updatedCostsDTOS = [...(prevOffer.costsDTOS || [])];
                                if (updatedCostsDTOS.length <= index) {
                                    updatedCostsDTOS.push({
                                        idApplicationInfo: product.idApplicationInfo,
                                        costAll: e.target.value !== '' ? Number(e.target.value) : 0
                                    })
                                } else {
                                    updatedCostsDTOS[index] = {
                                        idApplicationInfo: product.idApplicationInfo,
                                        costAll: e.target.value !== '' ? Number(e.target.value) : 0
                                    }
                                }
                                return {
                                    ...prevOffer,
                                    costsDTOS: updatedCostsDTOS
                                };
                            })}
                            fullWidth
                            margin="normal"
                        />
                    ))}
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

            <Dialog open={openDeleteApplicationDialog} onClose={() => setOpenDeleteApplicationDialog(false)}>
                <DialogTitle>Удалить заявку</DialogTitle>
                <DialogContent>
                    <InputLabel id="app-select-label-delete">Заявка</InputLabel>
                    <Select
                        labelId="app-select-label-delete"
                        id="app-select-delete"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value as number)}
                        fullWidth
                    >
                        {applications.map((application, index) => (
                            <MenuItem key={index}
                                      value={application.idApplication}>{application.nameApplication}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteApplicationDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={deleteApplication} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditApplicationDialog} onClose={() => setOpenEditApplicationDialog(false)}>
                <DialogTitle>Изменить заявку</DialogTitle>
                <DialogContent>
                    <InputLabel id="app-select-label-edit">Заявка</InputLabel>
                    <Select
                        labelId="app-select-label-edit"
                        id="app-select-edit"
                        value={applicationId}
                        onChange={(e) => {
                            setApplicationId(e.target.value as number)
                            setNewEditApplication({...newEditApplication, idApplication: e.target.value as number})
                        }}
                        fullWidth
                    >
                        {applications
                            .filter(application => !application.isStart && !application.isFinish)
                            .map((application, index) => (
                                <MenuItem key={index} value={application.idApplication}>
                                    {application.nameApplication}
                                </MenuItem>
                            ))}
                    </Select>
                    <InputLabel id="catalog-select-label-edit">Каталог</InputLabel>
                    <Select
                        labelId="catalog-select-label-edit"
                        id="catalog-select-edit"
                        value={catalogId}
                        onChange={(e) => setCatalogId(e.target.value as number)}
                        fullWidth
                    >
                        {catalogs.map((catalog, index) => (
                            <MenuItem key={index} value={catalog.idCatalog}>{catalog.nameCatalog}</MenuItem>
                        ))}
                    </Select>
                    <InputLabel id="product-select-label-edit">Продукт</InputLabel>
                    <Select
                        labelId="product-select-label-edit"
                        id="product-select-edit"
                        value={newEditApplication.idProduct}
                        onChange={(e) => setNewEditApplication({
                            ...newEditApplication,
                            idProduct: e.target.value as number
                        })}
                        fullWidth
                    >
                        {products.map((product, index) => (
                            <MenuItem key={index} value={product.idProduct}>{product.nameProduct}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Название"
                        value={newEditApplication.nameApplication}
                        onChange={(e) => setNewEditApplication({
                            ...newEditApplication,
                            nameApplication: e.target.value
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newEditApplication.description}
                        onChange={(e) => setNewEditApplication({...newEditApplication, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    {selectedApplicationObject && (
                        <div>
                            {selectedApplicationObject.productsInfos?.map((productInfo, index) => (
                                <div key={index}>
                                    <TextField
                                        label={`Количество товара ${index + 1}`}
                                        type="number"
                                        onChange={(e) => {
                                            setNewEditApplication((prevEditApp) => {
                                                const updatedProductsInfos = [...(prevEditApp.productsInfos || [])];
                                                updatedProductsInfos[index] = {
                                                    ...productInfo,
                                                    applicationProductCount: Number(e.target.value)
                                                };
                                                return {
                                                    ...prevEditApp,
                                                    productsInfos: updatedProductsInfos
                                                };
                                            });
                                        }}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label={`Адрес товара ${index + 1}`}
                                        onChange={(e) => {
                                            setNewEditApplication((prevEditApp) => {
                                                const updatedProductsInfos = [...(prevEditApp.productsInfos || [])];
                                                updatedProductsInfos[index] = {
                                                    ...productInfo,
                                                    address: e.target.value
                                                };
                                                return {
                                                    ...prevEditApp,
                                                    productsInfos: updatedProductsInfos
                                                };
                                            });
                                        }}
                                        fullWidth
                                        margin="normal"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditApplicationDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={editApplication} color="primary">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ApplicationsPage
