import Post from "../database-interface/Post.js";
import SocialComponent from "../SocialComponent.js";
import PostInteractions from "./PostInteractions.js";
import PostService from "./PostService.js";
export default class PostDisplay<T extends Post> extends SocialComponent {
    post: T;
    private postService;
    private interactions;
    private reposted;
    private liked;
    private repostCountDisplay;
    private likeCountDisplay;
    constructor(post: T, postService: PostService<T>, options: {
        inView?: boolean;
        owner: boolean;
        reposted: boolean;
        liked: boolean;
        new: boolean;
    }, interactions: PostInteractions<T>);
    private goAuthorProfile;
    private openOwnerMenu;
    private openCommentPopup;
    private repost;
    private like;
}
//# sourceMappingURL=PostDisplay.d.ts.map