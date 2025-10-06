<template>
  <div class="gradient-bg min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Grammar Study Buddy</h1>
        <p class="text-white/80 text-lg">Get instant grammar feedback on your sentences</p>
      </div>

      <!-- Main Card -->
      <div class="max-w-4xl mx-auto">
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
</template>

<script setup lang="ts">
interface GrammarResult {
  isCorrect: boolean
  correctedSentence: string | null
  feedback: string
  suggestions: string[]
}

const inputSentence = ref('')
const originalSentence = ref('')
const isLoading = ref(false)
const result = ref<GrammarResult | null>(null)
const error = ref<string | null>(null)

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
}
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
</style>

