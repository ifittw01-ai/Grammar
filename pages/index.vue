<template>
  <div class="gradient-bg min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Grammar Study Buddy</h1>
        <p class="text-white/80 text-lg">Get instant grammar feedback on your sentences</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        <!-- History Panel (Left Side) -->
        <div class="lg:col-span-4">
          <div class="glass-effect rounded-2xl p-6 shadow-2xl h-[calc(100vh-200px)] sticky top-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-800">歷史</h2>
              <span class="text-sm text-gray-600">{{ historyItems.length }} 項</span>
            </div>
            
            <!-- History List -->
            <div class="overflow-y-auto h-[calc(100%-50px)] space-y-3 pr-2 custom-scrollbar">
              <!-- Empty State -->
              <div v-if="historyItems.length === 0" class="text-center py-12">
                <span class="text-6xl mb-4 block">📝</span>
                <p class="text-gray-500 text-sm">尚無歷史紀錄</p>
                <p class="text-gray-400 text-xs mt-2">您檢查過的句子會顯示在這裡</p>
              </div>

              <!-- History Items -->
              <div 
                v-for="(item, index) in historyItems" 
                :key="index"
                @click="viewHistoryItem(item)"
                class="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-300"
                :class="selectedHistoryIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : ''"
              >
                <!-- Status Icon -->
                <div class="flex items-start gap-3">
                  <span class="text-xl flex-shrink-0">{{ item.isCorrect ? '✅' : '❌' }}</span>
                  <div class="flex-1 min-w-0">
                    <!-- Sentence Preview -->
                    <p class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                      "{{ item.sentence }}"
                    </p>
                    <!-- Timestamp -->
                    <p class="text-xs text-gray-500">{{ item.timestamp }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content (Right Side) -->
        <div class="lg:col-span-8">
          <div class="glass-effect rounded-2xl p-8 shadow-2xl">
          <!-- Input Section -->
          <div class="mb-8">
            <label for="sentence" class="block text-gray-700 font-semibold mb-3 text-lg">
              Enter your sentence:
            </label>
            <textarea
              id="sentence"
              v-model="inputSentence"
              placeholder="Type your sentence here..."
              class="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              rows="3"
              :disabled="isLoading"
            />

            <!-- Submit Button -->
            <button
              @click="checkGrammar"
              :disabled="!inputSentence.trim() || isLoading"
              class="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="animate-spin">⏳</span>
              <span v-else>🔍</span>
              {{ isLoading ? 'Checking Grammar...' : 'Check Grammar' }}
            </button>
          </div>

          <!-- Results Section -->
          <div v-if="result" class="space-y-4">
            <!-- Grammar Status -->
            <div 
              class="p-6 rounded-lg border-2" 
              :class="result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
            >
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ result.isCorrect ? '✅' : '❌' }}</span>
                <h3 
                  class="text-xl font-bold" 
                  :class="result.isCorrect ? 'text-green-800' : 'text-red-800'"
                >
                  {{ result.isCorrect ? 'Grammar is Correct!' : 'Grammar Issues Found' }}
                </h3>
              </div>
              
              <!-- Original Sentence -->
              <div class="mb-4">
                <h4 class="font-semibold text-gray-700 mb-2">Your sentence:</h4>
                <p class="bg-white p-3 rounded border italic">"{{ originalSentence }}"</p>
              </div>

              <!-- Corrected Sentence (if applicable) -->
              <div v-if="result.correctedSentence && !result.isCorrect" class="mb-4">
                <h4 class="font-semibold text-gray-700 mb-2">Suggested correction:</h4>
                <p class="bg-white p-3 rounded border">"{{ result.correctedSentence }}"</p>
              </div>

              <!-- Feedback -->
              <div class="mb-4">
                <h4 class="font-semibold text-gray-700 mb-2">Feedback:</h4>
                <p class="text-gray-700 leading-relaxed">{{ result.feedback }}</p>
              </div>

              <!-- Suggestions -->
              <div v-if="result.suggestions && result.suggestions.length > 0">
                <h4 class="font-semibold text-gray-700 mb-2">Suggestions:</h4>
                <ul class="space-y-2">
                  <li 
                    v-for="(suggestion, index) in result.suggestions" 
                    :key="index" 
                    class="flex items-start gap-2 text-gray-700"
                  >
                    <span class="text-blue-500 mt-1">•</span>
                    <span>{{ suggestion }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Try Another Button -->
            <button
              @click="clearResults"
              class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Try Another Sentence
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div class="flex items-center gap-2">
              <span class="text-red-500 text-xl">⚠️</span>
              <h4 class="font-semibold text-red-800">Error</h4>
            </div>
            <p class="text-red-700 mt-2">{{ error }}</p>
          </div>

          <!-- Instructions -->
          <div v-if="!result && !error" class="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-3">How to use:</h3>
            <ol class="list-decimal list-inside space-y-2 text-blue-700">
              <li>Type any sentence you want to check in the text area above</li>
              <li>Click "Check Grammar" to get instant feedback</li>
              <li>Review the results and suggestions for improvement</li>
            </ol>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GrammarResult {
  isCorrect: boolean
  correctedSentence: string | null
  feedback: string
  suggestions: string[]
}

interface HistoryItem {
  sentence: string
  isCorrect: boolean
  correctedSentence: string | null
  feedback: string
  suggestions: string[]
  timestamp: string
}

const inputSentence = ref('')
const originalSentence = ref('')
const isLoading = ref(false)
const result = ref<GrammarResult | null>(null)
const error = ref<string | null>(null)
const historyItems = ref<HistoryItem[]>([])
const selectedHistoryIndex = ref<number | null>(null)

const checkGrammar = async () => {
  if (!inputSentence.value.trim()) {
    error.value = 'Please enter a sentence.'
    return
  }

  isLoading.value = true
  error.value = null
  result.value = null
  originalSentence.value = inputSentence.value

  try {
    const response = await $fetch<GrammarResult>('/api/check-grammar', {
      method: 'POST',
      body: {
        sentence: inputSentence.value
      }
    })

    result.value = response
    
    // Save to Supabase
    try {
      await $fetch('/api/history/save', {
        method: 'POST',
        body: {
          sentence: originalSentence.value,
          isCorrect: response.isCorrect,
          correctedSentence: response.correctedSentence,
          feedback: response.feedback,
          suggestions: response.suggestions
        }
      })
      
      // Reload history to get the latest from database
      await loadHistory()
    } catch (saveError) {
      console.error('Failed to save history:', saveError)
      // Still show result even if saving fails
    }
    
    selectedHistoryIndex.value = null
  } catch (err: any) {
    console.error('Error:', err)
    error.value = err.data?.message || err.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const clearResults = () => {
  result.value = null
  error.value = null
  inputSentence.value = ''
  originalSentence.value = ''
  selectedHistoryIndex.value = null
}

const viewHistoryItem = (item: HistoryItem) => {
  // Find the index of the clicked item
  selectedHistoryIndex.value = historyItems.value.findIndex(h => h === item)
  
  // Display the history item in the results section
  result.value = {
    isCorrect: item.isCorrect,
    correctedSentence: item.correctedSentence,
    feedback: item.feedback,
    suggestions: item.suggestions
  }
  originalSentence.value = item.sentence
  error.value = null
}

const formatTimestamp = () => {
  const now = new Date()
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load history from Supabase
const loadHistory = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: HistoryItem[]; count: number }>('/api/history/load')
    if (response.success) {
      historyItems.value = response.data
    }
  } catch (err) {
    console.error('Failed to load history:', err)
    // Fail silently - history is not critical for the app to function
  }
}

// Load history when component mounts
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glass-effect {
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(209, 213, 219, 0.3);
}

/* Custom Scrollbar for History Panel */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* Line Clamp Utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

