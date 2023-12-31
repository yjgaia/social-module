import { I18NText, Rich } from "common-app-module";
import Author from "./Author.js";
export default interface Message {
    id: number;
    author?: Author;
    message?: string;
    translated?: I18NText;
    rich?: Rich;
    created_at: string;
    updated_at?: string;
}
export declare const MessageSelectQuery = "*, author(user_id, display_name, profile_image, profile_image_thumbnail, x_username)";
//# sourceMappingURL=Message%20copy.d.ts.map