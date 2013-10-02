/**
 * TypingMania Main File
 * ----------------------------------------------
 * Copyright 2013 (c) Nat Pavasant
 * Available under the term of MIT License
 * See LICENSE file for more detail
 */

/**
 * This class is specifically to handle
 * japanese Kana that can be entered in multiple way
 */
var TypingChar = (function() {
    function TypingChar(character) {
        this.input = "";
        this.possible = Kana.getPossibleRomaji(character.toLowerCase());
        this.complete = false;
        this.display = this.possible[0];
    }

    TypingChar.prototype.accept = function (character) {
        var tmpText = this.input + character;
        var accept = false;
        var _this = this;
        this.possible.forEach(function (c) {
            if (c.length == tmpText.length && c == tmpText) {
                accept = true;
                _this.complete = true;
            } else if (c.length > tmpText.length && c.substring(0, tmpText.length) == tmpText) {
                accept = true;
            }
        });

        if (accept) {
            this.input += character;
            this.recalculateDisplay();
        }

        return accept;
    };

    TypingChar.prototype.getDisplay = function () {
        return this.display;
    };

    TypingChar.prototype.isComplete = function () {
        return this.complete;
    };

    TypingChar.prototype.recalculateDisplay = function() {
        if (this.complete) {
            this.display = "";
            return;
        }
        var tmp = this.possible[0];
        var _this = this;
        this.possible.forEach(function (c) {
            if (_this.input.length <= c.length && _this.input == c.substring(0, _this.input.length)) {
                var t = c.substring(_this.input.length, c.length);
                if (t.length < tmp.length) {
                    tmp = t;
                }
            }
        });
        this.display = tmp;
    };

    return TypingChar;
})();

/**
 * This class is to handle Japanese word that need to be group and
 * display in word using CSS
 */
var TypingWord = (function() {
    function TypingWord(typingWord) {
        this.typing = typingWord;
        var typingList = Kana.splitKana(typingWord);
        var typingItem = [];
        typingList.forEach(function (c) {
            typingItem.push(new TypingChar(c));
        });
        this.typingItem = typingItem;
        this.currentItem = 0;
    }

    TypingWord.prototype.accept = function (c) {
        if (this.isComplete())
            return false;
        var accept = this.typingItem[this.currentItem].accept(c);
        if (accept && this.typingItem[this.currentItem].isComplete()) {
            this.currentItem++;
        }
        if (!accept && this.currentItem > 0) {
            accept = this.typingItem[this.currentItem-1].accept(c);
        }
        return accept;
    };

    TypingWord.prototype.isComplete = function () {
        return this.currentItem >= this.typingItem.length;
    };

    TypingWord.prototype.getDisplay = function () {
        var ret = "";
        this.typingItem.forEach(function (i) {
            ret += i.getDisplay();
        });
        return ret;
    };

    return TypingWord;
})();

/**
 * This is typing item class. English songs only need this, but
 * to handle Japanese nicely it need two classes about too.
 */
var Typing = (function() {
    function Typing(typing) {
        this.typing = typing;
        var typingWords = [];
        typing.forEach(function (c) {
            typingWords.push(new TypingWord(c));
        });
        this.typingWords = typingWords;
        this.currentWord = 0;
    }

    Typing.prototype.accept = function (c) {
        if (this.isComplete())
            return false;
        var accept = this.typingWords[this.currentWord].accept(c);
        if (accept && this.typingWords[this.currentWord].isComplete()) {
            this.currentWord++;
        }
        return accept;
    };

    Typing.prototype.isComplete = function () {
        return this.currentWord >= this.typingWords.length;
    };

    Typing.prototype.getDisplay = function () {
        var ret = "";
        this.typingWords.forEach(function (i) {
            if (!i.isComplete())
                ret += '<span class="word">' + i.getDisplay().replace(/ /g, "_") + '</span>';
        });
        return ret;
    };

    return Typing;
})();

var Song = (function() {
    function Song(basePath, file) {
        this.song = null;
        this.data = null;

        this.basePath = basePath;
        this.currentVerse = -1;
        this.isInVerse = true;
        this.isLoading = false;
        this.isPlaying = false;

        var _this = this;
        jQuery.getJSON(basePath + "/" + file, function(data) {
            _this.setData(data)
        });
    }

    Song.queue = new createjs.LoadQueue();
    Song.queue.installPlugin(createjs.Sound);
    Song.currentSong = null;
    Song.currentTyping = null;

    Song.setSong = function (song) {
        if (this.currentSong != null)
            Song.closeSong();
        this.currentSong = song;
    };

    Song.closeSong = function () {
        if (this.currentSong != null) {
            this.currentSong.stop();
            this.currentSong.isLoading = false;
            this.currentSong.isPlaying = false;
        }
        Song.queue.removeAll();
        Song.queue.removeAllEventListeners("complete");
        // TODO clear playing song too
    };

    Song.handleKey = function (event) {
        var code = event.which;
        var input = '';
        if (code == '32') {
            input = ' ';
        } else if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
            input = String.fromCharCode(code).toLowerCase();
        } else if (code >= 96 && code <= 105) { // Numpad
            input = String.fromCharCode(code-48).toLowerCase();
        } else switch (code) {
            case 188: input = ','; break;
            case 189: input = '-'; break;
            case 190: input = '.'; break;
            case 191: input = '/'; break;
            case 219: input = '('; break;
            case 220: input = '\\'; break;
            case 221: input = ')'; break;
            case 222: input = '\''; break;
            case  27: input = 'Esc'; break;
            case  38: input = 'Up'; break;
            case  40: input = 'Down'; break;
            case  37: input = 'Left'; break;
            case  39: input = 'Right'; break;
        }

        if (Song.currentTyping != null) {
            Song.currentTyping.accept(input);
        }
    };

    Song.mainLoop = function () {
        if (this.currentSong != null && this.currentSong.isPlaying) {
            var changed = this.currentSong.process(this.currentSong.getTime());
            var cur = this.currentSong.getCurrentVerse();
            var next = this.currentSong.getNextVerse();
            if (changed) {
                Song.currentTyping = new Typing(cur['typing']);
            }
            $("#lyrics").html(cur["lyrics"]);
            $("#lyrics-next").html(next["lyrics"]);
            if (Song.currentTyping != null)
                $("#typing").html(Song.currentTyping.getDisplay());
        }
    };

    Song.prototype.process = function (time) {
        var ret = false;

        if (this.currentVerse+1 < this.getLineCount() && time >= this.data['event'][this.currentVerse+1]["start"]) {
            this.currentVerse++;
            ret = true;
        } else if (this.currentVerse == this.getLineCount()-1 && time >= this.data['event'][this.currentVerse]["end"]) {
            this.currentVerse++;
            ret = true;
        }

        if (this.currentVerse >= 0 && this.currentVerse < this.getLineCount()) {
            if (time >= this.data['event'][this.currentVerse]["start"] && time < this.data['event'][this.currentVerse]["end"]) {
                this.isInVerse = true;
            } else {
                this.isInVerse = false;
                ret = true;
            }
        }

        return ret;
    };

    Song.prototype.getCurrentVerse = function () {
        if (this.currentVerse < 0 || this.currentVerse >= this.getLineCount() || !this.isInVerse) {
            return {
                "lyrics": "",
                "typing": []
            };
        } else {
            return {
                "lyrics": this.getLyric(this.currentVerse),
                "typing": this.getTyping(this.currentVerse)
            };
        }
    };

    Song.prototype.getNextVerse = function () {
        if (this.currentVerse+1 >= this.getLineCount())
            return {
                "lyrics": "",
                "typing": []
            };
        return {
            "lyrics": this.getLyric(this.currentVerse+1),
            "typing": this.getTyping(this.currentVerse+1)
        };
    };

    Song.prototype.getTime = function () {
        return this.song.getPosition();
    };

    Song.prototype.getDuration = function() {
        return this.song.getDuration();
    };

    Song.prototype.getLineCount = function() {
        return this.data["event"].length;
    };

    Song.prototype.getLyric = function (line) {
        return this.data["event"][line]["lyric"];
    };

    Song.prototype.getTyping = function (line) {
        if ("typing" in this.data["event"][line])
            return this.data["event"][line]["typing"];
        return [this.data["event"][line]["lyric"]];
    };

    Song.prototype.play = function () {
        if (!this.isPlaying)
            this.song.play();
        this.isPlaying = true;
    };

    Song.prototype.beginLoading = function() {
        if (!this.isInit() || this.isLoading)
            return false;
        var _this = this;
        Song. queue.loadFile({
            id: _this.key,
            src: _this.basePath + "/" + _this.data['file']
        });
        Song.queue.on("complete", function() {
            _this.downloadComplete();
        });
        this.isLoading = true;
    };

    Song.prototype.downloadComplete = function () {
        this.song = createjs.Sound.createInstance(this.key);
        Song.queue.off("complete", this.downloadComplete);
    };

    Song.prototype.setData = function (data) {
        this.data = data;
        this.key = data["key"];
    };

    Song.prototype.getData = function (info) {
        return this.data['info-' + info];
    };

    Song.prototype.isReady = function() {
        return this.song != null && this.data != null;
    };

    Song.prototype.isInit = function() {
        return this.data != null;
    };

    return Song;
})();

/// ///////////////////////
/// Graphical

// Viewport for auto-resizing
var Viewport = (function() {
    function Viewport() {}

    // This is width and height the game component will be located at.
    Viewport.STD_WIDTH = 1280;
    Viewport.STD_HEIGHT = 720;

    Viewport.elements = {};
    Viewport.width = 800;
    Viewport.height = 600;
    Viewport.top = 0;
    Viewport.left = 0

    Viewport.onResize = function () {
        var widthToHeight = Viewport.STD_WIDTH / Viewport.STD_HEIGHT;
        var newWidth = window.innerWidth * 0.95;
        var newHeight = window.innerHeight * 0.95;
        var newWidthToHeight = newWidth / newHeight;

        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
        } else {
            newHeight = newWidth / widthToHeight;
        }

        Viewport.width = newWidth;
        Viewport.height = newHeight;

        Viewport.left = (window.innerWidth - newWidth) / 2;
        Viewport.top = (window.innerHeight - newHeight) / 2;

        Viewport.resizeAll();
    };

    Viewport.position = function (c, x, y, w, h, fs) {
        if (w == undefined)
            w = 0;
        if (h == undefined)
            h = 0;
        var obj = {};
        if (c in Viewport.elements)
            obj = Viewport.elements[c];
        else {
            var obj = {
                x: x,
                y: y,
                w: w,
                h: h,
                fs: fs
            };
            Viewport.elements[c] = obj;
        }

        var css = {
            position: "absolute"
        };
        css.left = "" + (Viewport.left + x * Viewport.width / Viewport.STD_WIDTH) + "px";
        css.top  = "" + (Viewport.top + y * Viewport.height / Viewport.STD_HEIGHT) + "px";
        css["font-size"] = "" + (fs * Viewport.height / Viewport.STD_HEIGHT) + "px";
        if (w != 0 && h != 0) {
            css.overflow = "hidden";
            css.width = "" + (w * Viewport.width / Viewport.STD_WIDTH) + "px";
            css.height = "" + (h * Viewport.height / Viewport.STD_HEIGHT) + "px";
        }
        $(c).css(css);
    };

    Viewport.resizeAll = function () {
        for (c in Viewport.elements) {
            var cc = Viewport.elements[c];
            Viewport.position(c, cc.x, cc.y, cc.w, cc.h, cc.fs)
        }
    };

    (function($) {
        $.pos = Viewport.position;
    })(jQuery);

    return Viewport;
})();


// Hacking DOM WORK
$(window).keydown(Song.handleKey);
$('body').append('<div class="box">&nbsp;</div>' +
    'Next: <span id="lyrics-next"></span><br/>' +
    'Current: <span id="lyrics"></span>' +
    '<div id="typing"></div>');

$.pos('#typing', 400, 300, 0, 0, 24);
$.pos('.box', 0,0,1280,720);

var Graphics = (function() {

})();

/// ////////////////////////
/// Startup
Viewport.onResize();
$(window).on("resize", Viewport.onResize);


var s = new Song("songs/Real World (TV ver.)", "real-world.json");
Song.setSong(s);
setInterval(function() {
    if (!s.isReady())
        s.beginLoading();
    else if (!s.isPlaying)
        s.play();
    Song.mainLoop();
}, 20);

