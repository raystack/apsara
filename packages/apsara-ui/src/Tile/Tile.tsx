import React from "react";
import styled from "styled-components";
import Colors from "../Colors";

const DIV = styled.div``;
const Container = styled(DIV)<{ active: boolean }>`
    max-width: 275px;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
    padding: 12px 16px 20px;
    min-height: 82px;
    box-sizing: border-box;
    background: ${({ active }) => (active ? "#f5f7f8" : "white")};
    border-right: ${({ active }) => (active ? `2px solid ${Colors.primary[500]}` : "none")};
`;
const Title = styled.div`
    text-align: left;
    color: rgba(0, 0, 0, 0.9);
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 14px;
    letter-spacing: 0.12 px;
`;
const Description = styled.div`
    font-size: 11px;
    color: ${Colors.black[400]};
    text-align: left;
    line-height: 13px;
    letter-spacing: 0.11px;
`;

interface TileProps {
    title: string;
    description?: string;
    active: boolean;
}

// eslint-disable-next-line react/display-name
const Tile = ({ title, description, active = false }: TileProps) => (
    <Container role="presentation" active={active}>
        <Title>{title}</Title>
        <Description>{description}</Description>
    </Container>
);
export default Tile;
