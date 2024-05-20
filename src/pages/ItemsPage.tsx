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
    TablePagination
} from '@mui/material';
import {CloudUpload} from "@mui/icons-material";
import {Container} from "../components/Container";
import {ImageType, Item} from "../types/Items";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";

const Title = styled.h1`
`

const Image = styled.img`
  width: 3vw;
  height: 6vh;
`

const ItemsPage: React.FC = () => {
    const [openAddItemDialog, setOpenAddItemDialog] = useState<boolean>(false)
    const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false); // Состояние для диалога поиска
    const [searchQuery, setSearchQuery] = useState<string>(''); // Состояние для значения поиска
    const [items, setItems] = useState<Array<Item>>([])
    const [pg, setPg] = useState<number>(0)
    const [images, setImages] = useState<ImageType[]>([
        {file: {name: '', size: 0, type: ''}, fileType: 'SYSTEM'},
    ]);
    const [filePreviews, setFilePreviews] = useState<Record<number, string | undefined>>({});

    const catalogId = useLocation().search.split("=")[1]
    const [newItem, setNewItem] = useState<Item>({
        name: '',
        description: new Map(),
        type: 'PRODUCT',
        fileIdList: [],
        catalogId: parseInt(catalogId, 10)
    });
    const navigate = useNavigate()

    const [isUser, setIsUser] = useState<number>(1)
    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [itemImage, setItemImage] = useState<string[]>([])
    const [admin, setAdmin] = useState<string>("ROLE_USER")

    useEffect(() => {
        if (user?.token) {
            setToken(user.token)
        }
    }, [user])

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    const itemsResponse = await axios.get(`http://localhost:8080/server/coursework-admin/api/catalog/${catalogId}/item`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });

                    const imagesResponse = await Promise.all(itemsResponse.data.list.map(async (item: Item) => {
                        if (item.fileIdList.length > 0) {
                            const fileId = item.fileIdList[0];
                            const fileResponse = await axios.get(`http://localhost:8080/server/coursework-auth/api/file/${fileId}/view`, {
                                headers: {
                                    Authorization: `${token}`
                                },
                                responseType: 'arraybuffer'
                            });

                            const blob = new Blob([fileResponse.data], {type: fileResponse.headers['content-type']});
                            return URL.createObjectURL(blob);
                        }
                    }));

                    setItems(itemsResponse.data.list);
                    setItemImage(imagesResponse);
                } catch (error) {
                    console.error('Error fetching items and images:', error);
                }

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

            })();
        }
    }, [catalogId, token]);

    const handleImageChange = (index: number, key: keyof ImageType, value: any) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[index] = {...updatedImages[index], [key]: value};
            return updatedImages;
        });
    };

    const handleAddImage = () => {
        setImages([...images, {file: {name: '', size: 0, type: ''}, fileType: 'SYSTEM'}])
    }

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileType = file.type;

            handleImageChange(index, 'file', file);
            handleImageChange(index, 'fileType', fileType);

            // Optionally, you can create a preview of the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews((prevFilePreviews) => ({
                    ...prevFilePreviews,
                    [index]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItemClick = () => {
        setOpenAddItemDialog(true);
    }

    const handleSearchClick = () => {
        setOpenSearchDialog(true);
    }

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/server/coursework-admin/api/item/search`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    searchWord: searchQuery,
                    types: "PRODUCT"
                }
            });
            setItems(response.data.list);

            const imagesResponse = await Promise.all(response.data.list.map(async (item: Item) => {
                if (item.fileIdList.length > 0) {
                    const fileId = item.fileIdList[0];
                    const fileResponse = await axios.get(`http://localhost:8080/server/coursework-auth/api/file/${fileId}/view`, {
                        headers: {
                            Authorization: `${token}`
                        },
                        responseType: 'arraybuffer'
                    });

                    const blob = new Blob([fileResponse.data], {type: fileResponse.headers['content-type']});
                    return URL.createObjectURL(blob);
                }
            }));

            setItemImage(imagesResponse);
            setOpenSearchDialog(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // Функция для добавления нового поля в описание
    const handleAddDescriptionField = () => {
        // Получаем метку (label) для нового поля от пользователя с помощью prompt
        const label = prompt('Введите метку (label) для нового поля:');

        if (label) {
            // Добавляем новое поле в описание
            setNewItem(prevItem => {
                const newDescription = {...prevItem.description};
                newDescription[label] = '' // Создаем поле с пустым значением
                return {...prevItem, description: newDescription};
            });
        }
    };

    const handleSaveItem = async () => {
        if (images.length > 0) {
            const newFilesId: number[] = [];
            for (const image of images) {
                if (image.file instanceof File) {
                    const formData = new FormData();
                    formData.append('file', image.file);
                    formData.append('fileType', "SYSTEM");
                    try {
                        const response = await axios.post('http://localhost:8080/server/coursework-auth/api/file', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `${token}`
                            }
                        });
                        newFilesId.push(response.data.id);
                    } catch (error) {
                        alert(`Произошла ошибка при отправке запроса: ${error}`);
                    }
                }
            }

            const updatedNewItem = {...newItem, fileIdList: [...newItem.fileIdList, ...newFilesId]};
            setNewItem(updatedNewItem);

            try {
                await axios.post('http://localhost:8080/server/coursework-admin/api/item', updatedNewItem, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                navigate(0);
            } catch (error) {
                alert(`Произошла ошибка при отправке запроса: ${error}`);
            }
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    return (
        <Container>
            <Title>Продукция</Title>
            <div>
                {admin === "ROLE_ADMIN" &&
                    <Button variant="contained" style={{marginRight: "2.5vw"}} color="primary"
                            onClick={handleAddItemClick}>
                        Добавить продукцию
                    </Button>
                }
                <Button variant="contained" color="secondary" onClick={handleSearchClick}>
                    Поиск
                </Button>
            </div>
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Изображение</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Тип</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.slice(pg * 5, pg * 5 + 5).map((item, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={() => navigate(`/items/${item.id}?catalog=${catalogId}`)}>
                                <TableCell>
                                    <Image src={itemImage[index]} alt={item.name}/>
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.type === "SERVICE" ? "Услуга" : "Продукт"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[5]} component="div" count={items.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openAddItemDialog} onClose={() => setOpenAddItemDialog(false)}>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    {/* Описание */}
                    <Button variant="outlined" color="primary" onClick={handleAddDescriptionField}>
                        Добавить поле в описание
                    </Button>
                    {Object.entries(newItem.description).map(([label, value], index) => (
                        <div key={index}>
                            <TextField
                                label={label}
                                value={value}
                                onChange={(e) => {
                                    const newDescription = {...newItem.description};
                                    newDescription[label] = e.target.value;
                                    setNewItem({...newItem, description: newDescription});
                                }}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    ))}
                    {images.map((image, index) => (
                        <div key={index} style={{marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                            <input
                                id={`image-upload-${index}`}
                                type="file"
                                style={{display: 'none'}}
                                onChange={(e) => handleFileChange(index, e)}
                            />
                            <label htmlFor={`image-upload-${index}`} style={{marginRight: '8px'}}>
                                <Button component="span" variant="contained" startIcon={<CloudUpload/>} color="primary">
                                    Загрузить изображение
                                </Button>
                            </label>
                            {filePreviews[index] && (
                                <img
                                    src={filePreviews[index]}
                                    alt={`Изображение ${index + 1}`}
                                    style={{width: '50px', height: '50px', marginRight: '8px'}}
                                />
                            )}
                            {/*<span>{image.multipartFile ? `Выбран файл: ${image.multipartFile.name}` : 'Файл не выбран'}</span>*/}
                        </div>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddImage}>
                        Добавить изображение
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddItemDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveItem} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)}>
                <DialogTitle>Поиск продукции</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Поисковый запрос"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSearchDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSearch} color="primary">
                        Поиск
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ItemsPage
