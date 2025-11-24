import { format } from 'date-fns';

const MOCK_CONTENT = `
<p>In the ever-shifting landscape of global finance, discerning investors constantly seek assets that promise not just growth, but resilience. Today, we turn our analytical lens towards <strong>Innovatech Dynamics Inc. (IDI)</strong>, a company at the forefront of the burgeoning field of applied artificial intelligence and quantum computing. While the tech sector has seen its share of volatility, IDI presents a compelling, albeit complex, case for long-term investment.</p>

<h2>The Quantum Leap: A New Paradigm</h2>
<p>Innovatech's primary value proposition lies in its proprietary quantum computing architecture. Unlike classical computers that process information in bits (0s and 1s), quantum computers use qubits, which can exist in multiple states simultaneously. This allows for solving complex problems exponentially faster than even the most powerful supercomputers today.</p>

<blockquote>
  "Quantum computing is not just an incremental improvement; it's a fundamental shift in how we process reality. Companies that lead this charge will redefine industries."
  <cite>– Dr. Evelyn Reed, Chief Scientist at IDI</cite>
</blockquote>

<h3>Market Application & Moat</h3>
<p>IDI is not just a research lab. They have successfully deployed their quantum-powered algorithms in several key sectors:</p>
<ul>
  <li><strong>Pharmaceuticals:</strong> Simulating molecular interactions to accelerate drug discovery, cutting down R&D time from years to months.</li>
  <li><strong>Financial Modeling:</strong> Running complex risk analysis and high-frequency trading algorithms with unprecedented speed and accuracy.</li>
  <li><strong>Logistics:</strong> Optimizing global supply chains for major e-commerce players, resulting in significant cost savings.</li>
</ul>

<p>This multi-pronged commercialization strategy forms a significant competitive moat. While competitors are still in the theoretical stages, IDI is already generating revenue and building deep-rooted partnerships.</p>

<h2>Financial Health & Projections</h2>
<p>Let's break down the numbers. IDI's recent quarterly earnings report was a mixed bag, which has created a potential entry point for savvy investors. While revenue was up 15% YoY, R&D expenditure also ballooned by 30%, impacting net profit.</p>

<p>The chart below illustrates IDI's stock performance over the last 12 months against the NASDAQ Composite. While it has underperformed the broader index in the short term, its periods of rapid growth correspond with major partnership announcements, indicating high sensitivity to positive news flow.</p>

<p><em>[Chart will be injected here]</em></p>

<h2>Risks & Mitigating Factors</h2>
<p>No investment is without risk. For IDI, the primary concerns are:</p>
<ol>
  <li><strong>Technological Obsolescence:</strong> A competitor could, in theory, develop a more stable and scalable quantum architecture.</li>
  <li><strong>High Cash Burn Rate:</strong> The aggressive R&D spending is not sustainable without continued revenue growth or further capital injection.</li>
  <li><strong>Market Adoption:</strong> The full potential of quantum computing is yet to be universally understood and integrated, which could slow down sales cycles.</li>
</ol>

<p>However, IDI's management has been proactive. They have secured long-term contracts with their initial clients, providing a stable revenue floor. Furthermore, their patent portfolio is extensive, creating a legal barrier to entry for would-be competitors. The high cash burn is a calculated risk to maintain their technological lead.</p>

<h2>Conclusion: A Premium Bet on the Future</h2>
<p>Investing in Innovatech Dynamics Inc. is not for the faint of heart. It is a high-conviction bet on the future of computing. The company's technological lead, established commercial applications, and visionary leadership team position it as a potential titan of the next decade. However, the path will likely be volatile.</p>

<p>For investors with a long-term horizon and a high tolerance for risk, accumulating a position in IDI at its current valuation could yield extraordinary returns. This is a premium analysis for our premium subscribers, as the full, in-depth financial model and valuation breakdown are available beyond this point.</p>
`;

const generateChartData = () => {
  const data = [];
  let value = 100;
  const startDate = new Date(2023, 0, 1);
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    value += (Math.random() - 0.5) * 5;
    data.push({ date: format(date, 'MMM dd'), value: Math.max(value, 20) });
  }
  return data;
};

export const getPostBySlug = (slug: string) => {
  // In a real app, you'd fetch this from a database based on the slug.
  // Here, we return the same mock data regardless of the slug.
  return {
    slug,
    title: "Deep Dive: Is Innovatech Dynamics the Next Titan of Tech?",
    date: "November 24, 2025",
    author: {
      name: "Johnathan Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=johnathandoe",
    },
    isPremium: true,
    content: MOCK_CONTENT,
    chartData: generateChartData(),
  };
};

export type Post = ReturnType<typeof getPostBySlug>;
export type ChartData = Post['chartData'];