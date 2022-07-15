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
    expect(new TypingLine('今[いま]でも生[い]きているストーリーズ?', 0, 0, romanizer).tokens).toEqual([
      ['今', 'いま', true], ['で', 'で', false], ['も', 'も', false], ['生', 'い', true],
      ['き', 'き', false], ['て', 'て', false], ['い', 'い', false], ['る', 'る', false],
      ['ス', 'ス', false], ['ト', 'ト', false], ['ー', 'ー', false],
      ['リ', 'リ', false], ['ー', 'ー', false], ['ズ', 'ズ', false], ['?', '?', false],
    ])
  })
  test('Japanese tokenization with reading', () => {
    expect(new TypingLine('今[いま]でも生[い]きている<<ストーリーズ>>[stories]<<?>>[]', 0, 0, romanizer).tokens).toEqual([
      ['今', 'いま', true], ['で', 'で', false], ['も', 'も', false], ['生', 'い', true],
      ['き', 'き', false], ['て', 'て', false], ['い', 'い', false], ['る', 'る', false],
      ['ストーリーズ', 'stories', true],  ['?', '', false],
    ])
  })
  test('Japanese tokenization with reading (new syntax)', () => {
    expect(new TypingLine('今[いま]でも生[い]きている<ストーリーズ>[stories]<?>[]', 0, 0, romanizer).tokens).toEqual([
      ['今', 'いま', true], ['で', 'で', false], ['も', 'も', false], ['生', 'い', true],
      ['き', 'き', false], ['て', 'て', false], ['い', 'い', false], ['る', 'る', false],
      ['ストーリーズ', 'stories', true],  ['?', '', false],
    ])
  })
  test('Japanese ruby with split reading', () => {
    expect(new TypingLine('先生[せん|せい]', 0, 0, romanizer).tokens).toEqual([
      ['先', 'せん', true], ['生', 'せい', true]
    ])
  })
  test('Japanese ruby with extra split reading should be ignored', () => {
    expect(new TypingLine('先生[せ|ん|せい]', 0, 0, romanizer).tokens).toEqual([
      ['先生', 'せんせい', true]
    ])
  })
  test('Kanji with no reading must throw', () => {
    expect(() => {
      new TypingLine('漢字', 0, 0, romanizer)
    }).toThrow()
    expect(() => {
      new TypingLine('漢字ある', 0, 0, romanizer)
    }).toThrow()
  })
  test('Escaped character', () => {
    expect(new TypingLine('a\\bcd', 0, 0, romanizer).tokens).toEqual([
      ['a', 'a', false], ['b', 'b', false], ['c', 'c', false], ['d', 'd', false],
    ])
    expect(new TypingLine('a\\\\bcd', 0, 0, romanizer).tokens).toEqual([
      ['a', 'a', false], ['\\', '\\', false], ['b', 'b', false], ['c', 'c', false], ['d', 'd', false],
    ])
    expect(new TypingLine('a\\<b\\>cd', 0, 0, romanizer).tokens).toEqual([
      ['a', 'a', false], ['<', '<', false], ['b', 'b', false], ['>', '>', false], ['c', 'c', false], ['d', 'd', false],
    ])
    expect(() => {
      new TypingLine('先生\\[せ|ん|せい\\]', 0, 0, romanizer)
    }).toThrow()
  })
})

describe('Line must accept correctly', () => {
  test('Test 1', () => {
    const line = new TypingLine('漢字[かんじ]|ある　なのに　ABC DEF', 0, 0, romanizer)
    expect(line.getRemainingText()).toBe('KANJI\xA0\xA0ARU\xA0\xA0NANONI\xA0\xA0ABC_DEF')
    expect(line.accept('k')).toBe(1)
    expect(line.accept('a')).toBe(1)
    expect(line.accept('n')).toBe(1)
    expect(line.getRemainingText()).toBe('JI\xA0\xA0ARU\xA0\xA0NANONI\xA0\xA0ABC_DEF')
    expect(line.accept('n')).toBe(0)
    expect(line.getRemainingText()).toBe('JI\xA0\xA0ARU\xA0\xA0NANONI\xA0\xA0ABC_DEF')
    expect(line.accept('j')).toBe(1)
    expect(line.getRemainingText()).toBe('I\xA0\xA0ARU\xA0\xA0NANONI\xA0\xA0ABC_DEF')
    expect(line.accept('i')).toBe(1)
    expect(line.getRemainingText()).toBe('ARU\xA0\xA0NANONI\xA0\xA0ABC_DEF')
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
