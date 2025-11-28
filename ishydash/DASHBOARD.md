# Ishy Friend Board - Dashboard

A modern, neomimalism-inspired friend board for the Ishy Discord bot. Find friends anonymously and start chatting instantly with a beautiful web interface.

## Features

✨ **Modern Design**
- Neomimalism aesthetic with depth and modern styling
- Semi-rounded patterns with glassmorphism effects
- Smooth animations and glow effects
- Responsive mobile-first design

🎨 **Customization**
- Tailwind CSS 4 with custom color tokens
- Poppins font for modern typography
- Gradient backgrounds and glowing buttons
- Dark theme with cyan, purple, and pink accents

⚡ **Functionality**
- Anonymous friend matching
- Custom nickname support
- Real-time status updates
- Queue and active chat monitoring
- Block/unblock user management

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **API Client**: TypeScript with fetch
- **Typography**: Poppins (Google Fonts)

## Setup

### Prerequisites
- Node.js 18+
- Ishy API running (Python FastAPI server)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd ishydash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://your-api-url:8000
   NEXT_PUBLIC_API_KEY=your-api-key
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with Poppins font
│   ├── page.tsx          # Main dashboard page
│   └── globals.css       # Global styles and custom utilities
├── components/
│   ├── SearchBar.tsx     # User ID search input
│   ├── StatsPanel.tsx    # Queue and status stats
│   ├── UserCard.tsx      # User profile and actions
│   └── NicknameModal.tsx # Nickname setting modal
└── lib/
    └── api.ts            # Ishy API client
```

## API Integration

The dashboard integrates with your Ishy Python API:

### Endpoints Used

- `POST /queue` - Add user to matching queue
- `POST /leave` - Leave queue or chat
- `POST /reveal` - Reveal identity to partner
- `POST /block` - Block a user
- `POST /unblock` - Unblock a user
- `POST /nick` - Set user nickname
- `GET /me` - Get user status
- `GET /status` - Get server statistics

All requests require Bearer token authentication via the API key.

## Customization

### Colors

Edit color tokens in `src/app/globals.css`:

```css
:root {
  --primary-glow: #00d9ff;        /* Cyan */
  --secondary-glow: #7c3aed;      /* Purple */
  --accent-glow: #ec4899;         /* Pink */
  --card-bg: #1a1a2e;
  --card-border: #2d2d5f;
}
```

### Fonts

The dashboard uses Poppins from Google Fonts (configured in `src/app/layout.tsx`). Modify the weight selection in layout.tsx if needed.

### Glow Effects

Custom animations in `globals.css`:
- `glow-button` - Button glow animation
- `glow-card` - Card floating glow effect
- `glow-text` - Text gradient effect

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- ~45KB gzipped bundle size
- Optimized images with Next.js Image component
- CSS-only animations (no JavaScript animations)
- Server-side rendering ready

## License

Part of the Ishy project. See main repository for license details.

## Support

For issues or feature requests, contact the Ishy development team.

---

Built with ⚡ for Ishy - Find friends anonymously.
