import type { PDFFile, ChatConversation } from "@/components/chat/chat-state-provider"

// Create dummy PDF files
export const createDummyPDFs = (): PDFFile[] => {
  // Since we can't create actual File objects without user interaction,
  // we'll create objects that match the PDFFile interface structure
  return [
    {
      id: "pdf-1",
      file: new File(["dummy content"], "research-paper.pdf", { type: "application/pdf" }),
      name: "Research Paper.pdf",
      size: 2500000, // 2.5MB
      uploadedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      id: "pdf-2",
      file: new File(["dummy content"], "financial-report.pdf", { type: "application/pdf" }),
      name: "Financial Report 2023.pdf",
      size: 1800000, // 1.8MB
      uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "pdf-3",
      file: new File(["dummy content"], "user-manual.pdf", { type: "application/pdf" }),
      name: "Product User Manual.pdf",
      size: 3200000, // 3.2MB
      uploadedAt: new Date(), // Today
    },
  ]
}

// Create dummy conversations
export const createDummyConversations = (pdfIds: string[]): ChatConversation[] => {
  const researchPaperConversation1: ChatConversation = {
    id: "conv-1",
    pdfId: pdfIds[0],
    title: "Research Paper Analysis",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What are the main findings of this research paper?",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Based on my analysis of the research paper, the main findings are:\n\n1. The novel algorithm demonstrated a 42% improvement in efficiency compared to existing methods.\n\n2. The study found a statistically significant correlation (p<0.001) between the variables X and Y.\n\n3. The researchers identified three key factors that influence the outcome: temperature, pressure, and catalyst concentration.\n\n4. The long-term stability tests showed that the proposed solution maintains 95% of its initial performance after 1000 cycles.\n\nWould you like me to elaborate on any of these findings in particular?",
      },
      {
        id: "msg-3",
        role: "user",
        content: "Can you explain more about the correlation between X and Y?",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "The correlation between variables X and Y was a central focus of the study. Here's a more detailed explanation:\n\n- The researchers found a strong positive correlation (r = 0.87) between X and Y, indicating that as X increases, Y tends to increase as well.\n\n- This correlation was determined to be statistically significant with a p-value less than 0.001, which means there's less than a 0.1% chance that this relationship occurred by random chance.\n\n- The paper used multiple regression analysis to control for potential confounding variables, and the relationship remained robust.\n\n- The authors proposed a mechanistic explanation for this correlation: X directly influences the molecular pathway that produces Y through a series of enzymatic reactions.\n\n- This finding challenges the previous model which suggested that X and Y were only indirectly related through intermediate factor Z.\n\nThe practical implications of this correlation are significant for the field, as it suggests that manipulating X could be a viable strategy for controlling Y in applied settings.",
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
  }

  const researchPaperConversation2: ChatConversation = {
    id: "conv-2",
    pdfId: pdfIds[0],
    title: "Research Methodology Questions",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "What methodology did the researchers use in this study?",
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "The researchers employed a mixed-methods approach in this study. Here's a breakdown of their methodology:\n\n**Quantitative Methods:**\n- Randomized controlled trial with 240 participants divided into experimental and control groups\n- Data collection through standardized surveys at baseline, 3 months, and 6 months\n- Statistical analysis using SPSS v26 with ANOVA and multiple regression models\n\n**Qualitative Methods:**\n- Semi-structured interviews with a subset of 25 participants\n- Two focus groups with 8-10 participants each\n- Thematic analysis of transcripts using NVivo software\n\n**Laboratory Techniques:**\n- Spectroscopic analysis of samples using FTIR and NMR\n- Chromatographic separation using HPLC\n- Electron microscopy for structural characterization\n\nThe researchers validated their findings through triangulation of these multiple data sources, which strengthens the reliability of their conclusions.",
      },
    ],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000 + 1800000), // 1 day ago + 30 minutes
  }

  const financialReportConversation: ChatConversation = {
    id: "conv-3",
    pdfId: pdfIds[1],
    title: "Financial Report Analysis",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "What were the key financial metrics for Q3 2023?",
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "Based on the financial report for Q3 2023, here are the key financial metrics:\n\n**Revenue:**\n- Total Revenue: $78.5 million\n- Year-over-Year Growth: 23.4%\n- Recurring Revenue: 68% of total (up from 61% in Q3 2022)\n\n**Profitability:**\n- Gross Margin: 72.3% (improved from 68.9% in Q3 2022)\n- EBITDA: $12.7 million (16.2% margin)\n- Net Income: $8.3 million (10.6% margin)\n\n**Cash and Liquidity:**\n- Operating Cash Flow: $15.2 million\n- Cash and Cash Equivalents: $42.6 million\n- Total Debt: $18.9 million\n\n**Operational Metrics:**\n- Customer Acquisition Cost (CAC): $1,250 (down 8% YoY)\n- Customer Lifetime Value (LTV): $9,800\n- LTV:CAC Ratio: 7.8:1\n- Net Revenue Retention: 118%\n\nThe report highlights that the company exceeded analyst expectations for revenue and EBITDA, primarily driven by strong performance in the enterprise segment and successful launch of the new product line in international markets.",
      },
      {
        id: "msg-9",
        role: "user",
        content: "How does this compare to the previous quarter?",
      },
      {
        id: "msg-10",
        role: "assistant",
        content:
          "Comparing Q3 2023 to Q2 2023, here's how the key financial metrics changed:\n\n**Revenue:**\n- Q3: $78.5M vs Q2: $72.8M (7.8% quarter-over-quarter growth)\n- Sequential growth accelerated from 5.2% in Q2\n\n**Profitability:**\n- Gross Margin: Q3: 72.3% vs Q2: 71.1% (1.2 percentage point improvement)\n- EBITDA: Q3: $12.7M (16.2% margin) vs Q2: $11.2M (15.4% margin)\n- Net Income: Q3: $8.3M vs Q2: $7.1M (16.9% increase)\n\n**Cash and Liquidity:**\n- Operating Cash Flow: Q3: $15.2M vs Q2: $13.8M (10.1% increase)\n- Cash and Cash Equivalents: Q3: $42.6M vs Q2: $38.9M (9.5% increase)\n- Total Debt: Remained stable at $18.9M (no new financing)\n\n**Operational Metrics:**\n- CAC: Decreased by 3.1% from Q2\n- Net Revenue Retention: Improved from 116% to 118%\n\n**Notable Changes:**\n- International revenue grew to 34% of total (up from 31% in Q2)\n- New product line contributed 12% to revenue (up from 8% in Q2)\n- Operating expenses as a percentage of revenue decreased from 56% to 54%\n\nOverall, Q3 showed consistent improvement across all key metrics compared to Q2, with particularly strong momentum in international markets and operational efficiency.",
      },
    ],
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
    updatedAt: new Date(Date.now() - 39600000), // 11 hours ago
  }

  return [researchPaperConversation1, researchPaperConversation2, financialReportConversation]
}

