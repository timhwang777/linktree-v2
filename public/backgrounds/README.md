# Background Image for Link Tree

This folder contains the background image that will be used for your Link Tree application.

## About the Background Image
- `background.jpg` - A single image that will adapt to both light and dark themes

## How It Works
The application applies different visual effects to the same background image depending on the current theme:

- **Light Theme**: The image appears brighter with a light overlay
- **Dark Theme**: The image appears darker with increased contrast and a dark overlay

## Using a Custom Image

1. Replace the default image with your own by using the same filename (`background.jpg`)
2. Or update the path in `public/config/links.toml` in the `[theme]` section:

```toml
[theme]
useBackgroundImage = true
backgroundImage = "/backgrounds/your-custom-image.jpg"
backgroundOverlayOpacity = 0.2  # 0-1 value (0 = transparent, 1 = opaque)
backgroundBlur = 3  # blur in pixels
```

## Recommended Image Specifications

- Resolution: At least 1920x1080px
- Format: JPG or WebP (for better compression)
- Good contrast: Choose an image that works well in both light and dark modes
- Not too busy: Simple images work better with overlaid content
- Optimize for web to keep load times fast

## Disabling Background Image

To disable the background image, set `useBackgroundImage = false` in your config.toml:

```toml
[theme]
useBackgroundImage = false
``` 