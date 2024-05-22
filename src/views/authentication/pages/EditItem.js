import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastClassName, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    width: "60%",
    padding: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const EditItem = () => {
  const { item } = useParams();
  const classes = useStyles();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("");
  const [folder, setFolder] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");
    if (!superEmail) {
      window.location.href = "/";
    }

    async function fetchData() {
      const result = await axios.post(
        "http://localhost:5000/api/users/get-category-wise-item-by-id",
        {
          item: item,
        }
      );
      console.log(result.data);

      const { name, password, url, type, username, notes, folder } =
        result.data;

      setName(name);
      setUsername(username);
      setPassword(password);
      setUrl(url);
      setNotes(notes);
      setType(type);
      setFolder(folder.folderName);
      setIsLoading(false);
      console.log("fffffffffffffffff", folder);
    }
    fetchData();

    async function fetchFolder() {
      const folders = await axios.post(
        "http://localhost:5000/api/users/get-folder",
        {
          userEmail: superEmail,
        }
      );
      setFolders(folders.data.folders);
    }
    fetchFolder();
  }, [item]);

  const handleUpdate = () => {
    const updatedItem = {
      name,
      username,
      password,
      url,
      notes,
      type,
      folder,
    };

    async function updateData() {
      setButtonDisabled(true);
      const result = await axios.post(
        "http://localhost:5000/api/users/update-category-wise-item",
        {
          updatedItem: updatedItem,
          id: item,
        }
      );
      if (result.status === 200) {
        setButtonDisabled(false);
        toast.success("Successfully updated Item");
        console.log(result.data);
      }
    }
    updateData();
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Paper className={classes.root}>
          <ToastContainer />
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={classes.input}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={classes.input}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Url"
                variant="outlined"
                fullWidth
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className={classes.input}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Notes"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                rowsMax={10}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className={classes.input}
              />
            </Grid>
            <Grid item>
              <Select
                label="Type"
                variant="outlined"
                fullWidth
                value={type}
                onChange={(event) => setType(event.target.value)}
                className={classes.input}
              >
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Official">Official</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Select
                label="Type"
                variant="outlined"
                fullWidth
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className={classes.input}
              >
                {folders.map((folder) => (
                  <MenuItem key={folder.folderName} value={folder.folderName}>
                    {folder.folderName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                className={classes.button}
                disabled={buttonDisabled}
              >
                Update
              </Button>
              <Button variant="contained" color="secondary">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default EditItem;
