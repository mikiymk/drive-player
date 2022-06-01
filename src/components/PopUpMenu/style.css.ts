import { style } from "@vanilla-extract/css";

export const styleRightMenu = style({
  position: "fixed",

  top: 0,
  left: 0,

  backgroundColor: "white",
  borderColor: "gray",
  borderStyle: "solid",
  borderWidth: "0.1rem",

  minWidth: "10rem",
});

export const styleSubMenu = style({
  position: "absolute",

  backgroundColor: "white",
  borderColor: "gray",
  borderStyle: "solid",
  borderWidth: "0.1rem",

  minWidth: "10rem",
});

export const styleItem = style({
  margin: "0.5rem",
});

export const styleHorizon = style({
  height: 0,
  width: "100%",
  borderBottom: "solid black 1px",
  margin: "0.2rem",
});
