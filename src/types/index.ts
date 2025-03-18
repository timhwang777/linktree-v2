// Types for the link tree data from TOML
export interface Profile {
  name: string;
  avatar: string;
  description: string;
  tagline: string;
}

export interface Link {
  title: string;
  url: string;
  icon: string;
}

export interface ThemeConfig {
  useBackgroundImage: boolean;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number; // 0-1 value for overlay opacity
  backgroundBlur?: number; // px value for backdrop blur
}

export interface LinkTreeData {
  profile: Profile;
  links: Link[];
  theme?: ThemeConfig;
} 