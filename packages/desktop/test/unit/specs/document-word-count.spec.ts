import { describe, expect, it } from 'vitest'
import { createDocumentState, getBlankFileState } from '@/store/help'

describe('document word-count initialization', () => {
  it('counts markdown supplied when creating a blank file', () => {
    const markdown = 'alpha beta\n\ngamma \u5b57\n'
    const state = getBlankFileState([], 'utf8', 'lf', markdown)

    expect(state.wordCount).toEqual({
      word: 4,
      paragraph: 2,
      character: 15,
      all: markdown.length
    })
  })

  it('derives the count from markdown instead of restored stale data', () => {
    const state = createDocumentState({
      markdown: 'one two three',
      wordCount: {
        word: 0,
        paragraph: 0,
        character: 0,
        all: 0
      }
    })

    expect(state.wordCount).toEqual({
      word: 3,
      paragraph: 1,
      character: 11,
      all: 13
    })
  })
})
