import { style } from "@vanilla-extract/css";

export const styleMenu = style({
  display: "flex",
  flex: "0 1 100vh",
  overflow: "hidden",
});

export const styleNav = style({
  flex: "0 0 max-content",
  paddingTop: "4rem",
  backgroundColor: "rgb(165, 165, 165)",
});

export const styleNavItem = style({
  cursor: "pointer",
  margin: "0.3rem 0rem",
  padding: "0.2rem 0.5rem",

  selectors: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
});

export const styleNavSelected = style({
  backgroundColor: "rgba(0, 0, 0, 0.1)",
});

export const styleContent = style({
  flex: "1 1 content",
  backgroundColor: "rgb(207, 207, 207)",
  overflowWrap: "anywhere",
});
