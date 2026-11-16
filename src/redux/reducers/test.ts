import { describe, expect, it } from "vitest";
import {
  acceptFollowRequest,
  getPendingRequests,
  RejectFollowRequest,
} from "redux/actions/FollowActions";
import followReducer from "redux/reducers/followReducer";

describe("pending follow request state", () => {
  it("recovers from persisted state created before pending requests existed", () => {
    const oldState = followReducer(undefined, { type: "init" });
    Reflect.deleteProperty(oldState, "pendingRequests");

    const acceptedState = followReducer(
      oldState,
      acceptFollowRequest.fulfilled({ success: true }, "accept", "12"),
    );
    expect(acceptedState.pendingRequests).toEqual([]);

    const refreshedState = followReducer(
      acceptedState,
      getPendingRequests.fulfilled(
        {
          data: [
            {
              followerId: 12,
              followerUsername: "first",
              followerProfileImage: null,
            },
          ],
        },
        "fetch",
        undefined,
      ),
    );
    expect(refreshedState.pendingRequests).toHaveLength(1);
  });

  it("keeps the fetched requests and removes accepted or rejected requests", () => {
    const requests = [
      {
        followerId: 12,
        followerUsername: "first",
        followerProfileImage: null,
      },
      {
        followerId: 23,
        followerUsername: "second",
        followerProfileImage: "avatar.png",
      },
    ];

    const loadedState = followReducer(
      undefined,
      getPendingRequests.fulfilled({ data: requests }, "fetch", undefined),
    );
    expect(loadedState.pendingRequests).toEqual(requests);

    const acceptedState = followReducer(
      loadedState,
      acceptFollowRequest.fulfilled(
        { success: true },
        "accept",
        String(requests[0].followerId),
      ),
    );
    expect(acceptedState.pendingRequests).toEqual([requests[1]]);

    const rejectedState = followReducer(
      acceptedState,
      RejectFollowRequest.fulfilled(
        { success: true },
        "reject",
        String(requests[1].followerId),
      ),
    );
    expect(rejectedState.pendingRequests).toEqual([]);
  });
});
