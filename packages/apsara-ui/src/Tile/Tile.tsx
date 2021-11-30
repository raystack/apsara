import React from "react";
import { Container, Title, Description } from "./Tile.styles";

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
