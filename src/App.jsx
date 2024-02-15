// import './App.css'
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import Navbar from "./constants/Navbar";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";

function App() {
  return (
  // <AuthProvider>
  //   <Navbar />
  // </AuthProvider>
  <AuthProvider>      
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            element={
              <ProtectedLayout>
                  <Navbar />
              </ProtectedLayout>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="*"
            element={
            <NotFound/>
            }
          />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
)}

export default App;
