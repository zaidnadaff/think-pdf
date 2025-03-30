// This is a mock implementation - replace with your actual API implementation

export async function GET(req: Request) {
  // Parse the URL to get the documentId
  const url = new URL(req.url)
  const documentId = url.searchParams.get("documentId")

  if (!documentId) {
    return Response.json({ error: "Document ID is required" }, { status: 400 })
  }

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Return mock conversation data based on the document ID
  if (documentId === "doc-1") {
    return Response.json([
      {
        question: "What are the main findings of this research paper?",
        answer:
          "Based on my analysis of the research paper, the main findings are:\n\n1. The novel algorithm demonstrated a 42% improvement in efficiency compared to existing methods.\n\n2. The study found a statistically significant correlation (p<0.001) between the variables X and Y.\n\n3. The researchers identified three key factors that influence the outcome: temperature, pressure, and catalyst concentration.\n\n4. The long-term stability tests showed that the proposed solution maintains 95% of its initial performance after 1000 cycles.\n\nWould you like me to elaborate on any of these findings in particular?",
      },
      {
        question: "Can you explain more about the correlation between X and Y?",
        answer:
          "The correlation between variables X and Y was a central focus of the study. Here's a more detailed explanation:\n\n- The researchers found a strong positive correlation (r = 0.87) between X and Y, indicating that as X increases, Y tends to increase as well.\n\n- This correlation was determined to be statistically significant with a p-value less than 0.001, which means there's less than a 0.1% chance that this relationship occurred by random chance.\n\n- The paper used multiple regression analysis to control for potential confounding variables, and the relationship remained robust.\n\n- The authors proposed a mechanistic explanation for this correlation: X directly influences the molecular pathway that produces Y through a series of enzymatic reactions.\n\n- This finding challenges the previous model which suggested that X and Y were only indirectly related through intermediate factor Z.\n\nThe practical implications of this correlation are significant for the field, as it suggests that manipulating X could be a viable strategy for controlling Y in applied settings.",
      },
    ])
  } else if (documentId === "doc-2") {
    return Response.json([
      {
        question: "What were the key financial metrics for Q3 2023?",
        answer:
          "Based on the financial report for Q3 2023, here are the key financial metrics:\n\n**Revenue:**\n- Total Revenue: $78.5 million\n- Year-over-Year Growth: 23.4%\n- Recurring Revenue: 68% of total (up from 61% in Q3 2022)\n\n**Profitability:**\n- Gross Margin: 72.3% (improved from 68.9% in Q3 2022)\n- EBITDA: $12.7 million (16.2% margin)\n- Net Income: $8.3 million (10.6% margin)\n\n**Cash and Liquidity:**\n- Operating Cash Flow: $15.2 million\n- Cash and Cash Equivalents: $42.6 million\n- Total Debt: $18.9 million\n\n**Operational Metrics:**\n- Customer Acquisition Cost (CAC): $1,250 (down 8% YoY)\n- Customer Lifetime Value (LTV): $9,800\n- LTV:CAC Ratio: 7.8:1\n- Net Revenue Retention: 118%\n\nThe report highlights that the company exceeded analyst expectations for revenue and EBITDA, primarily driven by strong performance in the enterprise segment and successful launch of the new product line in international markets.",
      },
      {
        question: "How does this compare to the previous quarter?",
        answer:
          "Comparing Q3 2023 to Q2 2023, here's how the key financial metrics changed:\n\n**Revenue:**\n- Q3: $78.5M vs Q2: $72.8M (7.8% quarter-over-quarter growth)\n- Sequential growth accelerated from 5.2% in Q2\n\n**Profitability:**\n- Gross Margin: Q3: 72.3% vs Q2: 71.1% (1.2 percentage point improvement)\n- EBITDA: Q3: $12.7M (16.2% margin) vs Q2: $11.2M (15.4% margin)\n- Net Income: Q3: $8.3M vs Q2: $7.1M (16.9% increase)\n\n**Cash and Liquidity:**\n- Operating Cash Flow: Q3: $15.2M vs Q2: $13.8M (10.1% increase)\n- Cash and Cash Equivalents: Q3: $42.6M vs Q2: $38.9M (9.5% increase)\n- Total Debt: Remained stable at $18.9M (no new financing)\n\n**Operational Metrics:**\n- CAC: Decreased by 3.1% from Q2\n- Net Revenue Retention: Improved from 116% to 118%\n\n**Notable Changes:**\n- International revenue grew to 34% of total (up from 31% in Q2)\n- New product line contributed 12% to revenue (up from 8% in Q2)\n- Operating expenses as a percentage of revenue decreased from 56% to 54%\n\nOverall, Q3 showed consistent improvement across all key metrics compared to Q2, with particularly strong momentum in international markets and operational efficiency.",
      },
    ])
  } else {
    // For new documents or doc-3, return empty conversation
    return Response.json([])
  }
}

