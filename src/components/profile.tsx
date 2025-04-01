import { Profile as ProfileType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileProps {
  profile: ProfileType;
}

export function Profile({ profile }: ProfileProps) {
  const { name, avatar, description, tagline } = profile;

  // Create initials from name for avatar fallback
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Avatar className="h-32 w-32 border-4 border-border mb-4">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <h1 className="text-4xl font-bold mb-1">{name}</h1>
      <p className="text-muted-foreground mb-2">{description}</p>
      <p className="max-w-lg text-sm">{tagline}</p>
    </div>
  );
}
