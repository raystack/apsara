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
                    style={{ ...styles, backgroundColor: Colors.primary[100] }}
                    onClick={() => handleCopy("Colors.primary[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.primary[200] }}
                    onClick={() => handleCopy("Colors.primary[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.primary[300] }}
                    onClick={() => handleCopy("Colors.primary[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.primary[400] }}
                    onClick={() => handleCopy("Colors.primary[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.primary[500] }}
                    onClick={() => handleCopy("Colors.primary[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.primary[800] }}
                    onClick={() => handleCopy("Colors.primary[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.success[100] }}
                    onClick={() => handleCopy("Colors.success[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.success[200] }}
                    onClick={() => handleCopy("Colors.success[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.success[300] }}
                    onClick={() => handleCopy("Colors.success[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.success[400] }}
                    onClick={() => handleCopy("Colors.success[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.success[500] }}
                    onClick={() => handleCopy("Colors.success[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.success[800] }}
                    onClick={() => handleCopy("Colors.success[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.error[100] }}
                    onClick={() => handleCopy("Colors.error[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.error[200] }}
                    onClick={() => handleCopy("Colors.error[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.error[300] }}
                    onClick={() => handleCopy("Colors.error[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.error[400] }}
                    onClick={() => handleCopy("Colors.error[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.error[500] }}
                    onClick={() => handleCopy("Colors.error[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.error[800] }}
                    onClick={() => handleCopy("Colors.error[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[100] }}
                    onClick={() => handleCopy("Colors.warning[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[200] }}
                    onClick={() => handleCopy("Colors.warning[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[300] }}
                    onClick={() => handleCopy("Colors.warning[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[400] }}
                    onClick={() => handleCopy("Colors.warning[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[500] }}
                    onClick={() => handleCopy("Colors.warning[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.warning[800] }}
                    onClick={() => handleCopy("Colors.warning[800]")}
                />
            </div>
            <div>
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[100] }}
                    onClick={() => handleCopy("Colors.secondary[100]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[200] }}
                    onClick={() => handleCopy("Colors.secondary[200]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[300] }}
                    onClick={() => handleCopy("Colors.secondary[300]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[400] }}
                    onClick={() => handleCopy("Colors.secondary[400]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[500] }}
                    onClick={() => handleCopy("Colors.secondary[500]")}
                />
                <span
                    style={{ ...styles, backgroundColor: Colors.secondary[800] }}
                    onClick={() => handleCopy("Colors.secondary[800]")}
                />
            </div>
        </>
    );
};
