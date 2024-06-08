import React from 'react';
import styled from "styled-components";
import {Container} from "../components/Container";
import homePagePicture from "../assets/images/digital-marketing-05.jpg"

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
            <MainHeader>Сайт для эффективного распределения и управления рекламным контентом</MainHeader>
            <Text>На данном сайте вы можете эффективно распределять и управлять рекламным контентом.</Text>
            <Image src={homePagePicture} alt="Изображения на главной"/>
        </Container>
    )
}

export default HomePage
