import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Design Explorations',
  robots: { index: false, follow: false },
};

const designs = [
  {
    slug: 'holo-terminal',
    name: 'Holographic Terminal',
    tagline: 'Your terminal identity, rebuilt in 3D',
    description:
      'A WebGL hero with a floating holographic terminal that tilts toward the cursor, phosphor particle field, wireframe solids, and glowing holo-panel sections.',
    palette: ['#39ff14', '#00ffff', '#ffb000', '#050807'],
  },
  {
    slug: 'aurora-glass',
    name: 'Cosmic Aurora Glass',
    tagline: 'Dreamy, premium, ethereal',
    description:
      'A slow domain-warped aurora shader and twinkling starfield behind frosted-glass panels with iridescent borders and gradient-sheen headlines.',
    palette: ['#2dd4bf', '#818cf8', '#e879f9', '#070510'],
  },
  {
    slug: 'brutalist',
    name: 'Brutalist 3D Monolith',
    tagline: 'Raw, aggressive, unforgettable',
    description:
      'Rotating concrete monoliths under one violent light, massive Anton typography, snap-scroll slabs alternating black and paper-white, one signal-red accent.',
    palette: ['#9a9a96', '#ff2b00', '#f5f5f0', '#0c0c0c'],
  },
  {
    slug: 'css-3d',
    name: 'Layered Depth',
    tagline: 'Warm editorial, zero WebGL',
    description:
      'Cream paper and ink with persimmon accents — CSS perspective hero with depth-layered type, cursor-tilt cards with glare, flip-card skills. Instant load.',
    palette: ['#f7f1e6', '#1d1812', '#ff5a36', '#b0350f'],
  },
];

export default function DesignsIndex() {
  return (
    <main
      data-design-root
      className="min-h-screen w-full bg-[#101012] px-6 py-16 font-sans text-[#e8e8ea]"
    >
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm tracking-widest text-[#8b8b92] uppercase">
          Portfolio redesign
        </p>
        <h1 className="mb-3 text-4xl font-bold">Design Explorations</h1>
        <p className="mb-12 max-w-2xl text-[#a9a9b0]">
          Four complete takes on the same content. Open each one, live with it
          for a minute, and note what you like — directions can be combined.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {designs.map((d, i) => (
            <Link
              key={d.slug}
              href={`/designs/${d.slug}`}
              className="group rounded-xl border border-[#2a2a30] bg-[#17171b] p-6 transition-colors hover:border-[#4a4a55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8e8ea]"
            >
              <div className="mb-4 flex gap-1.5">
                {d.palette.map((c) => (
                  <span
                    key={c}
                    className="h-4 w-4 rounded-full border border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="mb-1 text-xs text-[#8b8b92]">0{i + 1}</p>
              <h2 className="mb-1 text-xl font-semibold group-hover:underline">
                {d.name}
              </h2>
              <p className="mb-3 text-sm font-medium text-[#c9c9d0]">
                {d.tagline}
              </p>
              <p className="text-sm leading-relaxed text-[#a9a9b0]">
                {d.description}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-sm text-[#8b8b92]">
          Current live site stays untouched at{' '}
          <Link href="/" className="underline hover:text-[#e8e8ea]">
            /
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
