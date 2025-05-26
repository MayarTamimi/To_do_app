import React from "react";
import { Links } from "react-router-dom";
import Header from "./Header/Header";
import Middle from "./Middle/Middle";
import MiddleBar from "./MiddleBar/MiddleBar";
import Panda from "./Ghost/Ghost";
import Ghosts from "./Ghosts/Ghosts";
import Escape from "./Escape/Escape";
import Footer from "./Footer/Footer";
const Home = () => {
  return (
    <>
      <Header />
      <Middle />
      <MiddleBar />
      <Panda />
      <Ghosts />
      <Escape />
      <Footer />
    </>
  );
};

export default Home;
