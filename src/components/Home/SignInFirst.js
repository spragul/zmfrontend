import React from "react";
import { Paper, Grid, Box, Typography, Divider, Button, makeStyles } from "@material-ui/core";
import GTranslateIcon from "@material-ui/icons/GTranslate";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
  Modal: {
    position: "absolute",
    top: "35vh",
    left: "35vw",
    right: "35vw",
    minWidth: "30%",
    backgroundColor: "white",
    paddingBottom: "2%",
  },
  signInButtons: {
    width: "88%",
  },
});

export default function SignInFirst(props) {
  const classes = useStyles();
  const history =useHistory();

 function openloginpage(){
    history.push("/login")
  }
  function signuppage(){
    history.push("/signup")
  }
  return (
    <Paper className={classes.Modal}>
      <Box textAlign="center">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Sign In </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              className={classes.signInButtons}
              color="secondary"
              variant="contained"
              startIcon={<GTranslateIcon />}
              onClick={() => openloginpage()}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              className={classes.signInButtons}
              color="secondary"
              variant="contained"
              startIcon={<GTranslateIcon />}
              onClick={() => signuppage()}
            >
              Sigup
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
