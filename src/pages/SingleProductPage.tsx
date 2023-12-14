import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Container} from "../components/Container";
import {useLocation, useNavigate} from "react-router-dom";
import {Product} from "../types/Products";
import axios from "axios";
import {CloudUpload, DeleteOutlined, EditOutlined} from "@mui/icons-material";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

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

const Desc = styled.p``

const MainImage = styled.img`
  width: 20vw;
  height: 45vh;
`

const Image = styled.img`
  width: 6vw;
  height: 12.5vh;
`

const SingleProductPage: React.FC = () => {
    const [product, setProduct] = useState<Product>({nameProduct: "", description: "", images: []})
    const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedDescription, setEditedDescription] = useState<string>('');
    const productId = useLocation().pathname.split("/")[2]
    const catalogId = useLocation().search.split("=")[1]
    const navigate = useNavigate()
    const [newProduct, setNewProduct] = useState<{
        idProduct: number,
        nameProduct?: string,
        description?: string
    }>({idProduct: Number(productId)});
    const [isImageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedImage, setSelectedImage] = useState<number | undefined>(0)

    const [user,] = useLocalStorage<LocalStorageData>('user')
    const [isUser, setIsUser] = useState<number>(-1)

    useEffect(() => {
        if (user?.id_company !== -1 && user?.token && user?.username) {
            const decodedToken = jwtDecode(user.token) as DecodedToken;
            setIsUser(decodedToken.isAdmin);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            axios.get(`http://localhost:8080/api/products/getProduct/${productId}`)
                .then(res => setProduct(res.data))
        })()
    }, [productId])

    const handleEditIconClick = () => {
        setEditDialogOpen(true);
        setEditedName(product.nameProduct);
        setEditedDescription(product.description);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    const handleSaveChanges = async () => {
        await axios.put(`http://localhost:8080/api/products/updateProduct?id_catalog=${catalogId}&id_company_info=${user?.id_company}`, newProduct)
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

    const deleteProduct = async () => {
        await axios.delete(`http://localhost:8080/api/products/deleteProduct/${productId}?id_company_info=${user?.id_company}`)
            .then(() => navigate('/'))
    }

    return (
        <Container>
            {isUser === 0 &&
                <EditIcon fontSize="large" onClick={handleEditIconClick}/>
            }
            {isUser === 0 &&
                <DeleteIcon fontSize="large" onClick={deleteProduct}/>
            }
            <MainContainer>
                <LeftContainer>
                    <TopContainer>
                        {product.images.map((image, index) => {
                            if (image.main) {
                                return (
                                    <MainImage
                                        key={index}
                                        src={"data:" + image.type + ";base64," + image.file_image}
                                        alt="MainImage"
                                        onClick={() => {
                                            if (isUser === 0) {
                                                setImageDialogOpen(true)
                                                setSelectedImage(image.idImages)
                                            }
                                        }}
                                    />
                                )
                            }
                            return null
                        })}
                    </TopContainer>
                    <BottomContainer>
                        {product.images.map((image, index) => (
                            !image.main && (
                                <Image
                                    key={index}
                                    src={"data:" + image.type + ";base64," + image.file_image}
                                    alt={`${index + 1}`}
                                    onClick={() => {
                                        if (isUser === 0) {
                                            setImageDialogOpen(true)
                                            setSelectedImage(image.idImages)
                                        }
                                    }}
                                />
                            )
                        ))}
                    </BottomContainer>
                </LeftContainer>
                <RightContainer>
                    <Title>Название продукта: {product.nameProduct}</Title>
                    <Desc>Описание: {product.description}</Desc>
                </RightContainer>
            </MainContainer>
            <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Изменение товара</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={editedName}
                        onChange={(e) => {
                            setNewProduct({...newProduct, nameProduct: e.target.value})
                            setEditedName(e.target.value)
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={editedDescription}
                        onChange={(e) => {
                            setNewProduct({...newProduct, description: e.target.value})
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

export default SingleProductPage
