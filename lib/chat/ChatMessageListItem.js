import { AvatarUtil, DateUtil, el } from "@common-module/app";
import SocialComponent from "../SocialComponent.js";
import ChatMessageDisplay from "./ChatMessageDisplay.js";
export default class ChatMessageListItem extends SocialComponent {
    messages;
    options;
    interactions;
    firstMessage;
    main;
    constructor(messages, options, interactions) {
        super(".chat-message-list-item");
        this.messages = messages;
        this.options = options;
        this.interactions = interactions;
        this.addAllowedEvents("imageLoaded");
        this.firstMessage = messages[0];
        if (this.firstMessage) {
            const authorAvatar = el(".author-avatar", {
                click: (event) => this.goAuthorProfile(event),
            });
            AvatarUtil.selectLoadable(authorAvatar, [
                this.firstMessage.author?.avatar_thumb,
                this.firstMessage.author?.stored_avatar_thumb,
                this.firstMessage.external_author_avatar,
            ]);
            const authorInfoDisplay = el(".author", el(".name", this.firstMessage.author
                ? this.firstMessage.author.display_name
                : this.firstMessage.external_author_name, {
                click: (event) => this.goAuthorProfile(event),
            }), this.firstMessage.source
                ? interactions.getSourceLabel(this.firstMessage.source)
                : undefined);
            const dateDisplay = el(".date", DateUtil.fromNow(this.firstMessage.created_at));
            const messageDisplays = messages.map((message) => this.createDisplay(message));
            if (this.firstMessage.author &&
                this.firstMessage.author.user_id === options.signedUserId) {
                this.append(this.main = el("main", el("header", dateDisplay, authorInfoDisplay), ...messageDisplays), authorAvatar).addClass("authored");
            }
            else {
                this.append(authorAvatar, this.main = el("main", el("header", authorInfoDisplay, dateDisplay), ...messageDisplays));
            }
        }
    }
    goAuthorProfile(event) {
        event.stopPropagation();
        const message = this.messages[0];
        if (message?.author)
            this.interactions.openAuthorProfile(message.author);
    }
    createDisplay(message) {
        const display = new ChatMessageDisplay(message, {
            owner: this.options.signedUserId !== undefined &&
                message.author !== undefined &&
                message.author.user_id === this.options.signedUserId,
        }, this.interactions);
        display.on("imageLoaded", (imageHeight) => this.fireEvent("imageLoaded", imageHeight));
        return display;
    }
    addMessage(message, wait) {
        if (this.main) {
            const display = this.createDisplay(message).appendTo(this.main);
            display.addClass("new");
            if (wait)
                display.addClass("wait");
        }
    }
}
//# sourceMappingURL=ChatMessageListItem.js.map