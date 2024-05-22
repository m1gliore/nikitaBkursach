import React from 'react';
import styled from "styled-components";
import {Container} from "../components/Container";
import homePagePicture from "../assets/images/people-taking-out-money-from-the-bank-concept-illustration_114360-12881.jpg"

const MainHeader = styled.h1``

const Text = styled.p`
  font-size: 1.25rem;
  text-align: center;
`

const Image = styled.img`
  height: 60vh;
`

const HomePage: React.FC = () => {
    return (
        <Container>
            <MainHeader>Сайт для оценки кредитозаемщиков</MainHeader>
            <Text>Оценивайте кредиты с помощью нашего сайта.</Text>
            <Image src={homePagePicture} alt="Изображения на главной (ЭЦП)"/>
        </Container>
    )
}

export default HomePage
