import React from 'react';
import styled from 'styled-components';
import {Container} from "../components/Container";

const Title = styled.h1``

const ErrorPage: React.FC = () => {
    return (
        <Container style={{justifyContent: "center"}}>
            <Title>Ошибка 404. Такой страницы не существует.</Title>
        </Container>
    )
}

export default ErrorPage
