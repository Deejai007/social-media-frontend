import {
  fetchPosts,
  fetchFeed,
  createPost,
  getSinglePost,
  getUserPosts,
  likePost,
  unlikePost,
} from "../actions/PostActions";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { PostState, Post } from "../types/post";
const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  feedPosts: [],
  feedLoading: false,
  feedError: null,
  feedHasMore: true,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateFeedPostLike: (
      state,
      action: PayloadAction<{
        postId: number;
        isLiked: boolean;
        likeCount: number;
      }>,
    ) => {
      const post = state.feedPosts.find(
        (item) => item.id === action.payload.postId,
      );
      if (post) {
        post.isLikedByUser = action.payload.isLiked;
        post.likeCount = action.payload.likeCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        // console.log(state.user.user);
        // state.user = action.payload.data;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      .addCase(fetchFeed.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        const incomingPosts = action.payload.data as Post[];
        if (action.payload.offset === 0) {
          state.feedPosts = incomingPosts;
        } else {
          const existingIds = new Set(state.feedPosts.map((post) => post.id));
          state.feedPosts.push(
            ...incomingPosts.filter((post) => !existingIds.has(post.id)),
          );
        }
        state.feedHasMore = action.payload.hasMore;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError =
          (action.payload as string) ||
          action.error.message ||
          "Unable to load your feed.";
      })
      //   create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //   get single  post
      .addCase(getSinglePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(getSinglePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //   get user  post
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //   like post
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //   unlike  post
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateFeedPostLike } = postSlice.actions;
export default postSlice.reducer;
