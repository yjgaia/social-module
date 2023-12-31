interface UserPublicMetadata {
}
export default interface UserPublic {
    user_id: string;
    wallet_address?: string;
    total_earned_trading_fees: string;
    display_name?: string;
    profile_image?: string;
    x_username?: string;
    metadata?: UserPublicMetadata;
    follower_count: number;
    following_count: number;
    blocked: boolean;
    created_at: string;
    updated_at?: string;
}
export declare const UserDetailsSelectQuery = "*, total_earned_trading_fees::text";
export declare const isEqualUserDetails: (a: UserPublic, b: UserPublic) => boolean;
export {};
//# sourceMappingURL=UserDetails.d.ts.map