import { styled } from "../../stitches.config";

export const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: 560,
  height: "100%",
  margin: "0 auto",

  ".svg-container": {
    background: "$bgBase",
    display: "flex",
    alignCenter: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    svg: {
      width: 32,
      height: 32,
      color: "$fgBase",
    },
  },
  h3: {
    fontSize: "$4",
    fontWeight: 600,
    color: "$fgBase",
    marginTop: "$4",
  },

  ".pera": {
    fontSize: "$4",
    color: "$fgBase",
    marginTop: "$1",
    span: {
      cursor: "pointer",
      color: "$fgBase",
      fontWeight: 500,
      padding: 4,
      borderRadius: 6,
      "&:hover": {
        background: "$bgInset",
      },
    },
    a: {
      cursor: "pointer",
      color: "$primary11",
      fontWeight: 500,
      padding: 4,
      borderRadius: 6,
      "&:hover": {
        background: "$bgInset",
      },
    },
  },
});
