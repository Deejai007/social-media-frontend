import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "pages/Home";
import CreatePostPage from "pages/Create/Create";
import PostPage from "pages/PostPage";
import ProfilePage from "pages/ProfilePage";
import GeneralNotifications from "components/GeneralNotifications";
import axiosApi from "utils/axiosconfig";
import followReducer from "redux/reducers/followReducer";
import notificationReducer from "redux/reducers/notificationReducer";
import postReducer from "redux/reducers/postReducer";

const renderHome = () => {
  const store = configureStore({ reducer: { post: postReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>,
  );
};

const renderProfilePage = () => {
  const store = configureStore({
    reducer: {
      user: (state = { user: { username: "current-user" }, loading: false }) =>
        state,
      post: postReducer,
      follow: followReducer,
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/profile/target"]}>
        <Routes>
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const renderCreatePage = () => {
  const store = configureStore({ reducer: { post: postReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CreatePostPage />
      </MemoryRouter>
    </Provider>,
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Home feed", () => {
  it("shows an empty state when the feed has no posts", async () => {
    vi.spyOn(axiosApi, "get").mockResolvedValue({
      data: { success: true, data: [], hasMore: false },
    });

    renderHome();

    expect(
      await screen.findByText("Your feed is waiting for its first post"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create a post" })).toHaveAttribute(
      "href",
      "/create",
    );
  });

  it("shows an error and retry option when loading the feed fails", async () => {
    vi.spyOn(axiosApi, "get").mockRejectedValue(new Error("network error"));

    renderHome();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load your feed.",
    );
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("renders a post and updates its like count after liking it", async () => {
    vi.spyOn(axiosApi, "get").mockResolvedValue({
      data: {
        success: true,
        hasMore: false,
        data: [
          {
            id: 23,
            userId: 5,
            media: "post.png",
            caption: "A feed post",
            location: "Home",
            vibeType: "Vibin’",
            profileImage: "avatar.png",
            isPrivate: false,
            username: "someone",
            createdAt: "2026-11-16T00:00:00.000Z",
            likeCount: 2,
            isLikedByUser: false,
          },
        ],
      },
    });
    vi.spyOn(axiosApi, "post").mockResolvedValue({
      data: { success: true },
    });

    renderHome();

    expect(await screen.findByText("A feed post")).toBeInTheDocument();
    expect(screen.getByText("😎 Vibin’")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Like post" }));

    expect(await screen.findByText("3 likes")).toBeInTheDocument();
    expect(axiosApi.post).toHaveBeenCalledWith("/post/like-post", {
      postId: "23",
    });
  });

  describe("Profile page", () => {
    it("shows Follow back and replaces posts when navigating to another profile", async () => {
      vi.spyOn(axiosApi, "get").mockImplementation(async (url) => {
        if (url.startsWith("/user/getuser/")) {
          const username = url.split("/").pop();
          const isAlice = username === "alice";
          return {
            data: {
              success: true,
              data: {
                user: {
                  id: isAlice ? "1" : "2",
                  username,
                  isFollowing: null,
                  isFollowedByUser: isAlice,
                  postCount: 1,
                  followerCount: 0,
                  followingCount: 0,
                  bio: "",
                  profileImage: "",
                },
              },
            },
          };
        }

        const postId = url.includes("/1?") ? 101 : 202;
        return {
          data: {
            success: true,
            data: [
              {
                id: postId,
                media: `post-${postId}.png`,
                vibeType: postId === 101 ? "Lit" : null,
                isPrivate: false,
                likeCount: 0,
              },
            ],
          },
        };
      });

      const store = configureStore({
        reducer: {
          user: (
            state = { user: { username: "current-user" }, loading: false },
          ) => state,
          post: postReducer,
          follow: followReducer,
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/profile/alice"]}>
            <Link to="/profile/bob">Open Bob</Link>
            <Routes>
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
          </MemoryRouter>
        </Provider>,
      );

      expect(
        await screen.findByRole("button", { name: "Follow back" }),
      ).toBeVisible();
      await waitFor(() =>
        expect(
          document.querySelector('a[href="/post/101"]'),
        ).toBeInTheDocument(),
      );
      expect(await screen.findByText("🥳 Lit")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("link", { name: "Open Bob" }));

      expect(
        await screen.findByRole("button", { name: "Follow" }),
      ).toBeVisible();
      await waitFor(() => {
        expect(
          document.querySelector('a[href="/post/202"]'),
        ).toBeInTheDocument();
        expect(
          document.querySelector('a[href="/post/101"]'),
        ).not.toBeInTheDocument();
      });
    });

    it.each([
      { isFollowing: null, isFollowedByUser: false, label: "Follow" },
      { isFollowing: null, isFollowedByUser: true, label: "Follow back" },
      {
        isFollowing: "pending",
        isFollowedByUser: false,
        label: "Follow request pending",
      },
      { isFollowing: "accepted", isFollowedByUser: false, label: "Unfollow" },
    ])(
      "shows the correct action for isFollowing=$isFollowing and followsYou=$isFollowedByUser",
      async ({ isFollowing, isFollowedByUser, label }) => {
        vi.spyOn(axiosApi, "get").mockImplementation(async (url) => {
          if (url.startsWith("/user/getuser/")) {
            return {
              data: {
                success: true,
                data: {
                  user: {
                    id: "9",
                    username: "target",
                    isFollowing,
                    isFollowedByUser,
                    followerCount: 4,
                    followingCount: 0,
                  },
                },
              },
            };
          }
          return { data: { success: true, data: [] } };
        });

        renderProfilePage();
        expect(
          await screen.findByRole("button", { name: label }),
        ).toBeVisible();
      },
    );

    it("disables follow while the request is pending and updates to pending on success", async () => {
      let resolveRequest!: (response: {
        data: {
          success: boolean;
          data: { status: string };
          message?: string;
        };
      }) => void;
      const postSpy = vi.spyOn(axiosApi, "post").mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveRequest = resolve;
          }),
      );
      vi.spyOn(axiosApi, "get").mockImplementation(async (url) =>
        url.startsWith("/user/getuser/")
          ? {
              data: {
                success: true,
                data: {
                  user: {
                    id: "9",
                    username: "target",
                    isFollowing: null,
                    isFollowedByUser: true,
                    followerCount: 4,
                  },
                },
              },
            }
          : { data: { success: true, data: [] } },
      );

      renderProfilePage();
      fireEvent.click(
        await screen.findByRole("button", { name: "Follow back" }),
      );
      const workingButton = await screen.findByRole("button", {
        name: "Working...",
      });
      expect(workingButton).toBeDisabled();
      fireEvent.click(workingButton);
      expect(postSpy).toHaveBeenCalledTimes(1);

      resolveRequest({
        data: { success: true, data: { status: "pending" } },
      });
      expect(
        await screen.findByRole("button", { name: "Follow request pending" }),
      ).toBeVisible();
    });

    it("shows a clear error and preserves the action when follow fails", async () => {
      const { toast } = await import("react-toastify");
      const toastSpy = vi.spyOn(toast, "error").mockImplementation(() => "id");
      vi.spyOn(axiosApi, "post").mockRejectedValue(new Error("network error"));
      vi.spyOn(axiosApi, "get").mockImplementation(async (url) =>
        url.startsWith("/user/getuser/")
          ? {
              data: {
                success: true,
                data: {
                  user: {
                    id: "9",
                    username: "target",
                    isFollowing: null,
                    isFollowedByUser: false,
                    followerCount: 4,
                  },
                },
              },
            }
          : { data: { success: true, data: [] } },
      );

      renderProfilePage();
      fireEvent.click(await screen.findByRole("button", { name: "Follow" }));
      await waitFor(() =>
        expect(toastSpy).toHaveBeenCalledWith(
          "Unable to follow this user. Try again.",
        ),
      );
      expect(screen.getByRole("button", { name: "Follow" })).toBeEnabled();
    });

    it("does not decrement follower count when cancelling a pending request", async () => {
      vi.spyOn(axiosApi, "post").mockResolvedValue({
        data: { success: true },
      });
      vi.spyOn(axiosApi, "get").mockImplementation(async (url) =>
        url.startsWith("/user/getuser/")
          ? {
              data: {
                success: true,
                data: {
                  user: {
                    id: "9",
                    username: "target",
                    isFollowing: "pending",
                    followerCount: 4,
                  },
                },
              },
            }
          : { data: { success: true, data: [] } },
      );

      renderProfilePage();
      fireEvent.click(
        await screen.findByRole("button", { name: "Follow request pending" }),
      );
      expect(
        await screen.findByRole("button", { name: "Follow" }),
      ).toBeVisible();
      expect(screen.getAllByText("4")).toHaveLength(2);
    });

    it("decrements follower count after unfollowing an accepted relationship", async () => {
      vi.spyOn(axiosApi, "post").mockResolvedValue({
        data: { success: true },
      });
      vi.spyOn(axiosApi, "get").mockImplementation(async (url) =>
        url.startsWith("/user/getuser/")
          ? {
              data: {
                success: true,
                data: {
                  user: {
                    id: "9",
                    username: "target",
                    isFollowing: "accepted",
                    followerCount: 4,
                  },
                },
              },
            }
          : { data: { success: true, data: [] } },
      );

      renderProfilePage();
      fireEvent.click(await screen.findByRole("button", { name: "Unfollow" }));
      expect(
        await screen.findByRole("button", { name: "Follow" }),
      ).toBeVisible();
      expect(screen.getAllByText("3")).toHaveLength(2);
    });

    it("shows a retry option for a profile post load failure", async () => {
      const getSpy = vi
        .spyOn(axiosApi, "get")
        .mockImplementation(async (url) =>
          url.startsWith("/user/getuser/")
            ? {
                data: {
                  success: true,
                  data: {
                    user: {
                      id: "9",
                      username: "target",
                      isFollowing: null,
                      followerCount: 0,
                    },
                  },
                },
              }
            : Promise.reject(new Error("network error")),
        );

      renderProfilePage();
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Unable to load posts.",
      );
      getSpy.mockImplementation(async () => ({
        data: { success: true, data: [] },
      }));
      fireEvent.click(screen.getByRole("button", { name: "Retry" }));
      expect(await screen.findByText("No posts yet...")).toBeInTheDocument();
    });

    it("ignores an old profile's posts if its response arrives after navigation", async () => {
      let resolveAlicePosts!: (response: {
        data: {
          success: boolean;
          data: { id: number; media: string; isPrivate?: boolean }[];
        };
      }) => void;
      vi.spyOn(axiosApi, "get").mockImplementation((url) => {
        if (url === "/user/getuser/alice" || url === "/user/getuser/bob") {
          const isAlice = url.endsWith("alice");
          return Promise.resolve({
            data: {
              success: true,
              data: {
                user: {
                  id: isAlice ? "1" : "2",
                  username: isAlice ? "alice" : "bob",
                  isFollowing: null,
                  isFollowedByUser: false,
                  followerCount: 0,
                  followingCount: 0,
                },
              },
            },
          });
        }
        if (url.includes("/get-user-posts/1?")) {
          return new Promise((resolve) => {
            resolveAlicePosts = resolve;
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            data: [{ id: 202, media: "bob.png", isPrivate: false }],
          },
        });
      });

      const store = configureStore({
        reducer: {
          user: (
            state = { user: { username: "current-user" }, loading: false },
          ) => state,
          post: postReducer,
          follow: followReducer,
        },
      });
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/profile/alice"]}>
            <Link to="/profile/bob">Open Bob</Link>
            <Routes>
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
          </MemoryRouter>
        </Provider>,
      );

      expect(
        await screen.findByRole("button", { name: "Follow" }),
      ).toBeVisible();
      await waitFor(() => expect(resolveAlicePosts).toBeDefined());
      fireEvent.click(screen.getByRole("link", { name: "Open Bob" }));
      await waitFor(() =>
        expect(
          document.querySelector('a[href="/post/202"]'),
        ).toBeInTheDocument(),
      );

      resolveAlicePosts({
        data: {
          success: true,
          data: [{ id: 101, media: "alice.png", isPrivate: false }],
        },
      });
      await waitFor(() =>
        expect(
          document.querySelector('a[href="/post/101"]'),
        ).not.toBeInTheDocument(),
      );
      expect(document.querySelector('a[href="/post/202"]')).toBeInTheDocument();
    });

    it("does not start another profile page request while load more is pending", async () => {
      let resolveSecondPage!: (response: {
        data: { success: boolean; data: unknown[] };
      }) => void;
      const getSpy = vi.spyOn(axiosApi, "get").mockImplementation((url) => {
        if (url.startsWith("/user/getuser/")) {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                user: {
                  id: "9",
                  username: "target",
                  isFollowing: null,
                  followerCount: 0,
                },
              },
            },
          });
        }
        if (url.includes("offset=9")) {
          return new Promise((resolve) => {
            resolveSecondPage = resolve;
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            data: Array.from({ length: 9 }, (_, index) => ({
              id: index + 1,
              media: `post-${index + 1}.png`,
              isPrivate: false,
            })),
          },
        });
      });

      renderProfilePage();
      const loadMore = await screen.findByRole("button", {
        name: "Load more..",
      });
      fireEvent.click(loadMore);
      const loadingButton = await screen.findByRole("button", {
        name: "Loading...",
      });
      expect(loadingButton).toBeDisabled();
      fireEvent.click(loadingButton);
      expect(
        getSpy.mock.calls.filter(([url]) => url.includes("offset=9")),
      ).toHaveLength(1);

      resolveSecondPage({ data: { success: true, data: [] } });
      await waitFor(() =>
        expect(
          screen.queryByRole("button", { name: "Load more.." }),
        ).toBeNull(),
      );
      expect(document.querySelector('a[href="/post/9"]')).toBeInTheDocument();
    });
  });
});

describe("General notifications", () => {
  it("shows follower and post-like notifications and marks them read", async () => {
    vi.spyOn(axiosApi, "get").mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 8,
            type: "post_like",
            isRead: false,
            createdAt: "2026-11-17T00:00:00.000Z",
            actor: {
              id: 2,
              username: "alice",
              profileImage: null,
            },
            post: { id: 34, media: "liked-post.png" },
          },
        ],
      },
    });
    const patchSpy = vi.spyOn(axiosApi, "patch").mockResolvedValue({
      data: { success: true },
    });
    const store = configureStore({
      reducer: { notifications: notificationReducer },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GeneralNotifications />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("liked your post.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View liked post" }),
    ).toHaveAttribute("href", "/post/34");
    fireEvent.click(screen.getByRole("button", { name: "Mark read" }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Mark read" })).toBeNull(),
    );
    expect(patchSpy).toHaveBeenCalledWith("/notifications/8/read");
  });
});

describe("Vibe posts", () => {
  it("shows legacy posts without a saved vibe as unspecified", async () => {
    vi.spyOn(axiosApi, "get").mockResolvedValue({
      data: {
        success: true,
        hasMore: false,
        data: [
          {
            id: 31,
            userId: 5,
            media: null,
            caption: "An older text post",
            vibeType: null,
            username: "someone",
            isPrivate: false,
            likeCount: 0,
          },
        ],
      },
    });

    renderHome();

    expect(await screen.findByText("Unspecified")).toBeInTheDocument();
    expect(screen.getByText("An older text post")).toBeInTheDocument();
  });

  it("submits a public text-only post with its selected vibe", async () => {
    const postSpy = vi.spyOn(axiosApi, "post").mockResolvedValue({
      data: { success: true, postId: 42 },
    });

    renderCreatePage();

    const submitButton = screen.getByRole("button", { name: "Share Post" });
    expect(submitButton).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Vibin’/ }));
    fireEvent.change(screen.getByLabelText("Caption"), {
      target: { value: "A text-only vibe" },
    });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(postSpy).toHaveBeenCalled());
    const formData = postSpy.mock.calls[0][1] as FormData;
    expect(formData.get("vibe")).toBe("Vibin’");
    expect(formData.get("caption")).toBe("A text-only vibe");
    expect(formData.get("image")).toBeNull();
    expect(formData.get("isPrivate")).toBeNull();
  });

  it("shows the selected vibe and text-only content on the post page", async () => {
    vi.spyOn(axiosApi, "get").mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 55,
          userId: 7,
          media: null,
          caption: "A detailed text-only post",
          location: null,
          vibeType: "High up there",
          profileImage: null,
          isPrivate: false,
          username: "someone",
          createdAt: "2026-11-17T00:00:00.000Z",
          likeCount: 0,
          isLikedByUser: false,
        },
      },
    });
    const store = configureStore({
      reducer: {
        user: (state = { user: { id: "5" } }) => state,
        post: postReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/55"]}>
          <Routes>
            <Route path="/post/:postId" element={<PostPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("🫨 High up there")).toBeInTheDocument();
    expect(screen.getByText("A detailed text-only post")).toBeInTheDocument();
  });
});
