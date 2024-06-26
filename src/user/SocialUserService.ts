import { UserService } from "@common-module/app";
import SocialUserPublic from "../database-interface/SocialUserPublic.js";

export default abstract class SocialUserService<T extends SocialUserPublic>
  extends UserService<T> {
  public async fetchByXUsername(xUsername: string): Promise<T | undefined> {
    return await this.safeSelectSingle((b) => b.ilike("x_username", xUsername));
  }
}
