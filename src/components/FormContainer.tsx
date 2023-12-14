import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 15vw;
  gap: .5vw;
  background-color: rgb(229, 229, 229);
  padding: 2vw;
  border-radius: .5vw;
`

export const Input = styled.input`
  padding: .5vw;
  border-radius: .25vw;
  border: none;
  outline: none;
`

export const TextArea = styled.textarea`
  padding: .5vw;
  border-radius: .25vw;
  border: none;
  outline: none;
`

export const Button = styled.button`
  padding: .5vw;
  background-color: rgb(65, 105, 225);
  color: rgb(255, 255, 255);
  cursor: pointer;
  border: none;
  border-radius: .25vw;
  transition: .5s ease-out;
  
  &:hover {
    transform: scale(1.1);
  }
`