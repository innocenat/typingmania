TypingMania NEO
===============

**NOTE: This README is incomplete**

- [x] Game is completed
- [x] Command line script to build song data (from .ass file)
- [ ] Script to convert from the old TypingMania format
- [ ] Preview for song file
- [ ] Dedicated HTML Song Editor
- [ ] DOCUMENTATION!
- [ ] This README File
- [ ] Redistributable release (you can also make one with `npm run build`)
- [ ] Initial song pack
- [ ] Demo server

----

TypingMania is a song lyrics typing game. You can also think of it like
Karaoke, but typing version.

Table of Content
----------------
- [How to Play](#how-to-play)
- [Creating New Song](#creating-new-song)
- [Score Calculation](#score-calculation)
- [Supported Browser](#supported-browsers)
- [History](#history)
- [Project Structure](#project-structure)
- [License & Copyright](#license--copyright)
- [日本語](#日本語)

How to Play
-----------

### Selecting song

### Typing

<details>
  <summary>Japanese Input Detail</summary>


</details>

### Score
  
Creating New Song
-----------------

### Preparing lyrics and metadata

### Timing the scripts

### Preparing media file

Score Calculation
-----------------

### Score Class

Classes are award based on the score in relative to a base score. A base score
is calculated by: `number_of_char × 1250`, when `number_of_char` refer to the
*scoring character*, or the number of minimum amount of characters required to
complete the song.

<details>
  <summary>Score ratio for each class</summary>

| Percent  | Class |
| -------- | ----- |
|   > 125% |   SSS |
|   > 110% |    SS |
|   > 105% |    S+ |
|   > 100% |     S |
|    > 95% |    A+ |
|    > 90% |     A |
|    > 85% |    B+ |
|    > 80% |     B |
|    > 75% |    C+ |
|    > 70% |     C |
|    > 60% |    D+ |
|    > 50% |     D |
|    > 40% |    E+ |
|    > 30% |     E |
|    > 20% |    F+ |
|    < 20% |     F |

</details>

<details>
  <summary>REFERENCE: TypingMania ODYSSEY Score Calculation</summary>
</details>

<details>
  <summary>REFERENCE: Original TypingMania Score Calculation</summary>
</details>

Supported Browsers
-----------------
- The latest version of Google Chrome and Mozilla Firefox.
- Untested on Microsoft Edge, but should work.
- Safari has a delay between actual and reported media time,
  resulting in a slight (but noticeable) delay of the lyrics.

History
-------

Back in 2013, I made a TypingMania Odyssey clone in JavaScript, which is
available in the `master` branch.

That version of TypingMania was almost a direct clone of TypingMania Odyssey,
except for the score calculation system which I did not reverse-engineered
at that time.

I have been trying to rewrite this project since 2016, but this attempt in
2020 is the first successful attempts. This come after a lot of advancement
in

### Different from TypingMania ODYSSEY

- It is written in HTML5 (HTML+JS), so it runs in 2021 after Adobe dropped
  Flash support in December 2020.
- Revamp UI, including change to correct terminology: Solve -> Skipped,
  Corrected Percent -> Accuracy, etc. Also include split progressbar
  for song total time.
- New score calculation algorithm (see [Score calculation](#score-calculation))
- Maybe better Japanese handling. This version accepts almost all Romaji
  sequences that result in same sentence.
- No longer differentiate between lyrics and typing line. *Furigana* must
  be added to Kanji lyrics. Most other symbols are converted automatically
  to typable text.
- Add sound effect for typing/missed/skipped line.
- **Can load video directly from YouTube**

### Different from original TypingMania

- Different score calculation.
- No auto-play mode.
- Better performance. This is much faster than the older version.
- Since original TypingMania was ODYSSEY clone,
  all ODYSSEY differences also apply.

Project Structure
-----------------
- `assets/raw` folder contains the actual assets file used.
- `assets/assets.dat` are packed assets file. This can be generated with
  `npm run build-assets`
- `data/songs.json` is the main song index file. I suggest putting all
  songs file (.typingmania) under this folder, but it is not required.
- `docs` contains documentation-related material.
- `latin-table` is a folder containing transliterating table for the game.
   Check `README` in that folder for more detail.
- `scripts` contains nodejs scripts for processing game media, etc.
- `src` is the main source code folder.

License & Copyright
--------------------
The code and assets are copyrighted under the term of the Apache 2.0 license.

This game use [Dustyroom Casual Game Sound - One Shot SFX Pack](http://dustyroom.com/free-casual-game-sounds/).

This game also use the Iosevka Etoile, Noto Sans CJK JP, and Open Sans fonts.
Iosevka font family is licensed under SIL Open Font License. Noto Sans and
Open Sans font famlies are licensed under the Apache 2.0 License.

When creating a song to use with the game, make sure you have proper right to
the video/audio used. TypingMania NEO and its developer does not take
responsibility for managing the copyright of content used.

日本語
------
TypingMania NEOは歌の歌詞に合わせてタイピングするタイピングソフトです。元々のTypingMania ODYSSEYは
SightSeeker Studioを開発してきました。でも、開発は2009年に停止してしまいました。SightSeeker Studioの
TypingManiaはAdobe Flashで開発しました。

2013年に、私はHTML5によるTypingManiaのパクリのソフトを開発し、2021年にこのTypingMania NEOを完成しました。
HTML5でどんなブラウザにもプレイできます。YouTubeの音源としても利用できるようにしました。2020年をもって
Adobe Flashサポート終了を伴い、TypingMania ODYSSEYはプレイできなくなりまして、TypingMania NEOを誕生しました。

### 対応ブラウザ
- 最新型のGoogle Chrome, Mozilla Firefox
- Safariの音声はちょっと遅れて、歌詞のタイミングが合わない場合が多い。

