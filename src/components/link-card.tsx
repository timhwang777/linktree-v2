import { Link } from '@/types';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { Link as LinkIcon } from 'lucide-react';

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const { title, url, icon } = link;

  // Get the icon component or use a default
  let IconComponent: React.ElementType = LinkIcon;

  // Try to get the icon from Lucide
  if (icon in LucideIcons) {
    const LucideIcon = LucideIcons[icon as keyof typeof LucideIcons];
    // Check if it's a valid component
    if (typeof LucideIcon === 'function' || typeof LucideIcon === 'object') {
      IconComponent = LucideIcon as React.ElementType;
    }
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="w-full block no-underline">
      <Button
        variant="outline"
        className="w-full flex items-center justify-start gap-3 py-6 px-4 transition-all hover:scale-[1.02] text-left"
      >
        <IconComponent className="h-5 w-5 flex-shrink-0" />
        <span>{title}</span>
      </Button>
    </a>
  );
}
