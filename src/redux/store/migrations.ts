import { PersistedState } from "redux-persist";
import { PostState } from "redux/types/post";
import { initialPostState } from "redux/reducers/postReducer";

type PersistedRootState = Exclude<PersistedState, undefined> & {
  post?: Partial<PostState>;
};

export const migratePersistedState = async (
  persistedState: unknown,
): Promise<PersistedState> => {
  if (!persistedState || typeof persistedState !== "object") {
    return persistedState as PersistedState;
  }

  const savedState = persistedState as PersistedRootState;
  const savedPostState = savedState.post;

  return {
    ...savedState,
    post: {
      ...initialPostState,
      ...savedPostState,
      posts: Array.isArray(savedPostState?.posts)
        ? savedPostState.posts
        : initialPostState.posts,
      feedPosts: Array.isArray(savedPostState?.feedPosts)
        ? savedPostState.feedPosts
        : initialPostState.feedPosts,
      loading: false,
      feedLoading: false,
      error: null,
      feedError: null,
    },
  } as PersistedState;
};
