import { PostSelectQuery } from "../database-interface/Post.js";
import PostList from "../post/PostList.js";
import PostService from "../post/PostService.js";
class TestPostService extends PostService {
    constructor() {
        super("test_posts", "test_reposts", "test_post_likes", PostSelectQuery, 50);
    }
    checkSigned() {
        throw new Error("Method not implemented.");
    }
}
class TestPostInteractions {
    openPostView(post) {
        throw new Error("Method not implemented.");
    }
    openAuthorProfile(author) {
        throw new Error("Method not implemented.");
    }
    openOwnerMenu(postId, rect) {
        throw new Error("Method not implemented.");
    }
    openCommentPopup(post) {
        throw new Error("Method not implemented.");
    }
    displayTarget(post) {
        throw new Error("Method not implemented.");
    }
}
export default class TestPostList extends PostList {
    constructor() {
        super(".test-post-list", new TestPostService(), {
            storeName: "global-posts",
            emptyMessage: "No posts yet. Be the first to post!",
        }, new TestPostInteractions(), "Loading...");
        this.activate();
    }
    async fetchPosts() {
        return {
            fetchedPosts: [{
                    posts: [{
                            id: 0,
                            author: {
                                user_id: "test",
                                display_name: "test",
                                x_username: "test",
                                avatar_thumb: "",
                            },
                            message: "Another big quality update:\n\nWe’ve enhanced the open source scoring algorithm’s ability to spot potentially inaccurate or unsupported notes. How it works: The algorithm identifies notes that people from a wide range of viewpoints agree have potential issues with accuracy or source support. It then identifies raters who consistently and precisely spot such notes, and assigns them extra weight, enabling faster and more precise identification of notes with these issues.\n\nRaters are effectively given more weight for being diligent about vetting details of notes and following the cited sources to verify. Quick ratings that miss errors in notes, or that excessively rate notes as erroneous, lead to reduced weight. The more diligent you are as a rater, the more impact you can have.\n\nThe precision of this new approach not only results in additional helpful and informative notes being displayed on X, it also identifies more notes that people from different points of view agree have possible accuracy or source support problems.",
                            rich: {
                                files: [{
                                        fileName: "test.svg",
                                        fileType: "image/svg+xml",
                                        url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg",
                                        fileSize: 0,
                                    }],
                            },
                            created_at: new Date().toISOString(),
                            comment_count: 0,
                            repost_count: 0,
                            like_count: 0,
                        }],
                    mainPostId: 0,
                }],
            repostedPostIds: [],
            likedPostIds: [],
        };
    }
}
//# sourceMappingURL=TestPostList.js.map