import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Container} from "../components/Container";
import {useLocation, useNavigate} from "react-router-dom";
import {Item} from "../types/Items";
import axios from "axios";
import {CloudUpload, DeleteOutlined, EditOutlined} from "@mui/icons-material";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useLocalStorage} from "react-use";
import {LocalStorageData} from "../types/Token";

const MainContainer = styled.div`
  display: flex;
  gap: 25vw;
  margin-top: 5vw;
`

const EditIcon = styled(EditOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 1.5vw;
`

const DeleteIcon = styled(DeleteOutlined)`
  position: absolute;
  cursor: pointer;
  top: 1.5vw;
  left: 5vw;
`

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TopContainer = styled.div``

const BottomContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
`

const RightContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  width: 20vw;
`

const Title = styled.h1`
`

const Desc = styled.div`
  font-size: 1.5vw;
`

const MainImage = styled.img`
  width: 20vw;
  height: 45vh;
`

const Image = styled.img`
  width: 6vw;
  height: 12.5vh;
`

const SingleItemPage: React.FC = () => {
    const itemId = useLocation().pathname.split("/")[2]
    const catalogId = useLocation().search.split("=")[1]
    const [item, setItem] = useState<Item>({
        id: parseInt(itemId, 10),
        name: '',
        description: new Map(),
        type: 'PRODUCT',
        fileIdList: [],
        catalogId: parseInt(catalogId, 10)
    })
    const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedDescription, setEditedDescription] = useState<string>('');
    const navigate = useNavigate()
    const [newItem, setNewItem] = useState<{
        idItem: number,
        nameItem?: string,
        description?: string
    }>({idItem: Number(itemId)});
    const [isImageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedImage, setSelectedImage] = useState<string>("")

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [token, setToken] = useState<string>("")
    const [isUser] = useState<number>(1)
    const [itemImages, setItemImages] = useState<string[]>([])
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
                    const [itemResponse, imagesResponse] = await Promise.all([
                        axios.get(`http://localhost:8080/server/coursework-admin/api/item/${itemId}`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        }),
                        Promise.allSettled(
                            item.fileIdList.map(async (fileId: number) => {
                                try {
                                    const fileResponse = await axios.get(`http://localhost:8080/server/coursework-auth/api/file/${fileId}/view`, {
                                        headers: {
                                            Authorization: `${token}`
                                        },
                                        responseType: 'arraybuffer'
                                    });

                                    const blob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });
                                    return URL.createObjectURL(blob);
                                } catch (error) {
                                    console.error('Error fetching image:', error);
                                    return null; // Можете вернуть что-то другое в случае ошибки
                                }
                            })
                        )
                    ]);

                    if (itemResponse.status === 200) {
                        setItem(itemResponse.data);
                    } else {
                        console.error('Error fetching item:', itemResponse.statusText);
                    }

                    const filteredImages = imagesResponse
                        .filter((response) => response.status === 'fulfilled')
                        .map((response) => response.status === 'fulfilled' ? response.value : null)
                        .filter((image) => image !== null) as string[];

                    setItemImages(filteredImages);

                } catch (error) {
                    console.error('Error fetching item and images:', error);
                }

                axios.get(`http://localhost:8080/server/coursework/api/role`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(res => setAdmin(res.data.role));

            })();
        }
    }, [item.fileIdList, itemId, token]);

    const handleEditIconClick = () => {
        setEditDialogOpen(true);
        setEditedName(item.name);
        // setEditedDescription(item.description);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    const handleSaveChanges = async () => {
        await axios.put(`http://localhost:8080/api/products/updateProduct`, newItem)
            .then(() => {
                navigate(0)
                setEditDialogOpen(false)
            })
    }

    const handleSaveImage = async () => {
        const formData = new FormData()
        if (selectedFile) {
            formData.append("idImages", String(selectedImage))
            formData.append("multipartFile", selectedFile)
            formData.append("fileName", selectedFile.name)
            formData.append("type", selectedFile.type)
            await axios.put('http://localhost:8080/api/images/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(() => {
                    navigate(0)
                    setImageDialogOpen(false)
                })
        } else {
            alert("Файл не выбран")
        }
    }

    const deleteItem = async () => {
        await axios.delete(`http://localhost:8080/server/coursework-admin/api/item/${itemId}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(() => navigate('/'))
    }

    return (
        <Container>
            {admin === "ROLE_ADMIN" &&
                <EditIcon fontSize="large" onClick={handleEditIconClick}/>
            }
            {admin === "ROLE_ADMIN" &&
                <DeleteIcon fontSize="large" onClick={deleteItem}/>
            }
            <MainContainer>
                <LeftContainer>
                    <TopContainer>
                        <MainImage
                            src={itemImages[0]}
                            alt="MainImage"
                            onClick={() => {
                                if (isUser === 0) {
                                    setImageDialogOpen(true)
                                    setSelectedImage(itemImages[0])
                                }
                            }}
                        />
                    </TopContainer>
                    <BottomContainer>
                        {itemImages.slice(1).map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={`${index + 1}`}
                                onClick={() => {
                                    if (isUser === 0) {
                                        setImageDialogOpen(true)
                                        setSelectedImage(image)
                                    }
                                }}
                            />
                        ))}
                    </BottomContainer>
                </LeftContainer>
                <RightContainer>
                    <Title>Название {item.type === "PRODUCT" ? "продукта" : "услуги"}: {item.name}</Title>
                    <Desc>
                        Описание:
                        <ul>
                            {Object.entries(item.description).map(([key, value], index) => (
                                <li key={index}>
                                    {key}: {value}
                                </li>
                            ))}
                        </ul>
                    </Desc>
                </RightContainer>
            </MainContainer>
            <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Изменение товара</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={editedName}
                        onChange={(e) => {
                            setNewItem({...newItem, nameItem: e.target.value})
                            setEditedName(e.target.value)
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={editedDescription}
                        onChange={(e) => {
                            setNewItem({...newItem, description: e.target.value})
                            setEditedDescription(e.target.value)
                        }}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveChanges} color="primary">
                        Изменить
                    </Button>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isImageDialogOpen} onClose={() => setImageDialogOpen(false)}>
                <DialogTitle>Изменение товара</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{display: 'none'}}
                        onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload" style={{marginRight: '8px'}}>
                        <Button component="span" variant="contained" startIcon={<CloudUpload/>} color="primary">
                            Загрузить изображение
                        </Button>
                    </label>
                    {selectedFile && (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt={`Выбранное изображение`}
                            style={{width: '50px', height: '50px', marginRight: '8px'}}
                        />
                    )}
                    <span>{selectedFile ? `Выбран файл: ${selectedFile.name}` : 'Файл не выбран'}</span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveImage} color="primary">
                        Изменить
                    </Button>
                    <Button onClick={() => setImageDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default SingleItemPage
