import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

interface FooterProps {
  name?: string;
  className?: string;
}

export function Footer({ name, className }: FooterProps) {
  return (
    <footer className={cn('w-full pb-4', className)}>
      <Separator className="mb-4" />
      <div className="flex flex-col items-center justify-center gap-4 py-2 text-center prose prose-sm dark:prose-invert">
        <p className="text-muted-foreground">
          <span className="font-display font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            © {new Date().getFullYear()} {name}
          </span>
          <span className="opacity-75">. All rights reserved.</span>
          <br />
          <span className="opacity-75">Open source on </span>
          <a
            href="https://github.com/timhwang777"
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={14} className="inline-block" />
            <span className="font-display">GitHub</span>
          </a>
        </p>
        <div className="flex items-center gap-4">
          {/* Optional: Add social links or other footer content here */}
        </div>
      </div>
    </footer>
  );
}
