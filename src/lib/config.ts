import { parse } from '@ltd/j-toml';
import { LinkTreeData } from '@/types';

// Load the links configuration from the TOML file
export async function loadLinkTreeConfig(): Promise<LinkTreeData> {
  try {
    const response = await fetch('/config/links.toml');
    const tomlText = await response.text();
    const parsedData = parse(tomlText, { joiner: '\n' });
    return parsedData as unknown as LinkTreeData;
  } catch (error) {
    console.error('Failed to load link tree configuration:', error);
    // Return a default configuration in case of error
    return {
      profile: {
        name: 'User',
        avatar: '/vite.svg',
        description: 'Configuration could not be loaded',
        tagline: 'Please check your TOML file',
      },
      links: [],
    };
  }
}
