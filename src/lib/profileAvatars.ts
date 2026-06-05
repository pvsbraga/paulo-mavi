import mavi from "@/assets/profiles/mavi.jpg.asset.json";
import paulo from "@/assets/profiles/paulo.jpg.asset.json";

export const profileAvatars = {
  mavi: mavi.url,
  paulo: paulo.url,
} as const;

export type ProfileUser = keyof typeof profileAvatars;
