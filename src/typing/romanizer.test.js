import Romanizer from './romanizer.js'
import latinTable from '../../latin-table/latin-table.js'
import { test } from '@jest/globals'

const romanizer = new Romanizer(latinTable)

describe('Latin table are imported correctly', () => {
  test('Max group length is 3', () => {
    expect(romanizer.max_token_len).toBe(3)
  })
  test('Table length is 1546', () => {
    expect(Object.keys(romanizer.table)).toHaveLength(1546)
  })
})

describe('Typing character must remove non-ASCII character', () => {
  test('ASCII are not removed', () => {
    expect(romanizer.filterTyping('ABCDEFGHIJKLMNOPQRSTUVWZYX')).toBe('ABCDEFGHIJKLMNOPQRSTUVWZYX')
    expect(romanizer.filterTyping('abcdefghijklmnopqrstuvwxyz')).toBe('abcdefghijklmnopqrstuvwxyz')
    expect(romanizer.filterTyping('0123456789')).toBe('0123456789')
    expect(romanizer.filterTyping(' !"#$%&\'()*+,-./:;<=>?[]\\{}^_`')).toBe(' !"#$%&\'()*+,-./:;<=>?[]\\{}^_`')
  })
  test('Non-ASCII are removed', () => {
    expect(romanizer.filterTyping('ＡＢＣＤＥＦＧ')).toBe('')
  })
  test('Mixed ASCII and non-ASCII removal are correct', () => {
    expect(romanizer.filterTyping('ＡAＢBＣCＤDＥEＦFＧG')).toBe('ABCDEFG')
  })
})

describe('The reading splitter works correctly', () => {
  test('Latin character are all separated.', () => {
    expect(romanizer.splitReading('ABCD EFG')).toEqual([
      [['A'], ['B'], ['C'], ['D'], [' '], ['E'], ['F'], ['G']],
      ['A', 'B', 'C', 'D', ' ', 'E', 'F', 'G'],
    ])
  })
  test('Japanese full-width kana', () => {
    expect(romanizer.splitReading('あっちゃんのしゃべりかた')).toEqual([
      [['a'], [':SMALL_TSU', 'xtu', 'xtsu'], ['tya', 'tixya', 'cha', 'chixya'],
        ['n', 'nn'], ['no'], ['sya', 'sixa', 'sha', 'shixya'], ['be'], ['ri'], ['ka'], ['ta']],
      ['あ', 'っ', 'ちゃ', 'ん', 'の', 'しゃ', 'べ', 'り', 'か', 'た'],
    ])
    expect(romanizer.splitReading('フィロソフィー　いいね！')).toEqual([
      [['fi', 'fuxi', 'huxi'], ['ro'], ['so'], ['fi', 'fuxi', 'huxi'], ['-'], ['', ' '], ['i'], ['i'], ['ne'], ['!']],
      ['フィ', 'ロ', 'ソ', 'フィ', 'ー', '　', 'い', 'い', 'ね', '！'],
    ])
  })
  test('Japanese half-width kana', () => {
    expect(romanizer.splitReading('ﾌﾞﾀﾞﾍﾟｽﾄ')).toEqual([
      [['bu'], ['da'], ['pe'], ['su'], ['to']],
      ['ﾌﾞ', 'ﾀﾞ', 'ﾍﾟ', 'ｽ', 'ﾄ'],
    ])
  })
  test('Greek letter should throw', () => {
    expect(() => {
      romanizer.splitReading('Α α, Β β, Γ γ')
    }).toThrow()
  })
  test('Other cases to look out for', () => {
    expect(romanizer.splitReading('ルーシェ')).toEqual([
      [['ru'], ['-'], ['sye', 'sixe', 'she', 'shixe']],
      ['ル', 'ー', 'シェ'],
    ])
  })
})
