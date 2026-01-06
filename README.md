# Random Things

A collection of web utilities built with Next.js 16, featuring a QR code scanner and an automated Gmail OTP fetcher.

## Demo

Live URL: [https://www.nhannt.io.vn/](https://www.nhannt.io.vn/)

## Features

- **QR Code Scanner**: 
  - Scan QR codes directly using the device camera.
  - Parse QR codes from uploaded image files.
- **Code Fetcher (OTP Viewer)**:
  - Secure integration with Google/Gmail APIs.
  - Automatically fetches and extracts OTP verification codes from emails.
  - Configurable polling interval.
- **Modern UI**:
  - Dark mode support.
  - Responsive design using Tailwind CSS v4.
  - Smooth animations with GSAP.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [GSAP](https://gsap.com/)
- **Database**: [Neon](https://neon.tech/) (Serverless Postgres) for token storage.
- **Monitoring**: [Vercel Speed Insights](https://vercel.com/docs/speed-insights).

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (Preferred)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nhan-seiyaku/random-things.git
   cd random-things
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` or create a `.env.local` file with the following keys:
   ```env
   # App URL
   NEXT_PUBLIC_URL=http://localhost:3000
   
   # Google OAuth (for Code Fetcher)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REFRESH_TOKEN=your_refresh_token
   GMAIL_USER=me
   
   # Database (for persisting tokens)
   DATABASE_URL=postgres://...
   
   # Config (Optional)
   NEXT_PUBLIC_POLL_INTERVAL_MS=60000
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── code-fetcher/     # OTP Viewer page components
│   ├── qr-scanner/       # QR Scanner page components
│   └── api/              # Backend API endpoints
├── components/           # Shared UI components
└── lib/                  # Utilities (Gmail logic, Token store)
```

## License

This project is licensed under the MIT License.
