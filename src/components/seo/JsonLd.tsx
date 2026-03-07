import React from 'react';

export function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prateek Kumar Mohanty',
    jobTitle: 'Full Stack Developer',
    url: 'https://github.com/StrangeNoob',
    sameAs: [
      'https://github.com/StrangeNoob',
      'https://linkedin.com/in/prateek-mohanty',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Python',
      'Flutter',
      'AI/ML'
    ],
    description: 'Full Stack Developer with 4+ years of experience in React, Flutter, Node.js, Python, and AI/ML.'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
