// Profile avatars: the 18 animal stamps of the Figma file "Stamped Animals" (Typedreams),
// in the file's order. The ids must match the allowed values in
// supabase/migrations/20261027120000_profile_avatar.sql (DESIGN.md §5.8).
const images = import.meta.glob<string>('../assets/avatars/*.webp', { eager: true, import: 'default' });

export const AVATAR_IDS = [
  'bear',
  'fox',
  'deer',
  'hare',
  'heron',
  'songbird',
  'peacock',
  'fish',
  'crow',
  'jellyfish',
  'turtle',
  'tiger',
  'whale',
  'wolf',
  'octopus',
  'elephant',
  'anteater',
  'hedgehog',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

/** Image address of an avatar, or undefined for an unknown id. */
export const avatarSrc = (id: string | null | undefined) =>
  id ? images[`../assets/avatars/${id}.webp`] : undefined;
