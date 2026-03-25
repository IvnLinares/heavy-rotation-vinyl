# Heavy Rotation Vinyl Shelf 💿✨

An interactive, frontend-only widget built with React, Vite, and Tailwind CSS v4 that beautifully displays your top Last.fm albums, artists, or tracks on a virtual "vinyl shelf."

Designed with a modern **Apple Liquid Glass** (Glassmorphism) aesthetic, this project is perfect as a standalone showcase or as an embedded widget (e.g., via iframe in Notion or personal websites).

## Features

- **Liquid Glass Aesthetics:** Gorgeous mesh gradient background, rounded corners, soft shadows, and backdrop blur.
- **View Toggle:** Seamlessly switch between your top **Albums**, **Artists**, and **Tracks**.
- **Interactive Animations:** Hovering over or tapping an item smoothly slides a vinyl disc out of its sleeve to reveal your play count and Last.fm link.
- **Smart Fallbacks:** Automatically fetches the top album cover for artists when Last.fm fails to provide a profile image.
- **Widget Mode:** Add `?widget=true` to the URL to hide the header and footer, perfect for clean embedding.
- **Fully Responsive & Accessible:** Works perfectly on desktop and mobile, with full keyboard navigation support.

## Demo / Widget Mode

You can run this widget on any site! To embed it without the headers and footers, simply append `?widget=true` to your URL:

```html
<iframe src="https://ivnlinares.com/heavy-rotation-vinyl/?widget=true" width="100%" height="800px" frameborder="0"></iframe>
```

*(Note: Replace the URL with your actual deployment URL).*

## Getting Started

Since this project fetches data from the **Last.fm API**, you will need to provide your API key and username.

### 1. Clone the repository

```bash
git clone https://github.com/IvnLinares/heavy-rotation-vinyl.git
cd heavy-rotation-vinyl
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project (you can copy the provided `.env.example`):

```bash
cp .env.example .env
```

Open the `.env` file and add your credentials:

```env
VITE_LASTFM_USER=your_lastfm_username
VITE_LASTFM_API_KEY=your_api_key
```

*Don't have an API key? Get one by creating an API account at [Last.fm API](https://www.last.fm/api/account/create).*

> **Security Note:** The `.env` file is safely ignored via `.gitignore` and will never be pushed to your repository. It is 100% safe to make this repository public.

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

## Deployment to GitHub Pages

This project is configured out-of-the-box to be deployed to GitHub Pages.

1. Ensure `vite.config.js` has the correct `base` URL for your repository (e.g., `base: '/heavy-rotation-vinyl/'`).
2. Run `npm run build`.
3. Push your repository to GitHub. Use GitHub Actions to build and deploy your `dist` folder automatically.
*(Alternatively, you can just use Vercel, Netlify, or similar services with zero configuration).*

## Technologies Used

- **React 18** (Custom hooks, functional components)
- **Vite** (Build tool) 
- **Tailwind CSS v4** (Styling, layout, glassmorphism)
- **Lucide React** (Icons)
- **Last.fm API** (Real-time music data)

---

Developed with ❤️ by [IvnLinares](https://ivnlinares.com).
