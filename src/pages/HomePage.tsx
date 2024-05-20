import React from 'react';
import styled from "styled-components";
import {Container} from "../components/Container";
import homePagePicture from "../assets/images/procurement-banner-01-03-22.png"

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
            <MainHeader>Программное средство для эффективных закупок и контроля договоров</MainHeader>
            <Text>Оптимизируйте и автоматизируйте процессы закупок, контроля исполнения договоров, аналитики и отчетности в вашем бизнесе с помощью нашего программного обеспечения.</Text>
            <Image src={homePagePicture} alt="Изображения на главной (ЭЦП)"/>
        </Container>
    )
}

export default HomePage
