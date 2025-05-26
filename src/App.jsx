import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/HomePage/Home.jsx";
import Login from "./component/Auth/LogIn/LogIn.jsx";
import Signup from "./component/Auth/SignUp/SignUp.jsx";
import TaskList from "./component/TaskList/Table/TaskListPage/TaskListPage.jsx";
import TaskGridPage from "./component/TaskList/Grid/TaskGridPage.jsx";
import SettingsPage from "./component/Settings/SettingsPage/SettingsPage.jsx";
import Hunting from "./component/HuntGhostRoom/Hunting.jsx";
import Header from "./UI/Header/Header.jsx";
import { ThemeProvider } from "./Hooks/ThemContext.jsx";
import { useScrollToTop } from "./Hooks/ScrollToTop";

const App = () => {
  const ScrollToTop = () => {
    useScrollToTop();
    return null;
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/hunt" element={<Hunting />} />
          <Route path="/grid" element={<TaskGridPage />} />
          <Route path="/table" element={<TaskList />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
