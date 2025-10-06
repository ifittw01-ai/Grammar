export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.openrouterApiKey

  // Check if API key is configured
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: API key not configured'
    })
  }

  // Get request body
  const body = await readBody(event)
  const sentence = body?.sentence

  if (!sentence || typeof sentence !== 'string' || !sentence.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid sentence'
    })
  }

  try {
    // Call OpenRouter API
    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Grammar Study Buddy'
      },
      body: {
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: `You are a helpful grammar tutor. When given a sentence, analyze it for grammar correctness and provide:
1. Whether the grammar is correct (true/false)
2. If incorrect, provide a corrected version
3. Brief feedback explaining the issues
4. Specific suggestions for improvement

IMPORTANT: Respond ONLY with valid JSON. Do NOT wrap your response in markdown code blocks. Do NOT use \`\`\`json or \`\`\`.

Respond in this exact JSON format:
{
  "isCorrect": boolean,
  "correctedSentence": "corrected version if needed",
  "feedback": "brief explanation",
  "suggestions": ["suggestion1", "suggestion2", ...]
}`
          },
          {
            role: 'user',
            content: `Please check the grammar of this sentence: "${sentence}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }
    })

    // Extract the AI response
    const aiResponse = response.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Invalid response format from API')
    }

    // Try to parse the JSON response
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim()
      
      // Remove ```json and ``` markers
      cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '')
      cleanedResponse = cleanedResponse.replace(/^```\s*/i, '')
      cleanedResponse = cleanedResponse.replace(/\s*```$/i, '')
      cleanedResponse = cleanedResponse.trim()
      
      const result = JSON.parse(cleanedResponse)
      return result
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw AI response:', aiResponse)
      
      // If JSON parsing fails, create a fallback result
      return {
        isCorrect: false,
        correctedSentence: null,
        feedback: aiResponse,
        suggestions: []
      }
    }
  } catch (error: any) {
    console.error('OpenRouter API Error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to check grammar. Please try again.'
    })
  }
})

