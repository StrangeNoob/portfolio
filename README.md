# Prateek Kumar Mohanty - Portfolio

A terminal-themed developer portfolio built with Next.js 16, featuring a unique CLI aesthetic with smooth animations and a functional contact form.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend API
- **Deployment**: Vercel

## Features

- Terminal/CLI inspired design with boot sequence animation
- Responsive across all devices
- Interactive project showcase with filtering
- Timeline-based experience section
- Skills visualization with proficiency indicators
- Functional contact form with email delivery
- Resume download functionality
- Dark mode optimized

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/StrangeNoob/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
RESEND_API_KEY=your_resend_api_key
```

Get your API key from [Resend](https://resend.com).

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── contact/       # Contact form API route
│   ├── globals.css        # Global styles & terminal theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   └── sections/          # Page sections
│       ├── Hero.tsx       # Boot sequence & intro
│       ├── About.tsx      # Bio section
│       ├── Experience.tsx # Work timeline
│       ├── Projects.tsx   # Project showcase
│       ├── Skills.tsx     # Tech stack
│       └── Contact.tsx    # Contact form
├── data/
│   └── resume.ts          # Portfolio content data
└── lib/
    └── utils.ts           # Utility functions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `RESEND_API_KEY` to environment variables
4. Deploy

### Other Platforms

Build the production version and deploy the `.next` folder:

```bash
npm run build
```

## Customization

### Content

Edit `src/data/resume.ts` to update:
- Personal info
- Work experience
- Projects
- Skills
- Social links

### Styling

The terminal theme colors are defined in `tailwind.config.ts` and `src/app/globals.css`.

## License

MIT

## Contact

- Email: itsprateekmohanty@gmail.com
- GitHub: [@StrangeNoob](https://github.com/StrangeNoob)
- LinkedIn: [prateek-mohanty](https://linkedin.com/in/prateek-mohanty)
