import { DomNode, msg } from "@common-module/app";
import Post from "../database-interface/Post.js";
import PostInteractions from "./PostInteractions.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class GlobalPostList<T extends Post> extends PostList<T> {
  constructor(
    postService: PostService<T>,
    options: {
      signedUserId?: string;
      wait?: boolean;
    },
    interactions: PostInteractions<T>,
    initialLoadingAnimation: DomNode,
  ) {
    super(
      ".global-post-list",
      postService,
      {
        storeName: "global-posts",
        emptyMessage: msg("global-post-list-empty-message"),
        ...options,
      },
      interactions,
      initialLoadingAnimation,
    );

    this.onDelegate(
      postService,
      "newGlobalPost",
      (post: T) => this.addNewPost(post),
    );
  }

  protected async fetchPosts(): Promise<{
    fetchedPosts: { posts: T[]; mainPostId: number }[];
    repostedPostIds: number[];
    likedPostIds: number[];
  }> {
    const result = await this.postService.fetchGlobalPosts(
      this.lastPostId,
      this.options.signedUserId,
    );
    return {
      fetchedPosts: result.posts.map((p) => ({
        posts: [p],
        mainPostId: p.id,
      })),
      repostedPostIds: result.repostedPostIds,
      likedPostIds: result.likedPostIds,
    };
  }
}
