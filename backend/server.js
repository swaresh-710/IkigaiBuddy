require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/analyze-ikigai', async (req, res) => {
  try {
    const { responses } = req.body;

    const prompt = `
Analyze the following responses to find the user's Ikigai:
1. What activities do you love doing? ${responses[0]}
2. What are you skilled at? ${responses[1]}
3. What does the world need? ${responses[2]}
4. What can you be paid for? ${responses[3]}

Based on these responses, determine the user's Ikigai, potential career paths, and provide a detailed analysis. Format the response as follows:

Ikigai: [Main Ikigai]

Top Career Paths:
1. [Career Path 1]
2. [Career Path 2]
3. [Career Path 3]

Detailed Analysis:
[Provide a paragraph explaining the reasoning behind the Ikigai and career paths, and how they align with the user's responses]

Alternative Ikigai Options:
1. [Alternative 1]
2. [Alternative 2]
3. [Alternative 3]

[Provide a brief explanation for each alternative]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;

    res.json({ analysis });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the Ikigai' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// Mock function for Ikigai analysis
function mockAnalyzeIkigai(responses) {
    return `
  Ikigai: Creative Problem Solver
  
  Top Career Paths:
  1. UX/UI Designer
  2. Product Manager
  3. Entrepreneur
  
  Detailed Analysis:
  Based on your responses, it appears that you enjoy creative activities and problem-solving. You're skilled in design and technology, which aligns well with the world's growing need for user-friendly digital solutions. These skills and interests can be monetized in various tech-related fields, making UX/UI Design, Product Management, or Entrepreneurship excellent career paths for you.
  
  Alternative Ikigai Options:
  1. Educational Technology Specialist
  2. Environmental Solution Designer
  3. Non-profit Innovation Consultant
  
  These alternatives combine your creative problem-solving skills with different focuses, allowing you to address various global needs while utilizing your strengths.
  `;
  }
  
  app.post('/analyze-ikigai', async (req, res) => {
    try {
      const { responses } = req.body;
  
      // Comment out the OpenAI API call
      // const completion = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: prompt }],
      // });
      // const analysis = completion.choices[0].message.content;
  
      // Use the mock function instead
      const analysis = mockAnalyzeIkigai(responses);
  
      res.json({ analysis });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while analyzing the Ikigai' });
    }
  });
  
  // ... (keep the existing app.listen)