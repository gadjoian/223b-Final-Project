import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia'
import PageviewIcon from '@material-ui/icons/Pageview';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 300,
    width: 250,
    margin: 'auto',
  },
  control: {
    padding: theme.spacing(2),
  },
  containerDiv: {
    height: 500,
    width: 400,
    backgroundColor: 'rgb(40,40,40)'
  },
  button: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

export default function SpacingGrid(props) {
  const [spacing] = React.useState(2);
  const classes = useStyles();


  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing}>
          {props.artList.map((value) => (
            <Grid key={value} item>
              <div className={classes.containerDiv}>
                <div>
                <h2 style={{color: "white", textAlign: 'center' }}>{value.artName}</h2>
                </div>
                <CardMedia 
                      className={classes.paper}
                      image={`https://picsum.photos/id/${Math.floor(Math.random() * Math.floor(100))}/350/250`}
                  />
                  <div>
                    <h4 style={{color: "white", textAlign: 'center' }}>Artist: {value.artist}</h4>
                  </div>
                  <div style={{marginLeft :'60px'}}className={classes.button}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}
                      startIcon={<PageviewIcon />}
                    >
                      History
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={() => props.onClick(value)}
                      endIcon={<MonetizationOnIcon />}
                    >
                      Request Art
                    </Button>
                  </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}