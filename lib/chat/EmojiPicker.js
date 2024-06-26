import { Picker } from "emoji-picker-element";
import SocialComponent from "../SocialComponent.js";
export default class EmojiPicker extends SocialComponent {
    showing = false;
    picker = new Picker();
    constructor() {
        super(".emoji-picker");
        this.addAllowedEvents("select");
        this.picker.addEventListener("emoji-click", this.emojiClick);
        this.domElement.appendChild(this.picker);
    }
    emojiClick = (event) => {
        this.emit("select", event.detail.unicode);
    };
    _hide = (event) => {
        if (!this.domElement.contains(event.target)) {
            this.hide();
        }
    };
    show(left, top) {
        const rect = this.rect;
        if (left < 8)
            left = 8;
        else if (left + rect.width > window.innerWidth - 8) {
            left = window.innerWidth - rect.width - 8;
        }
        if (top < 8)
            top = 8;
        else if (top + rect.height > window.innerHeight - 8) {
            top = window.innerHeight - rect.height - 8;
        }
        this.showing = true;
        this.style({ left, top });
        setTimeout(() => this.onWindow("click", this._hide));
    }
    hide() {
        this.showing = false;
        this.style({ left: -999999, top: -999999 });
        this.offWindow("click", this._hide);
    }
    delete() {
        this.picker.removeEventListener("emoji-click", this.emojiClick);
        this.domElement.removeChild(this.picker);
        super.delete();
    }
}
//# sourceMappingURL=EmojiPicker.js.map