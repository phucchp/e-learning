const CONDENSE_TEMPLATE = `Based on the following conversation and the subsequent question, please rephrase the subsequent question so that it becomes a standalone question.

**Chat History:**
{chat_history}

**Follow-Up Question:**
{question}

**Standalone Question:**
Please ensure that the rephrased question is clear, concise, and context-independent.
`;

export default CONDENSE_TEMPLATE;
