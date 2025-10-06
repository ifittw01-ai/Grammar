import { getSupabaseClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseClient()

    // Get query parameters for pagination
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 50
    const offset = parseInt(query.offset as string) || 0

    // Fetch history from Supabase, ordered by most recent first
    const { data, error, count } = await supabase
      .from('grammar_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load history: ' + error.message
      })
    }

    // Transform data to match frontend format
    const historyItems = data?.map(item => ({
      id: item.id,
      sentence: item.sentence,
      isCorrect: item.is_correct,
      correctedSentence: item.corrected_sentence,
      feedback: item.feedback,
      suggestions: item.suggestions || [],
      timestamp: new Date(item.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })) || []

    return {
      success: true,
      data: historyItems,
      count: count || 0
    }
  } catch (error: any) {
    console.error('Load history error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to load history'
    })
  }
})

