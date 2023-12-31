import { DomChild } from "@common-module/app/lib/dom/DomNode.js";
import Author from "../database-interface/Author.js";
export default interface ChatMessageInteractions<S> {
    openAuthorProfile: (author: Author) => void;
    getSourceLabel: (source: S) => DomChild;
}
//# sourceMappingURL=ChatMessageInteractions.d.ts.map