import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(.5),
      width: '25ch',
      color: 'whiteSend'
    },
  },
}));

export default function ColorTextFields(props) {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="art-name"
        label="Art Name"
        variant="outlined"
        color="secondary"
        name="artName"
        value={props.input.artName}
        onChange={props.onChange}
      />
      <TextField
        id="artist-name"
        label="Artist Name"
        variant="outlined"
        color="secondary"
        name="artist"
        value={props.input.artist}
        onChange={props.onChange}
      />
    </form>
  );
}