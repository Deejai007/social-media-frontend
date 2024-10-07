import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "redux/store/store";
import Nav from "../components/SideNav";

const ComponentName: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hi");
    console.log(user);
  }, []);
  return (
    <div className="h-screen">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint veritatis
      mollitia nemo sequi harum perferendis voluptate suscipit vitae, similique
      nihil?
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est nostrum
      laborum similique odio fugiat quibusdam consequuntur. Placeat dolores non
      nam. Culpa, repellendus commodi quod tenetur porro pariatur quam atque, in
      laboriosam sapiente neque ullam odit. Similique delectus ex autem
      molestiae sed tempore? Deserunt accusamus earum iste quo voluptate illo
      soluta doloribus doloremque consequuntur error eius repellat aut at
      quibusdam, deleniti unde minima nesciunt esse. Deserunt, veniam assumenda
      ea praesentium, molestiae eligendi et dolorum fugiat quam quisquam
      aspernatur nostrum obcaecati placeat saepe eius nihil! Possimus eligendi
      aut provident quam, fugiat pariatur quos harum vel animi expedita
      excepturi esse dolor omnis et?
    </div>
  );
};

export default ComponentName;
