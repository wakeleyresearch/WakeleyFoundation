export const palette = {
  slateBlueGrey: '#6E7882',
  offWhite: '#FAFAFA',
  charcoal: '#1E1E1E',
  warmSand: '#D9CDB8',
  mutedTerracotta: '#B87E68',
  deepSlate: '#3D454D',
  mist: '#EDEEF0'
} as const;

export const site = {
  name: 'Wakeley Foundation',
  domain: 'www.wakeleyfoundation.org',
  url: 'https://www.wakeleyfoundation.org',
  description:
    'Wakeley Foundation supports entrepreneurship education, small-business sustainability, workforce readiness, and community economic opportunity in North Carolina.',
  nav: [
    { label: 'Mission', href: '#mission' },
    { label: 'Focus', href: '#focus' },
    { label: 'Contact', href: '#contact' }
  ],
  hero: {
    eyebrow: 'North Carolina nonprofit foundation',
    title: 'Wakeley Foundation',
    deck:
      'Supporting entrepreneurship education, small-business sustainability, workforce readiness, and practical economic opportunity for communities across North Carolina.',
    primaryCta: { label: 'Start a conversation', href: '#contact' },
    secondaryCta: { label: 'Explore the mission', href: '#mission' }
  },
  mission: {
    eyebrow: 'Mission',
    title: 'Expanding economic opportunity through education and practical small-business support.',
    body:
      'Wakeley Foundation exists to help aspiring entrepreneurs and small businesses turn ambition into enterprise. Through education, mentorship, technical assistance, and operational guidance, we serve those who have historically had the least access to these resources: rural and underserved communities, veterans, and economically distressed individuals working to build something of their own.'
  },
  focus: {
    eyebrow: 'Focus',
    title: 'Program areas shaped by the foundation’s articles of incorporation.'
  },
  focusAreas: [
    {
      title: 'Entrepreneurship education',
      body: 'Develop educational programs and resources around business formation, operations, management, market development, financial literacy, technology adoption, and business readiness.'
    },
    {
      title: 'Small-business support',
      body: 'Provide mentorship, operational guidance, technical assistance, and business support services for aspiring entrepreneurs and small business enterprises lacking affordable professional guidance.'
    },
    {
      title: 'Economic opportunity',
      body: 'Support workforce readiness, community revitalization, entrepreneurship development, and lawful economic development through charitable and educational activities.'
    }
  ],
  model: {
    eyebrow: 'Operating model',
    title: 'Practical education and community support, delivered with discipline and best practice.',
    body:
      'Wakeley Foundation operates in a consultative, documentation-first, case-informed advisory tradition — defining problems with clarity, preserving the knowledge that drives results, partnering with organizations who do the work well, and keeping every decision anchored to the people and communities our mission exists to serve.',
    principles: [
      {
        title: 'Case-informed learning',
        body:
          'Programs can be built around real operating patterns, practical examples, and repeatable education rather than abstract instruction alone.'
      },
      {
        title: 'Structured guidance',
        body:
          'Entrepreneurs and small organizations benefit from clear records, accountable next steps, and plain-language support across formation, operations, readiness, and sustainability.'
      },
      {
        title: 'Continuity and coordination',
        body:
          'The foundation can work with nonprofits, educational institutions, public agencies, and community partners to connect resources and preserve momentum through change.'
      }
    ]
  },
  impact: {
    eyebrow: 'Public benefit',
    metric: 'North Carolina',
    title: 'Education and support for entrepreneurs who face real barriers.',
    body:
      'The foundation is designed to work independently and with public, private, nonprofit, educational, and community partners to reduce economic barriers, promote community resilience, and expand access to entrepreneurship education.'
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Reach Wakeley Foundation',
    body:
      "We'd love to hear from you. Reach out through this form for program questions, business education initiatives, community resource coordination, how you can get involved or general inquiries about the Wakeley Foundation. We're based in the Raleigh / Research Triangle area and work with partners remotely as well.",
    submitLabel: 'Send message'
  },
  footer: {
    note:
      'Educational information is provided for public-benefit purposes only and is not legal advice or legal services.'
  }
} as const;

export type SiteContent = typeof site;
