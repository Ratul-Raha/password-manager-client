import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FolderIcon from "@material-ui/icons/Folder";
import {
  Modal,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    outline: "none",
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const userEmail = localStorage.getItem("super-email");
  const location = useLocation();
  const urlParts = location.pathname.split("/");
  const selectedFolderName = urlParts[urlParts.length - 1];
  const selectedRoute = urlParts[1];
  const [editFolderName, setEditFolderName] = useState();
  const [previousFolderName, setPreviousFolderName] = useState();
  const navigate = useNavigate();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const updateFolder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/update-folder",
        {
          editFolderName: previousFolderName,
          userEmail: userEmail,
          updatedFolderName: editFolderName,
        }
      );
      if ((response.status = 200)) toast.success("Folder updated");
      console.log(response);
      setFolders(response.data.folders);
      setEditModalOpen(false);
      setEditFolderName("");
      setButtonDisabled(false);
    } catch (error) {
      console.log(error.response.data); // handle error response
      setButtonDisabled(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    updateFolder();
  };

  const handleEdit = async (editFolderName) => {
    setEditModalOpen(true);
    setEditFolderName(editFolderName);
    setPreviousFolderName(editFolderName);
  };

  const handleDelete = async (folderName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the folder ${folderName}?`
      )
    ) {
      const response = await axios.post(
        "http://localhost:5000/api/users/delete-folder",
        {
          folderName: folderName,
          userEmail: userEmail,
        }
      );
      setFolders(response.data.folders);
    }
  };

  const handleItemClick = (itemName) => {
    window.location.href = `/category-wise-item-list/${itemName}`;
  };

  const handleFolderClick = (itemName) => {
    navigate(`/folder-wise-item-list/${itemName}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const createFolder = async () => {
    setButtonDisabled(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/create-folder",
        {
          folderName: folderName,
          userEmail: userEmail,
        }
      );
      if ((response.status = 200)) toast.success("Folder created");
      console.log(response);
      setOpenModal(false);
      setFolders(response.data.folders);
      setButtonDisabled(false);
    } catch (error) {
      console.log(error.response.data); // handle error response
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios.post(
        "http://localhost:5000/api/users/get-folder",
        {
          userEmail: userEmail,
        }
      );
      setFolders(result.data.folders);
    }
    fetchData();
    if (selectedRoute === "folder-wise-item-list") {
      setOpen(true);
    } else if (selectedRoute === "category-wise-item-list") {
      setOpen2(true);
    } else {
      setOpen(false);
      setOpen2(false);
    }
  }, []);

  const handleFormSubmit = (e) => {
    setButtonDisabled(true);
    e.preventDefault();
    createFolder();
  };

  const handleChange = (e) => {
    setFolderName(e.target.value);
    console.log(folderName);
  };

  const handleEditChange = (e) => {
    setEditFolderName(e.target.value);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <ToastContainer />
      <List>
        <ListItem
          button
          component={Link}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Folders" />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <div
              onClick={handleOpenModal}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
              }}
            >
              <ListItem
                button
                className={classes.nested}
                style={{ paddingLeft: "2%" }}
              >
                <div
                  style={{ width: "100%", paddingLeft: "10%", display: "flex" }}
                >
                  <AddIcon />
                  <ListItemText primary="New Folder" />
                </div>
              </ListItem>
            </div>
            {folders.map((folder) => {
              const isMatch = folder.folderName === selectedFolderName;
              return (
                <ListItem
                  button
                  className={classes.nested}
                  style={{ paddingLeft: "10%" }}
                  key={folder.folderName}
                  selected={isMatch}
                >
                  <ArrowRightAltIcon />
                  <ListItemText
                    primary={folder.folderName}
                    onClick={() => handleFolderClick(folder.folderName)}
                  />
                  <div style={{ display: "flex" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(folder.folderName)}
                    >
                      <EditIcon style={{ color: "orange" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(folder.folderName)}
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Collapse>

        <ListItem button onClick={handleClick2}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Items" />
          {open2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: "80px" }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Social"
                onClick={() => handleItemClick("Social")}
              />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: "80px" }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Official"
                onClick={() => handleItemClick("Official")}
              />
            </ListItem>
          </List>
        </Collapse>
      </List>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className={classes.modal}>
          <Typography variant="h6">Create New Folder</Typography>
          <form onSubmit={handleFormSubmit}>
            <Box my={2}>
              <TextField
                label="Folder Name"
                variant="outlined"
                name="folderName"
                value={folderName}
                autoFocus
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box my={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                disabled={buttonDisabled}
              >
                Submit
              </Button>
            </Box>
          </form>
        </div>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className={classes.modal}>
          <Typography variant="h6">Edit Folder</Typography>
          <form onSubmit={handleEditSubmit}>
            <Box my={2} style={{ marginTop: "10px" }}>
              <TextField
                label="Folder Name"
                variant="outlined"
                name="folderName"
                value={editFolderName}
                autoFocus
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Box>
            <Box my={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                disabled={buttonDisabled}
              >
                Update
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
    </Drawer>
  );
};

export default Sidebar;
