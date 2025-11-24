export type Post = {
  id: number;
  title: string;
  summary: string;
  date: string;
  status: 'Paid' | 'Free';
  imageUrl?: string;
  author: {
    name: string;
    avatarUrl: string;
  };
};

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: "The Crypto Correction: Is Now the Time to Buy?",
    summary: "A deep dive into the recent market volatility and what it means for long-term crypto investors.",
    date: "November 24, 2025",
    status: 'Paid',
    imageUrl: "/placeholder-1.jpg",
    author: {
      name: "John Doe",
      avatarUrl: "/avatars/john-doe.png",
    },
  },
  {
    id: 2,
    title: "Macro Trends Q4 2025: Navigating Inflation and Interest Rates",
    summary: "Central bank policies are shifting. We analyze the key macroeconomic indicators to watch.",
    date: "November 18, 2025",
    status: 'Free',
    author: {
      name: "Jane Smith",
      avatarUrl: "/avatars/jane-smith.png",
    },
  },
  {
    id: 3,
    title: "Unlocking Value in Emerging Markets: A Sector-by-Sector Analysis",
    summary: "Beyond the BRICS: discovering high-growth opportunities in overlooked international markets.",
    date: "November 12, 2025",
    status: 'Paid',
    author: {
      name: "John Doe",
      avatarUrl: "/avatars/john-doe.png",
    },
  },
  {
    id: 4,
    title: "The Future of AI: Investing in Tomorrow's Tech Giants",
    summary: "From large language models to autonomous systems, we identify the key players in the AI revolution.",
    date: "November 5, 2025",
    status: 'Free',
    author: {
      name: "Emily White",
      avatarUrl: "/avatars/emily-white.png",
    },
  },
  {
    id: 5,
    title: "Real Estate vs. REITs: A Modern Portfolio Perspective",
    summary: "How to gain exposure to the property market without the hassle of direct ownership.",
    date: "October 29, 2025",
    status: 'Paid',
    author: {
      name: "Jane Smith",
      avatarUrl: "/avatars/jane-smith.png",
    },
  },
  {
    id: 6,
    title: "A Beginner's Guide to Options Trading",
    summary: "Understanding the basics of calls, puts, and how to use them to hedge your portfolio.",
    date: "October 22, 2025",
    status: 'Free',
    author: {
      name: "Michael Brown",
      avatarUrl: "/avatars/michael-brown.png",
    },
  },
];

export const featuredPost: Post = dummyPosts[0];