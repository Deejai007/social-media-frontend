import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "redux/store/store";
import Nav from "../components/SideNav";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const navigate = useNavigate();
  console.log("User:", user);
  console.log("hi");
  useEffect(() => {
    console.log("Hi");
    console.log(user);
    if (!user.user) console.log("Not logged in");
    else console.log("logged in");
  }, []);
  return (
    <div className="h-screen">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint veritatis
      mollitia nemo sequi harum perferendis voluptate suscipit vitae, similique
      nihil?
      <br />
      <br />
    </div>
  );
};

export default Home;
