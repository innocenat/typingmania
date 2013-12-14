TypingMania Typing Game
=======================

TypingMania is a song type-a-long game, aiming to be a clone of TypingMania Odyssey
by [SightSeeker Studio](http://www.sightseekerstudio.com/typingmania/). The main reason
being that SS Studio version is very hard to install and set up properly. (I admit, I
can't set it up, that's why I write this instead) Also, XML setting used by that version
is pain to config.

Feature
-------
 - Multiple input of each Hiragana available (use Katakana to force reading to be specific)
 - Easy to setup
 - HTML5
 - Basically, most thing SS Studio version offers.

Roadmap
-------
 - Song search
 - Much prettier menu
 - Cache setting/song lyrics in local storage

TypingMania Odyssey Compatibility
---------------------------------

 With import script (documentation pending), most TypingMania installation can be converted to be used with
 this engine at ease. There are some limitation though:

  - TypingMania Odyssey allow malformed XML as its data file. The conversion script can take care
    of simple errors, but sometime XML parse error might occur during conversion.
  - Video-based song is not supported, nor will be supported in this engine in foreseeable future.
  - .flv as background isn't support, nor will be supported.
  - Apart from that, import and conversion should be perfect.

Engine compatibility:
  - TypingMania Odyssey seems to accept keytype a little bit early than real timestamp. This engine
   	does not allow such thing. The `.ass` => `.json` conversion script automatically take care
   	of this by padding every timestamp by 100ms. The Odyssey import script does this too, but some
   	song might still not work as expected.
  - Rank AA became S; AAA became SS.
  - Scoring is much harsher in this engine. Rank SS can only be obtained by 100% game.
  - The UI is almost the same; however, the tune bar are not possible in Javascript and does not present.

Installation
------------

You need following software:

 - Web server (any of them; it just has to serve static content)
 - Browser — only Firefox and Chrome tested and supported, though it should also work on IE10
   or any recent standard-compliant browser. Mobile browser not supported obviously.
 - Python 3.x (for song generation script)

To install, just drop the whole download (perhaps without scripts directory) into
folder accessible by your web server.

If you grab repository clone, make sure you grab additional data [here](#) or
create one yourself (main background and song list).

### Advanced version

In reality, you only need <code>typing.js</code> to run the whole game. But it depends on
quite number of library that need to be inclued before:

 - Google WebFont Loader
 - jQuery (2.0.x preferred)
 - SoundJS 0.5
 - PreloadJS 0.4
 - jStorage 0.4.4

You will want <code>kanatable.js</code> too if you want automatic Kana-to-Romaji
conversion in your song.

Adding new songs
----------------

The preferred workflow include using Aegisub for lyrics timing, as shown here:

![Aegisub](http://innocenat.github.io/images/typingmania-aegisub.jpg)

Basically, you put a lyrics in with "Actor" as <code>lyrics</code>. And if you want a separated
line to be typed in game, have another line with actor set as <code>typing</code> with **exactly**
same time as the lyrics. Hiragana will be converted to romaji automatically if
<code>kanatable.js</code> is loaded. Make sure <code>typing</code> comes after
<code>lyrics</code> or conversion might fail.

Lines with other actor are threated as metadata. Essential metadata are <code>composer</code>,
<code>title</code> and <code>subtitle</code>. Other metadata are currently not shown at all.

Metadata can be in two languages, prefixes by <code>-en</code> and <code>-jp</code>. You can
use <code>Tab</code> button to change between language in-game.

To prepare your song file, re-encode it in <code>mp3</code> format to give best compatibility
with browsers. Also, re-sample the song to 48KHz. I recommend you encode it at 128kbps

Name the <code>.ass</code> (data & lyrics), <code>.mp3</code> (songs), <code>.jpg</code>
(background image) the same, then runs  <code>convert.py file.ass</code>. Then you are
ready to go. Don't forget to add path to your newly generated JSON file to your
<code>songs.json</code>.

Troubleshoot
------------

#### `Fatal error: Please contact webmaster or try again.`

Check to make sure all your path are correct. This include `data/settings.json` and
`data/background.jpg`, `_index.json` in your `songs` directory, and all file refered
in your `_index.json` are available.

#### Song does not start, it just freezes at 0:00

Go back to menu and try again. This is limitation of browser audio support and precise timing.

#### Audio in menu sound does not play properly

Again, this is limitation of browser audio support. This cannot be helped.

#### Song loading progressbar is broken

Until browser start reporting progress for audio load, it cannot be helped.

#### Controls on-screen are misplaced.

A very unfortunate timing. Try resizing the window again. This is due to
design that try to minimize costly DOM access.

License
-------

	The MIT License (MIT)
	
	Copyright (c) 2013 Nat Pavasant
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


