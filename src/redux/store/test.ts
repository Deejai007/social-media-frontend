import { describe, expect, it } from "vitest";
import { migratePersistedState } from "redux/store/migrations";

describe("persisted Redux state migration", () => {
  it("adds missing post feed fields from older saved state", async () => {
    const migratedState = await migratePersistedState({
      _persist: { version: -1, rehydrated: true },
      post: {
        posts: [],
        error: null,
      },
    });

    expect(migratedState).toMatchObject({
      post: {
        posts: [],
        feedPosts: [],
        loading: false,
        feedLoading: false,
        error: null,
        feedError: null,
        feedHasMore: true,
      },
      _persist: { version: -1, rehydrated: true },
    });
  });

  it("preserves valid feed posts while resetting stale loading flags", async () => {
    const savedPost = {
      id: 8,
      userId: 3,
      media: null,
      caption: "Saved post",
      location: null,
      profileImage: null,
      isPrivate: false,
      username: "someone",
      createdAt: null,
      likeCount: 0,
    };
    const migratedState = await migratePersistedState({
      _persist: { version: -1, rehydrated: true },
      post: {
        feedPosts: [savedPost],
        feedLoading: true,
      },
    });

    expect(migratedState).toMatchObject({
      post: {
        feedPosts: [savedPost],
        feedLoading: false,
        loading: false,
      },
    });
  });
});
