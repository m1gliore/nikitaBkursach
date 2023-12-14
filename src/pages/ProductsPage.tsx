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
import {ImageType, Product} from "../types/Products";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {DecodedToken, LocalStorageData} from "../types/Token";
import {jwtDecode} from "jwt-decode";

const Title = styled.h1`
`

const Image = styled.img`
  width: 3vw;
  height: 6vh;
`

const ProductsPage: React.FC = () => {
    const [openAddProductDialog, setOpenAddProductDialog] = useState<boolean>(false)
    const [products, setProducts] = useState<Array<Product>>([])
    const [pg, setPg] = useState<number>(0)
    const [images, setImages] = useState<Array<ImageType>>([
        {multipartFile: null, fileName: '', type: '', main: true},
    ])
    const [filePreviews, setFilePreviews] = useState<Record<number, string | undefined>>({});
    const [newProduct, setNewProduct] =
        useState<Product>({nameProduct: '', description: '', images: images})
    const navigate = useNavigate()

    const catalogId = useLocation().search.split("=")[1]

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
            axios.get(`http://localhost:8080/api/products/productsForCatalog/${catalogId}`)
                .then(res => setProducts(res.data.content))
        })()
    }, [catalogId])

    const handleImageChange = (index: number, key: keyof ImageType, value: any) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[index] = { ...updatedImages[index], [key]: value };
            return updatedImages;
        });
    };

    const handleAddImage = () => {
        setImages([...images, {multipartFile: null, fileName: '', type: '', main: false}]);
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileName = file.name;
            const fileType = file.type;

            handleImageChange(index, 'multipartFile', file);
            handleImageChange(index, 'fileName', fileName);
            handleImageChange(index, 'type', fileType);

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

    const handleAddProductClick = () => {
        setOpenAddProductDialog(true);
    }

    const handleSaveProduct = async () => {
        setNewProduct({
            ...newProduct,
            images: [...images],
        });
        if (newProduct.images.length > 1) {
            const formData = new FormData();

            formData.append('nameProduct', newProduct.nameProduct);
            formData.append('description', newProduct.description);

            images.forEach((image, index) => {
                // Проверяем, что у изображения есть файл
                if (image.multipartFile) {
                    formData.append(`images[${index}].multipartFile`, image.multipartFile);
                    formData.append(`images[${index}].fileName`, image.fileName);
                    formData.append(`images[${index}].type`, image.type);
                    formData.append(`images[${index}].main`, image.main.toString());
                }
            })
            await axios.post(`http://localhost:8080/api/products/addProductToCatalog?id_catalog=${catalogId}&id_company_info=${user?.id_company}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(() => navigate(0))
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPg(newPage)
    }

    return (
        <Container>
            <Title>Товары</Title>
            {isUser === 0 &&
                <Button variant="contained" color="primary" onClick={handleAddProductClick}>
                    Добавить товар
                </Button>
            }
            <TableContainer style={{marginTop: '1vw'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Изображение</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(pg * 5, pg * 5 + 5).map((product, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}
                                      onClick={() => navigate(`/products/${product.idProduct}?catalog=${catalogId}`)}>
                                <TableCell>
                                    {product.images.map((image, index) => (
                                        image.main && <Image key={index}
                                                             src={"data:" + image.type + ";base64," + image.file_image}
                                                             alt={image.fileName}/>
                                    ))}
                                </TableCell>
                                <TableCell>{product.nameProduct}</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[5]} component="div" count={products.length} rowsPerPage={5}
                             page={pg}
                             onPageChange={handleChangePage}/>

            <Dialog open={openAddProductDialog} onClose={() => setOpenAddProductDialog(false)}>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={newProduct.nameProduct}
                        onChange={(e) => setNewProduct({...newProduct, nameProduct: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
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
                                    style={{ width: '50px', height: '50px', marginRight: '8px' }}
                                />
                            )}
                            <span>{image.multipartFile ? `Выбран файл: ${image.multipartFile.name}` : 'Файл не выбран'}</span>
                        </div>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddImage}>
                        Добавить изображение
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddProductDialog(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveProduct} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsPage
