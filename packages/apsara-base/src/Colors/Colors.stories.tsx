import React from "react";
import Colors from "./Colors";
import { showSuccess, showError } from "../Notification";

export default {
    title: "General/Colors",
    component: Colors,
};

const styles = {
    width: "24px",
    height: "24px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
    display: "inline-block",
};

export const ColorsList = () => {
    const handleCopy = (color: string) => {
        navigator.clipboard
            .writeText(color)
            .then(() => {
                showSuccess("Copied to Clipboard");
            })
            .catch(() => {
                showError("Unable to Copy");
            });
    };
    return (
        <>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[50] }}
                    onClick={() => handleCopy("Colors.Black[50]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[100] }}
                    onClick={() => handleCopy("Colors.Black[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[150] }}
                    onClick={() => handleCopy("Colors.Black[150]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[200] }}
                    onClick={() => handleCopy("Colors.Black[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[300] }}
                    onClick={() => handleCopy("Colors.Black[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[400] }}
                    onClick={() => handleCopy("Colors.Black[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[500] }}
                    onClick={() => handleCopy("Colors.Black[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[800] }}
                    onClick={() => handleCopy("Colors.Black[800]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[1200] }}
                    onClick={() => handleCopy("Colors.Black[1200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[1600] }}
                    onClick={() => handleCopy("Colors.Black[1600]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Black[2000] }}
                    onClick={() => handleCopy("Colors.Black[2000]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[100] }}
                    onClick={() => handleCopy("Colors.Blue[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[200] }}
                    onClick={() => handleCopy("Colors.Blue[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[300] }}
                    onClick={() => handleCopy("Colors.Blue[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[400] }}
                    onClick={() => handleCopy("Colors.Blue[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[500] }}
                    onClick={() => handleCopy("Colors.Blue[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Blue[800] }}
                    onClick={() => handleCopy("Colors.Blue[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[100] }}
                    onClick={() => handleCopy("Colors.Green[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[200] }}
                    onClick={() => handleCopy("Colors.Green[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[300] }}
                    onClick={() => handleCopy("Colors.Green[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[400] }}
                    onClick={() => handleCopy("Colors.Green[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[500] }}
                    onClick={() => handleCopy("Colors.Green[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Green[800] }}
                    onClick={() => handleCopy("Colors.Green[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[100] }}
                    onClick={() => handleCopy("Colors.Red[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[200] }}
                    onClick={() => handleCopy("Colors.Red[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[300] }}
                    onClick={() => handleCopy("Colors.Red[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[400] }}
                    onClick={() => handleCopy("Colors.Red[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[500] }}
                    onClick={() => handleCopy("Colors.Red[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Red[800] }}
                    onClick={() => handleCopy("Colors.Red[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[100] }}
                    onClick={() => handleCopy("Colors.Orange[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[200] }}
                    onClick={() => handleCopy("Colors.Orange[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[300] }}
                    onClick={() => handleCopy("Colors.Orange[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[400] }}
                    onClick={() => handleCopy("Colors.Orange[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[500] }}
                    onClick={() => handleCopy("Colors.Orange[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Orange[800] }}
                    onClick={() => handleCopy("Colors.Orange[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[100] }}
                    onClick={() => handleCopy("Colors.Pink[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[200] }}
                    onClick={() => handleCopy("Colors.Pink[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[300] }}
                    onClick={() => handleCopy("Colors.Pink[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[400] }}
                    onClick={() => handleCopy("Colors.Pink[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[500] }}
                    onClick={() => handleCopy("Colors.Pink[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.Pink[800] }}
                    onClick={() => handleCopy("Colors.Pink[800]")}
                />
            </div>
        </>
    );
};
