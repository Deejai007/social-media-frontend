import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosApi from "utils/axiosconfig";
import { UserState } from "redux/types/user";
// import { fetchPosts } from 'redux/actions/postActions';
const initialState: UserState = {
  user: null,
  isFollowing: false,
  loading: false,
  error: null,
  successMessage: null,
};

// get posts
export const fetchPosts = createAsyncThunk(
  "post/getposts",
  async (id: Number, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/user/register", id);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

// create post
export const createPost = createAsyncThunk(
  "post/createpost",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log(formData);

      const response = await axiosApi.post("/post/upload-post", formData, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
