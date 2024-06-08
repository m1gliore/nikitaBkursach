import React from 'react';
import styled from "styled-components";
import {DateTime} from "luxon";

const Wrapper = styled.footer`
  display: flex;
  background-color: rgb(215, 219, 220);
  color: rgb(51, 51, 51);
  padding: .8vw;
  align-items: center;
  justify-content: center;
  height: calc(10vh - 1.6vw);
`

const Content = styled.p`
  font-size: 1.25rem;
  text-align: center;
`

const Footer: React.FC = () => {
    return (
        <Wrapper>
            <Content>&copy; 2023-{DateTime.now().year} BM.</Content>
        </Wrapper>
    )
}

export default Footer
