# Chapter 5: Link Grid Component

Welcome back! In [Chapter 4: Profile Component](04_profile_component.md), we created the digital ID card for our page, displaying your name, avatar, and description. Now, it's time to show the main attraction: the list of links that you want to share!

## What's the Big Idea? Your Organized Link Bulletin Board

Imagine you have a bunch of important flyers or notices you want to post on a bulletin board for everyone to see. You wouldn't just randomly scatter them, right? You'd arrange them neatly in a column so people can easily read through them. If you had *lots* of flyers, you might even sort them onto different pages of the board (Page 1, Page 2, etc.) to avoid clutter.

That's exactly what the **Link Grid Component** does for your links!

It takes the list of links you defined in your `public/config/links.toml` file (covered in [Chapter 1: Configuration & Data Model](01_configuration___data_model.md)) and displays them in an organized way, usually as a clean, single column.

**Its main jobs are:**

1.  **Receive Link Data:** It gets the list (array) of links from its parent, the [Application Shell](02_application_shell.md).
2.  **Display Each Link:** For every link in the list, it uses a helper component called `LinkCard` to render it as a nice clickable button with an icon and title.
3.  **Handle Many Links (Pagination):** If you have more links than can comfortably fit on the screen at once (say, more than 5), it automatically adds "Previous" and "Next" page buttons, along with page numbers, so users can navigate through your links without overwhelming scrolling.

## How Do We Use It?

Just like the `Profile` component, the `LinkGrid` component receives its data from the [Application Shell](02_application_shell.md) (`src/App.tsx`). The Shell loads all the configuration, and then passes the `links` array down to the `LinkGrid`.

Think of the Application Shell as the librarian who has the whole list of books (your `links` data). The Link Grid Component is like a specific bookshelf that the librarian hands the relevant list of books to display.

Here's how the Application Shell uses the Link Grid (simplified):

```typescript
// src/App.tsx (Simplified - showing how LinkGrid is used)
import { Profile } from './components/profile';
import { LinkGrid } from './components/link-grid'; // Import the component
import { LinkTreeData } from './types';
// ... other imports and state management (loading, data, error) ...

function App() {
  const [data, setData] = useState<LinkTreeData | null>(null);
  // ... useEffect to load data into the 'data' state ...

  // If data is loaded successfully:
  if (data) {
    return (
      <div className="main-container">
        {/* ... Theme Toggle, Background ... */}
        <main className="content-area max-w-2xl mx-auto px-4 py-8">
          {/* Display the Profile */}
          <Profile profile={data.profile} />

          {/* Spacer */}
          <div className="my-8"></div>

          {/* === HERE IT IS! === */}
          {/* Pass the 'links' part of the data to the LinkGrid component */}
          <LinkGrid links={data.links} />

        </main>
        {/* ... Footer ... */}
      </div>
    );
  }
  // ... handle loading and error states ...
}
```

*   We `import` the `LinkGrid` component.
*   We use `<LinkGrid />` inside the main content area, after the `Profile` component.
*   We pass the list of links using a **prop** called `links`: `links={data.links}`. This sends the array containing all your link objects (each with `title`, `url`, `icon`) from the loaded configuration down into the `LinkGrid` component.

## Key Concepts: Inside the Link Grid

Let's peek inside `src/components/link-grid.tsx` to understand its parts.

### 1. Receiving the Links (Props)

The component needs to know it will receive a list (an array) of link objects.

```typescript
// src/components/link-grid.tsx (Props Definition)
import { Link as LinkType } from "@/types"; // Import the 'Link' blueprint

// Define the expected input: an object with a property 'links'
// which is an array ([]) of objects matching 'LinkType'.
interface LinkGridProps {
  links: LinkType[];
  itemsPerPage?: number; // Optional: How many links per page
}

// The component function receives the props
// We set a default value for itemsPerPage if it's not provided
export function LinkGrid({ links, itemsPerPage = 5 }: LinkGridProps) {
  // Now we can use the 'links' array and 'itemsPerPage' number
  // ... rest of the component ...
}
```

*   **`LinkType[]`**: This tells TypeScript we expect an array of objects, where each object follows the `Link` structure defined in `src/types/index.ts`.
*   **`itemsPerPage?`**: The `?` means this prop is optional. If the parent component doesn't provide it, we'll use a default value (here, `5`).
*   **`{ links, itemsPerPage = 5 }: LinkGridProps`**: This pulls the `links` array and the `itemsPerPage` number out of the props object. If `itemsPerPage` wasn't sent, it defaults to `5`.

### 2. Using `LinkCard` for Each Link

The `LinkGrid` doesn't render the buttons itself. It delegates that job to the `LinkCard` component for each link it needs to display on the *current page*.

```typescript
// src/components/link-card.tsx (Simplified Concept)
import { Link as LinkType } from "@/types";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react"; // Icon library

interface LinkCardProps { link: LinkType; }

export function LinkCard({ link }: LinkCardProps) {
  // ... logic to find the right icon based on link.icon ...
  const IconComponent = LucideIcons[link.icon] || LucideIcons.Link;

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" className="w-full flex items-center justify-start gap-3">
        <IconComponent /> {/* Display the icon */}
        <span>{link.title}</span> {/* Display the title */}
      </Button>
    </a>
  );
}
```

The `LinkCard` (located in `src/components/link-card.tsx`) is responsible for:
*   Taking a single `link` object as a prop.
*   Rendering an `<a>` tag to make it a clickable link opening in a new tab (`target="_blank"`).
*   Displaying a styled `Button` (from our UI primitives, see [Chapter 6: UI Primitives (shadcn/ui style)](06_ui_primitives__shadcn_ui_style_.md)).
*   Finding and showing the correct icon (using the `lucide-react` library) based on the `icon` string in the link data.
*   Showing the `title` of the link.

The `LinkGrid` will create one `LinkCard` for each link that belongs on the current page.

### 3. Pagination (Handling Many Links)

This is where the magic happens if you have lots of links. The `LinkGrid` calculates how many pages are needed and only displays the links for the current page. It uses a popular library called `react-paginate` to show the page navigation buttons.

```typescript
// src/components/link-grid.tsx (Pagination Logic)
import { useState } from "react"; // React's tool for remembering state
import ReactPaginate from "react-paginate"; // The pagination library
import { LinkCard } from "@/components/link-card";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for buttons

// ... (interface LinkGridProps and component start as before) ...

export function LinkGrid({ links, itemsPerPage = 5 }: LinkGridProps) {
  // 1. Remember which page we are currently on (starts at page 0)
  const [currentPage, setCurrentPage] = useState(0);

  // 2. Calculate total number of pages needed
  const pageCount = Math.ceil(links.length / itemsPerPage); // e.g., 12 links / 5 per page = 2.4 -> 3 pages

  // 3. Figure out which links to show for the 'currentPage'
  const offset = currentPage * itemsPerPage; // e.g., page 1 (index 1) -> offset = 1 * 5 = 5
  // Get a 'slice' of the full links array
  const currentItems = links.slice(offset, offset + itemsPerPage); // e.g., slice(5, 10) -> gets links 6 through 10

  // 4. Function to handle when the user clicks a page number
  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected); // Update the remembered current page
    // Optional: Scroll back to the top of the grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-8"> {/* Container for grid + pagination */}
      {/* The grid displaying only the 'currentItems' */}
      <div id="link-grid" className="grid grid-cols-1 gap-3">
        {currentItems.map((link, index) => (
          <LinkCard key={`${link.title}-${index}`} link={link} />
        ))}
      </div>

      {/* Only show pagination if there's more than one page */}
      {pageCount > 1 && (
        <ReactPaginate
          // Props to configure the pagination buttons
          previousLabel={<ChevronLeft />} // Icon for 'Prev'
          nextLabel={<ChevronRight />}    // Icon for 'Next'
          pageCount={pageCount}          // Total pages
          onPageChange={handlePageChange} // Function to call on click
          // ... other props for styling (simplified here)
          containerClassName="flex justify-center items-center gap-1" // Basic layout
          // ... styles for page numbers, active page, prev/next buttons ...
        />
      )}
    </div>
  );
}
```

*   **`useState(0)`**: We tell React to remember a piece of information called `currentPage`. It starts at `0` (programmers often count from zero!). `setCurrentPage` is the function we use to update this remembered value.
*   **`pageCount`**: Simple math: divide the total number of links by how many we show per page. `Math.ceil` rounds *up* to make sure we have enough pages for all links.
*   **`offset`**: Calculates the starting index in the `links` array for the current page.
*   **`links.slice(start, end)`**: This is a standard JavaScript array method. It extracts a portion of the array, from the `start` index up to (but not including) the `end` index. This gives us just the `Link` objects for the current page.
*   **`currentItems.map(...)`**: This is how we create a `LinkCard` for each link in the `currentItems` array. React efficiently updates this part when `currentItems` changes.
*   **`handlePageChange`**: This function receives the index of the page the user clicked (from `ReactPaginate`). It calls `setCurrentPage` to update the state, which causes React to re-render the component with the new `currentPage`, recalculating `offset` and `currentItems`, and thus showing the links for the newly selected page.
*   **`<ReactPaginate ... />`**: This component from the library takes care of rendering the actual page numbers, "...", "Previous", and "Next" buttons. We provide it with necessary information like the total `pageCount` and the `handlePageChange` function. We only render it if `pageCount` is greater than 1.

## How It Works Under the Hood

Let's imagine you have 7 links and `itemsPerPage` is 5. You load the page and then click "Next" (page 2).

```mermaid
sequenceDiagram
    participant User
    participant AppShell as App Shell (App.tsx)
    participant LinkGridComp as Link Grid Component
    participant React
    participant LinkCardComp as LinkCard Component
    participant PaginateLib as ReactPaginate Library

    AppShell->>+LinkGridComp: Render <LinkGrid links={[7 links]} itemsPerPage={5} />
    LinkGridComp->>React: Initialize state: currentPage = 0
    LinkGridComp->>LinkGridComp: Calculate pageCount = ceil(7/5) = 2
    LinkGridComp->>LinkGridComp: Calculate offset = 0 * 5 = 0
    LinkGridComp->>LinkGridComp: Get currentItems = links.slice(0, 5) (Links 1-5)
    LinkGridComp->>React: Render UI
    loop For Each Link in currentItems (1-5)
        LinkGridComp->>+LinkCardComp: Render <LinkCard link={link} />
        LinkCardComp-->>-LinkGridComp: Return Link Card UI
    end
    LinkGridComp->>+PaginateLib: Render <ReactPaginate pageCount=2 ... />
    PaginateLib-->>-LinkGridComp: Return Pagination UI (Page 1, Page 2, Next)
    LinkGridComp-->>-AppShell: Return full LinkGrid UI
    AppShell->>User: Display Page 1 of links

    User->>+PaginateLib: Clicks "Next" or "Page 2" button
    PaginateLib->>LinkGridComp: Call onPageChange({ selected: 1 })
    LinkGridComp->>React: Call setCurrentPage(1) -> Trigger Re-render
    React->>LinkGridComp: Re-render with new state: currentPage = 1
    LinkGridComp->>LinkGridComp: Calculate offset = 1 * 5 = 5
    LinkGridComp->>LinkGridComp: Get currentItems = links.slice(5, 10) (Links 6-7)
    LinkGridComp->>React: Render updated UI
    loop For Each Link in currentItems (6-7)
        LinkGridComp->>+LinkCardComp: Render <LinkCard link={link} />
        LinkCardComp-->>-LinkGridComp: Return Link Card UI
    end
    LinkGridComp->>+PaginateLib: Render <ReactPaginate pageCount=2 ... /> (Page 2 is active)
    PaginateLib-->>-LinkGridComp: Return Pagination UI (Prev, Page 1, Page 2)
    LinkGridComp-->>-AppShell: Return updated LinkGrid UI
    AppShell->>User: Display Page 2 of links
```

1.  **Initial Load:** The `LinkGrid` gets the 7 links. It calculates `pageCount` (2) and initial `currentItems` (links 1-5). It renders 5 `LinkCard` components and the pagination controls (showing Page 1 active).
2.  **User Clicks Page 2:** The user clicks the "Next" or "Page 2" button rendered by `ReactPaginate`.
3.  **Callback:** `ReactPaginate` calls the `handlePageChange` function provided by `LinkGrid`, passing the new page index (1).
4.  **State Update:** `handlePageChange` calls `setCurrentPage(1)`. This tells React the state has changed.
5.  **Re-render:** React re-runs the `LinkGrid` function body.
6.  **Recalculate:** `currentPage` is now 1. The component recalculates the `offset` (5) and `currentItems` (links 6-7 using `slice(5, 7)`).
7.  **Render Update:** React efficiently updates the display. The old `LinkCard`s (1-5) are removed, and new `LinkCard`s for links 6-7 are rendered. The `ReactPaginate` component is also re-rendered, now showing Page 2 as active.

## Conclusion

Fantastic! You've now learned how the `LinkGrid` component acts as the organized bulletin board for your links:

*   It receives the full list of `links` via **props** from the [Application Shell](02_application_shell.md).
*   It uses the `LinkCard` component to display each individual link neatly.
*   It uses `useState` to keep track of the `currentPage`.
*   It calculates which subset of links (`currentItems`) to show based on the `currentPage` and `itemsPerPage`.
*   It uses the `react-paginate` library to automatically generate page navigation controls if there are more links than `itemsPerPage`.

This ensures your links are always presented clearly, even if you have a very long list!

We've now covered the main content sections: Profile and Links. But what about the building blocks used to create components like `Button`, `Avatar`, and even the structure of `LinkCard`? In the next chapter, we'll look at the low-level UI pieces that give our application its consistent look and feel.

Next up: [Chapter 6: UI Primitives (shadcn/ui style)](06_ui_primitives__shadcn_ui_style_.md)

---

Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge)