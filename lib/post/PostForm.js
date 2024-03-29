import { AvatarUtil, Button, el, ErrorAlert, FileDropArea, MaterialIcon, msg, UploadForm, } from "@common-module/app";
export default class PostForm extends UploadForm {
    input;
    postButton;
    constructor(authorProfileImages, focus = false) {
        super(".post-form.social-component");
        const authorAvatar = el(".author-avatar");
        AvatarUtil.selectLoadable(authorAvatar, authorProfileImages);
        this.append(el("main", authorAvatar, el("form", this.input = new FileDropArea({ tag: "p.message-input", contenteditable: true }, (files) => this.appendFiles(files)), this.uploadPreviewArea = el(".upload-preview-area"))), el("footer", el("section.rich", el("button", new MaterialIcon("image"), {
            click: () => this.openFileSelector(),
        })), this.postButton = new Button({
            tag: ".post",
            title: msg("post-form-post-button"),
            click: () => this._post(this.input.domElement.innerText, this.toUploadFiles),
        })));
        if (focus) {
            this.on("visible", () => this.input.domElement.focus());
        }
    }
    async _post(message, files) {
        if (message.length > 2000) {
            new ErrorAlert({
                title: msg("message-too-long-alert-title"),
                message: msg("message-too-long-alert-message", {
                    maxLength: 2000,
                }),
            });
            return;
        }
        this.postButton.disable().text = msg("post-form-posting-button");
        try {
            await this.post(message, files);
            if (this.deleted)
                return;
            this.input.domElement.innerText = "";
            this.clearUploads();
        }
        catch (error) {
            console.error(error);
        }
        this.postButton.enable().text = msg("post-form-post-button");
    }
}
//# sourceMappingURL=PostForm.js.map