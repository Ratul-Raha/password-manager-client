import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Switch from "react-router-dom";
import SignUp from "./views/authentication/SignUp";
import SignIn from "./views/authentication/SignIn";
import Dashboard from "./views/authentication/pages/Dashboard";
import Layout from "./views/authentication/component/Layout";
import CategoryWiseItemList from "./views/authentication/pages/CategoryWiseItemList";
import EditItem from "./views/authentication/pages/EditItem";
import FolderWiseItemList from "./views/authentication/pages/FolderWiseItemList";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/category-wise-item-list/:itemName"
            element={
              <Layout>
                <CategoryWiseItemList />
              </Layout>
            }
          />
          <Route
            path="/edit-item/:item"
            element={
              <Layout>
                <EditItem />
              </Layout>
            }
          />
          <Route
            path="/folder-wise-item-list/:itemName"
            element={
              <Layout>
                <FolderWiseItemList />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
