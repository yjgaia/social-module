import SocialComponent from "../SocialComponent.js";
import Post from "../database-interface/Post.js";
import PostInteractions from "./PostInteractions.js";
import PostService from "./PostService.js";
export default class PostListItem<T extends Post> extends SocialComponent {
    constructor(posts: T[], postService: PostService<T>, options: {
        mainPostId: number;
        repostedPostIds: number[];
        likedPostIds: number[];
        newPostIds: number[];
        signedUserId?: string;
    }, interactions: PostInteractions<T>);
}
//# sourceMappingURL=PostListItem.d.ts.map