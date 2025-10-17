// This is the code for your Vercel backend function (api/chatbot.js)

export default async function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return response.status(405).send('Method Not Allowed');
    }
  
    try {
      // Get the user's message from the request
      const { message } = request.body;
      if (!message) {
        return response.status(400).json({ error: 'No message provided' });
      }
  
      // Get the secret API key from Vercel's Environment Variables (this is secure)
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
          return response.status(500).json({ error: 'API key not configured on the server' });
      }
      
      const apiUrl = `https://generativelaunguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      // Create the prompt for Gemini
      const prompt = {
        contents: [{
          parts: [{
            text: `You are a helpful and friendly chatbot assistant for Sarujan Thirunavukkarasu's personal portfolio. 
                   Your name is Sparky. Keep your answers concise and professional.
                   If asked about Sarujan's skills, you can mention he is skilled in Python, AI/ML, C++, and Web Development.
                   If asked about his projects, mention his work on an AI Coding Assistant and a Course Registration System.
                   For contact info, direct them to the contact section on the page.
                   User's question: "${message}"`
          }]
        }]
      };
  
      // Call the actual Gemini API
      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });
  
      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
      }
  
      const geminiData = await geminiResponse.json();
      const botMessage = geminiData.candidates[0].content.parts[0].text;
  
      // Send the response back to your portfolio
      return response.status(200).json({ reply: botMessage });
  
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'An internal error occurred.' });
    }
  }