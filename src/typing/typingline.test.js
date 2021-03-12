import Romanizer from './romanizer.js'
import latinTable from '../../latin-table/latin-table.js'
import { test } from '@jest/globals'
import TypingLine from './typingline.js'

const romanizer = new Romanizer(latinTable)

describe('Line tokenizer', () => {
  test('Latin tokenization', () => {
    expect(new TypingLine('abcd', 0, 0, romanizer).tokens).toEqual([
      ['a', 'a', false], ['b', 'b', false], ['c', 'c', false], ['d', 'd', false],
    ])
  })
  test('Japanese tokenization', () => {
    expect(new TypingLine('今[いま]でも生[い]きている', 0, 0, romanizer).tokens).toEqual([
      ['今', 'いま', true], ['で', 'で', false], ['も', 'も', false], ['生', 'い', true],
      ['き', 'き', false], ['て', 'て', false], ['い', 'い', false], ['る', 'る', false],
    ])
  })
  test('Kanji with no readding must throw', () => {
    expect(() => {
      new TypingLine('漢字', 0, 0, romanizer)
    }).toThrow()
    expect(() => {
      new TypingLine('漢字ある', 0, 0, romanizer)
    }).toThrow()
  })
})

describe('Line must accept correctly', () => {
  test('Test 1', () => {
    const line = new TypingLine('漢字[かんじ]|ある　なのに　ABC DEF', 0, 0, romanizer)
    expect(line.getRemainingText()).toBe('KANJI ARU NANONI ABC_DEF')
    expect(line.accept('k')).toBe(1)
    expect(line.accept('a')).toBe(1)
    expect(line.accept('n')).toBe(1)
    expect(line.getRemainingText()).toBe('JI ARU NANONI ABC_DEF')
    expect(line.accept('n')).toBe(0)
    expect(line.getRemainingText()).toBe('JI ARU NANONI ABC_DEF')
    expect(line.accept('j')).toBe(1)
    expect(line.getRemainingText()).toBe('I ARU NANONI ABC_DEF')
    expect(line.accept('i')).toBe(1)
    expect(line.getRemainingText()).toBe('ARU NANONI ABC_DEF')
    expect(line.accept('i')).toBe(-1)
    expect(line.accept('a')).toBe(1)
    expect(line.accept('r')).toBe(1)
    expect(line.accept('u')).toBe(1)
    expect(line.accept('n')).toBe(1)
    expect(line.accept('a')).toBe(1)
    expect(line.accept('n')).toBe(1)
    expect(line.accept('o')).toBe(1)
    expect(line.accept('n')).toBe(1)
    expect(line.accept('i')).toBe(1)
    expect(line.getRemainingText()).toBe('ABC_DEF')
    expect(line.accept('a')).toBe(1)
    expect(line.accept('b')).toBe(1)
    expect(line.accept('c')).toBe(1)
    expect(line.getRemainingText()).toBe('_DEF')
    expect(line.accept('d')).toBe(-1)
    expect(line.getRemainingText()).toBe('_DEF')
    expect(line.accept(' ')).toBe(1)
    expect(line.getRemainingText()).toBe('DEF')
    expect(line.accept('d')).toBe(1)
    expect(line.accept('e')).toBe(1)
    expect(line.accept('f')).toBe(1)
    expect(line.getRemainingText()).toBe('')
    expect(line.isCompleted()).toBeTruthy()
  })

  test('Test 2', () => {
    const line = new TypingLine('漆黒[しっこく]のこの世界[せかい]に', 0, 0, romanizer)
  })
})
