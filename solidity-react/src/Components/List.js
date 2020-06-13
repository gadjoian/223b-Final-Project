import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 700,
    marginBottom: '2px',
  },
  image: {
    width: 200,
    height: 200,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();
  console.info(props.pending)
  return (
    <div className={classes.root}>
        {(props.pending.length > 0 ? props.pending : []).map((value) => (
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item>
                    <ButtonBase className={classes.image}>
                    <img className={classes.img} alt="complex" src={`https://picsum.photos/id/${Math.floor(Math.random() * Math.floor(100))}/350/250`} />
                    </ButtonBase>
                </Grid>
                <Grid style={{marginTop: "60px"}} item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                        {value.artName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {value.artist}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                        ID: 1030114
                        </Typography>
                    </Grid>
                    </Grid>
                    <Grid item>
                    <Button onClick={() => props.onAccept(value)}>Accept</Button>
                    <Button>Reject</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
        ))};
    </div>
  );
}