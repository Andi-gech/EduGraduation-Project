import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function IsLoading() {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Loading
      </Typography>
    </Backdrop>
  );
}
