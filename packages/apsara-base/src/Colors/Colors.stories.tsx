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

export const colors = () => {
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
                    style={{ ...styles, backgroundColor: Colors.black[0] }}
                    onClick={() => handleCopy("Colors.black[0]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[50] }}
                    onClick={() => handleCopy("Colors.black[50]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[75] }}
                    onClick={() => handleCopy("Colors.black[75]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[100] }}
                    onClick={() => handleCopy("Colors.black[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[125] }}
                    onClick={() => handleCopy("Colors.black[125]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[150] }}
                    onClick={() => handleCopy("Colors.black[150]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[200] }}
                    onClick={() => handleCopy("Colors.black[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[300] }}
                    onClick={() => handleCopy("Colors.black[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[400] }}
                    onClick={() => handleCopy("Colors.black[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[500] }}
                    onClick={() => handleCopy("Colors.black[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.black[600] }}
                    onClick={() => handleCopy("Colors.black[600]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[100] }}
                    onClick={() => handleCopy("Colors.blue[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[200] }}
                    onClick={() => handleCopy("Colors.blue[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[300] }}
                    onClick={() => handleCopy("Colors.blue[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[400] }}
                    onClick={() => handleCopy("Colors.blue[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[500] }}
                    onClick={() => handleCopy("Colors.blue[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.blue[800] }}
                    onClick={() => handleCopy("Colors.blue[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.green[100] }}
                    onClick={() => handleCopy("Colors.green[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.green[200] }}
                    onClick={() => handleCopy("Colors.green[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.green[300] }}
                    onClick={() => handleCopy("Colors.green[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.green[400] }}
                    onClick={() => handleCopy("Colors.green[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.green[500] }}
                    onClick={() => handleCopy("Colors.green[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.green[800] }}
                    onClick={() => handleCopy("Colors.green[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.red[100] }}
                    onClick={() => handleCopy("Colors.red[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.red[200] }}
                    onClick={() => handleCopy("Colors.red[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.red[300] }}
                    onClick={() => handleCopy("Colors.red[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.red[400] }}
                    onClick={() => handleCopy("Colors.red[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.red[500] }}
                    onClick={() => handleCopy("Colors.red[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.red[800] }}
                    onClick={() => handleCopy("Colors.red[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[100] }}
                    onClick={() => handleCopy("Colors.orange[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[200] }}
                    onClick={() => handleCopy("Colors.orange[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[300] }}
                    onClick={() => handleCopy("Colors.orange[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[400] }}
                    onClick={() => handleCopy("Colors.orange[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[500] }}
                    onClick={() => handleCopy("Colors.orange[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.orange[800] }}
                    onClick={() => handleCopy("Colors.orange[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[100] }}
                    onClick={() => handleCopy("Colors.pink[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[200] }}
                    onClick={() => handleCopy("Colors.pink[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[300] }}
                    onClick={() => handleCopy("Colors.pink[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[400] }}
                    onClick={() => handleCopy("Colors.pink[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[500] }}
                    onClick={() => handleCopy("Colors.pink[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.pink[800] }}
                    onClick={() => handleCopy("Colors.pink[800]")}
                />
            </div>
        </>
    );
};
