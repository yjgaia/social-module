import { Activatable, Store } from "@common-module/app";
import { DomChild } from "@common-module/app/lib/dom/DomNode.js";
import SocialComponent from "../SocialComponent.js";
import Post from "../database-interface/Post.js";
import PostInteractions from "./PostInteractions.js";
import PostListItem from "./PostListItem.js";
import PostService from "./PostService.js";

export default abstract class PostList<T extends Post> extends SocialComponent
  implements Activatable {
  private store: Store | undefined;
  private refreshed = false;
  protected lastPostId: number | undefined;

  constructor(
    tag: string,
    protected postService: PostService<T>,
    protected options: {
      storeName?: string;
      signedUserId?: string;
      emptyMessage: string;
    },
    private interactions: PostInteractions<T>,
    initialLoadingAnimation: DomChild,
  ) {
    super(tag + ".post-list");
    this.store = options.storeName ? new Store(options.storeName) : undefined;
    this.domElement.setAttribute("data-empty-message", options.emptyMessage);

    if (this.store) {
      const cachedPosts = this.store.get<{
        posts: T[];
        mainPostId: number;
      }[]>("cached-posts");
      const cachedRepostedPostIds =
        this.store.get<number[]>("cached-reposted-post-ids") ?? [];
      const cachedLikedPostIds =
        this.store.get<number[]>("cached-liked-post-ids") ?? [];

      if (cachedPosts && cachedPosts.length > 0) {
        for (const p of cachedPosts) {
          this.addPostItem(p.posts, {
            mainPostId: p.mainPostId,
            repostedPostIds: cachedRepostedPostIds,
            likedPostIds: cachedLikedPostIds,
            newPostIds: [],
            signedUserId: options.signedUserId,
          }, interactions);
        }
      } else {
        this.append(initialLoadingAnimation);
      }
    } else {
      this.append(initialLoadingAnimation);
    }
  }

  protected abstract fetchPosts(): Promise<{
    fetchedPosts: { posts: T[]; mainPostId: number }[];
    repostedPostIds: number[];
    likedPostIds: number[];
  }>;

  private addPostItem(
    posts: T[],
    options: {
      mainPostId: number;
      repostedPostIds: number[];
      likedPostIds: number[];
      newPostIds: number[];
      signedUserId?: string;
    },
    interactions: PostInteractions<T>,
  ) {
    const item = new PostListItem(
      posts,
      this.postService,
      options,
      interactions,
    )
      .appendTo(
        this,
        0,
      );
    ["like", "unlike", "repost", "unrepost"].forEach((event) =>
      item.on(event, (postId) => {
        if (this.store) {
          const cachedPosts = this.store.get<{
            posts: T[];
            mainPostId: number;
          }[]>("cached-posts") ?? [];
          const cachedRepostedPostIds =
            this.store.get<number[]>("cached-reposted-post-ids") ?? [];
          const cachedLikedPostIds =
            this.store.get<number[]>("cached-liked-post-ids") ?? [];

          // Update the relevant post's data based on the event type
          cachedPosts.forEach((cachedPostGroup) => {
            cachedPostGroup.posts.forEach((post) => {
              if (post.id === postId) {
                switch (event) {
                  case "like":
                    post.like_count++;
                    cachedLikedPostIds.push(postId);
                    break;
                  case "unlike":
                    post.like_count--;
                    const likeIndex = cachedLikedPostIds.indexOf(postId);
                    if (likeIndex > -1) cachedLikedPostIds.splice(likeIndex, 1);
                    break;
                  case "repost":
                    post.repost_count++;
                    cachedRepostedPostIds.push(postId);
                    break;
                  case "unrepost":
                    post.repost_count--;
                    const repostIndex = cachedRepostedPostIds.indexOf(postId);
                    if (repostIndex > -1) {
                      cachedRepostedPostIds.splice(repostIndex, 1);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
          });

          // Update the store with the new data
          this.store.set("cached-posts", cachedPosts, true);
          this.store.set(
            "cached-reposted-post-ids",
            cachedRepostedPostIds,
            true,
          );
          this.store.set("cached-liked-post-ids", cachedLikedPostIds, true);
        }
      })
    );
  }

  protected async refresh() {
    this.addClass("loading");

    const cachedPosts = this.store?.get<{
      posts: T[];
      mainPostId: number;
    }[]>("cached-posts") ?? [];

    const {
      fetchedPosts,
      repostedPostIds,
      likedPostIds,
    } = await this.fetchPosts();

    const posts = fetchedPosts.reverse();
    if (this.store) {
      this.store.set("cached-posts", posts, true);
      this.store.set("cached-reposted-post-ids", repostedPostIds, true);
      this.store.set("cached-liked-post-ids", likedPostIds, true);
    }

    if (!this.deleted) {
      const cachedPostIds = new Set(cachedPosts.map((p) => p.mainPostId));
      const newPostIds = posts
        .filter((p) => !cachedPostIds.has(p.mainPostId))
        .map((p) => p.mainPostId);

      this.deleteClass("loading");
      for (const p of posts) {
        this.addPostItem(p.posts, {
          mainPostId: p.mainPostId,
          repostedPostIds,
          likedPostIds,
          newPostIds,
          signedUserId: this.options.signedUserId,
        }, this.interactions);
      }

      this.lastPostId = posts[posts.length - 1]?.mainPostId;
      this.refreshed = true;
    }
  }

  protected addNewPost(post: T) {
    const cachedPosts = this.store?.get<{
      posts: T[];
      mainPostId: number;
    }[]>("cached-posts") ?? [];

    cachedPosts.push({ posts: [post], mainPostId: post.id });

    this.store?.set("cached-posts", cachedPosts, true);

    this.addPostItem([post], {
      mainPostId: post.id,
      repostedPostIds: [],
      likedPostIds: [],
      newPostIds: [post.id],
      signedUserId: this.options.signedUserId,
    }, this.interactions);
  }

  private async loadMore() {
    const {
      fetchedPosts,
      repostedPostIds,
      likedPostIds,
    } = await this.fetchPosts();

    if (!this.deleted) {
      const posts = fetchedPosts.reverse();
      const newPostIds = posts.map((p) => p.mainPostId);

      for (const p of posts) {
        this.addPostItem(p.posts, {
          mainPostId: p.mainPostId,
          repostedPostIds,
          likedPostIds,
          newPostIds,
          signedUserId: this.options.signedUserId,
        }, this.interactions);
      }

      this.lastPostId = posts[posts.length - 1]?.mainPostId;
    }
  }

  public activate() {
    this.deleteClass("hidden");
    this.lastPostId = undefined;
    this.refresh();
  }

  public deactivate() {
    this.addClass("hidden");
  }
}
