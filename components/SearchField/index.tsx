import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { Container } from "../container";
import { TextField } from "../textfield";

type SearchFieldProps = React.ComponentProps<typeof TextField> & {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    keyPressed: React.KeyboardEventHandler<HTMLInputElement>;
};

export const SearchField = React.forwardRef<React.ElementRef<typeof TextField>, SearchFieldProps>(
    ({ query, setQuery, keyPressed, ...props }, forwardedRef) => {
        return (
            <Container css={{ position: "relative", padding: 0 }}>
                <Container
                    css={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "$2",
                        paddingRight: "$2",
                    }}
                >
                    <MagnifyingGlassIcon />
                </Container>
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => keyPressed(e)}
                    ref={forwardedRef}
                    css={{
                        px: "$8",
                        height: "$8",
                        borderRadius: "$1",
                    }}
                    {...props}
                />
                {query != "" && (
                    <Cross2Icon
                        width={20}
                        height={20}
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            height: "100%",
                            padding: "2px",
                            margin: "0px 6px",
                            display: "flex",
                            alignItems: "center",
                            color: "$fgBase",
                        }}
                        onClick={() => setQuery("")}
                        aria-label="Remove search text"
                    />
                )}
            </Container>
        );
    },
);
SearchField.displayName = "SearchField";
