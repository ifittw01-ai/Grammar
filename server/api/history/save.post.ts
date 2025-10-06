import { getSupabaseClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseClient()
    const body = await readBody(event)

    const { sentence, isCorrect, correctedSentence, feedback, suggestions } = body

    // Validate required fields
    if (!sentence || typeof sentence !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request: sentence is required'
      })
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('grammar_history')
      .insert([
        {
          sentence,
          is_correct: isCorrect,
          corrected_sentence: correctedSentence,
          feedback,
          suggestions: suggestions || [],
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save history: ' + error.message
      })
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Save history error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to save history'
    })
  }
})

