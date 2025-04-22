# linktree-v2

This project is a customizable, self-hosted Linktree alternative built using modern web technologies. It allows users to display a profile and a list of links configured via a simple TOML file.

## Features

*   **Configurable Profile:** Display your name, avatar, description, and tagline.
*   **Link Grid:** Showcase multiple links with titles.
*   **Theming:** Supports light/dark mode toggle.
*   **Custom Background:** Set a custom background image with configurable overlay opacity and blur (via TOML).
*   **TOML Configuration:** Easily manage profile details and links by editing a single `links.toml` file.
*   **Responsive Design:** Adapts to different screen sizes.

## Technologies Used

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Likely based on Shadcn/ui (using Radix UI, Lucide React, clsx, tailwind-merge, tailwindcss-animate)
*   **Package Manager:** npm (or yarn/pnpm)

## Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or yarn/pnpm

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd linktree-v2
    ```
    *(Replace `<your-repository-url>` with the actual URL of your repository)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Or `yarn install` or `pnpm install` if you prefer those package managers)*

## Available Scripts

In the project directory, you can run:

*   **`npm run dev`**
    Runs the app in development mode.
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.
    The page will reload if you make edits.

*   **`npm run build`**
    Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

*   **`npm run preview`**
    Serves the production build locally. Run this command after building the project with `npm run build`.

*   **`npm run lint`**
    Lints the codebase using ESLint to find and fix problems in your JavaScript/TypeScript code.

*   **`npm run format`**
    Formats the codebase using Prettier.

## Configuration

The content of your link page (profile details, links, theme settings) is controlled by the `public/config/links.toml` file.

Edit this file to customize your page. The structure likely involves sections for `[profile]`, `[theme]`, and an array of `[[links]]` tables. Refer to the TOML syntax documentation if needed.
