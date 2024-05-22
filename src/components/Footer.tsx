import React from 'react';
import styled from "styled-components";
import {DateTime} from "luxon";

const Wrapper = styled.footer`
  display: flex;
  background-color: rgb(255, 255, 255);
  color: rgb(51, 51, 51);
  padding: .8vw;
  align-items: center;
  justify-content: center;
  height: calc(10vh - 1.6vw);
  border-top: .15vw solid rgb(51, 51, 51);
`

const Content = styled.p`
  font-size: 1.25rem;
  text-align: center;
`

const Footer: React.FC = () => {
    return (
        <Wrapper>
            <Content>&copy; {DateTime.now().year} Bank. Все права защищены.</Content>
        </Wrapper>
    )
}

export default Footer
