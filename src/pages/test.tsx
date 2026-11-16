import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "pages/Home";
import ProfilePage from "pages/ProfilePage";
import axiosApi from "utils/axiosconfig";
import followReducer from "redux/reducers/followReducer";
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
  });
});
