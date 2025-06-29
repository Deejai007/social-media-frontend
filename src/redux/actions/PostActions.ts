import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchPosts } from 'redux/actions/postActions';
// import { getSinglePost } from './PostAcitons';
import { UserState } from "redux/types/user";
import axiosApi from "utils/axiosconfig";
import axios from "axios";
const initialState: UserState = {
  user: null,
  isFollowing: null,
  loading: false,
  error: null,
  followList: [],
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
// get single post
export const getSinglePost = createAsyncThunk(
  "post/getsinglepost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/post/get-post/${postId}`);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

// get user posts for user's profile page
export const getUserPosts = createAsyncThunk(
  "post/getuserposts",
  async (
    postData: { userId: string; limit: number; offset: number },
    { rejectWithValue },
  ) => {
    try {
      // console.log(postData.userId);
      const response = await axiosApi.get(
        `/post/get-user-posts/${postData.userId}?limit=${postData.limit}&offset=${postData.offset}`,
      );

      // console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

// like a post
export const likePost = createAsyncThunk(
  "post/likepost",
  async (postId: string, { rejectWithValue }) => {
    try {
      console.log(postId);
      const response = await axiosApi.post(`/post/like-post`, {
        postId: postId,
      });

      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

// unlike a post
export const unlikePost = createAsyncThunk(
  "post/unlikepost",
  async (postData: { postId: string }, { rejectWithValue }) => {
    try {
      // console.log(postData.userId);
      const response = await axiosApi.post(`/post/unlike-post`, postData);

      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
