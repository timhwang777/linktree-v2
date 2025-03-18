import { useEffect, useState } from 'react';
import { LinkTreeData, ThemeConfig } from './types';
import { loadLinkTreeConfig } from './lib/config';
import { ThemeToggle } from './components/theme-toggle';
import { Profile } from './components/profile';
import { LinkGrid } from './components/link-grid';
import { Footer } from './components/footer';

// Background component to handle theme-aware background image effects
const ThemeBackground = ({ theme }: { theme: ThemeConfig }) => {
  const { useBackgroundImage, backgroundImage, backgroundOverlayOpacity, backgroundBlur } = theme || {};
  
  // Early return if background image is disabled
  if (!useBackgroundImage) return null;
  
  // Set CSS variables for the background image and add body class
  useEffect(() => {
    if (useBackgroundImage && backgroundImage) {
      // Preload the image
      const img = new Image();
      img.src = backgroundImage;
      
      img.onload = () => {
        document.documentElement.style.setProperty('--bg-image', `url(${backgroundImage})`);
        document.documentElement.style.setProperty('--bg-image-opacity', backgroundOverlayOpacity?.toString() || '0.2');
        document.documentElement.style.setProperty('--bg-image-blur', `${backgroundBlur || 3}px`);
        document.body.classList.add('with-bg-image');
      };
    }
    
    return () => {
      document.body.classList.remove('with-bg-image');
    };
  }, [useBackgroundImage, backgroundImage, backgroundOverlayOpacity, backgroundBlur]);
  
  return (
    <div className="bg-image-container">
      <div className="bg-image"></div>
      <div className="bg-overlay"></div>
    </div>
  );
};

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center prose prose-lg dark:prose-invert">
        <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Loading...
        </h1>
        <p className="text-muted-foreground animate-pulse">
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full p-6 rounded-lg border border-destructive/20 bg-card shadow-lg prose prose-lg dark:prose-invert">
        <h2 className="font-display text-2xl font-bold text-destructive mb-4">
          Error
        </h2>
        <p className="text-muted-foreground">
          {error}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState<LinkTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update document title when data is loaded
  useEffect(() => {
    if (data?.profile?.name) {
      document.title = `${data.profile.name} | LinkTree`;
    }
  }, [data?.profile?.name]);

  useEffect(() => {
    async function fetchData() {
      try {
        const config = await loadLinkTreeConfig();
        setData(config);
      } catch (err) {
        setError('Failed to load link tree data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground">
      {/* Theme-aware background */}
      {data?.theme && <ThemeBackground theme={data.theme} />}
      
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center w-full">
        <main className="w-full max-w-md px-4 space-y-8 my-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : data ? (
            <>
              <Profile profile={data.profile} />
              <LinkGrid links={data.links} itemsPerPage={5} />
            </>
          ) : null}
        </main>
      </div>
      
      {/* Footer component */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <Footer name={data?.profile?.name}/>
        </div>
      </div>
    </div>
  );
}

export default App;