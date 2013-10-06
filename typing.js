/**
 * TypingMania Main File
 * ----------------------------------------------
 * Copyright 2013 (c) Nat Pavasant
 * Available under the term of MIT License
 * See LICENSE file for more detail
 */

// Default background image used during game preloading.
var BACKGROUND = 'data/background.jpg';

// Song list and main configuration file.
var SONGLIST   = 'data/songs.json';

// Interval to draw game. In millisecond.
// Default to 20ms, which translated to 50fps
var INTERVAL   = 20;

// TODO Create MENU Screen
// TODO Beautify the screen
// TODO Add scoring system (with local storage)
// TODO error report

/// ///////////////////////
// Helper

/**
 * This is utilities for class extending. It's copied from
 * TypeScript-generated file.
 *
 * @param d   descendant class
 * @param b   base class
 */
var $extends = function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];

    function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
};

/// ///////////////////////
/// Song Engine
/**
 * Handle each character specifically Japanese Kana
 * that can be input multiple ways.
 */
var TypingChar = (function() {
    function TypingChar(character) {
        this.input = "";
        // TODO Add sanitization
        this.possibleInput = Kana.getPossibleRomaji(character.toLowerCase());
        this.complete = false;
        this.remainingText = this.possibleInput[0];
    }

    TypingChar.prototype.accept = function (character) {
        var accept = false;
        var _this = this;

        // Loop through each possible input to see if current input fits.
        var tmpText = this.input + character;
        this.possibleInput.forEach(function (c) {
            if (c.length == tmpText.length && c == tmpText) {
                accept = true;
                _this.complete = true;
            } else if (c.length > tmpText.length && c.substring(0, tmpText.length) == tmpText) {
                accept = true;
            }
        });

        if (accept) {
            this.input += character;
            this.recalculateRemainingText();
        }

        // TODO return whether this count as correct input or not, and if it is, then return number of character
        // (Will be used for score calculation)
        return accept;
    };

    TypingChar.prototype.getRemainingText = function () {
        return this.remainingText;
    };

    TypingChar.prototype.isComplete = function () {
        return this.complete;
    };

    TypingChar.prototype.recalculateRemainingText = function() {
        if (this.complete) {
            this.remainingText = "";
            return;
        }

        var tmp = this.possibleInput[0];
        var _this = this;
        this.possibleInput.forEach(function (c) {
            if (_this.input.length <= c.length && _this.input == c.substring(0, _this.input.length)) {
                var t = c.substring(_this.input.length, c.length);
                if (t.length < tmp.length) {
                    tmp = t;
                }
            }
        });

        this.remainingText = tmp;
    };

    return TypingChar;
})();

/**
 * Handle each typing group that will be separated by a non-typing
 * space. Basically this just proxy to {@link TypingChar}.
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

        // TODO make backward fallback too for sequence of same character
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

    TypingWord.prototype.getRemainingText = function () {
        var ret = "";
        this.typingItem.forEach(function (i) {
            ret += i.getRemainingText();
        });
        return ret;
    };

    return TypingWord;
})();

/**
 * Main typing class, but basically just proxy to {@link TypingWord}.
 * The reason we need three classes for this is because Japanese IME
 * input is complex.
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

        // TODO make the input across word boundary like in TypingWord
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
                // TODO make it more pretty and maybe dom-based only
                ret += '<span class="word">' + i.getRemainingText().replace(/ /g, "_").toUpperCase() + '</span>';
        });
        return ret;
    };

    Typing.prototype.getCharLeft = function () {
        var ret = 0;
        this.typingWords.forEach(function (i) {
            if (!i.isComplete())
                ret += i.getRemainingText().length;
        });
        return ret;
    };

    Typing.prototype.getNextChar = function () {
        var ret = 0;
        this.typingWords.forEach(function (i) {
            if (!i.isComplete() && ret == 0)
                ret = i.getRemainingText().charAt(0);
        });
        return ret;
    };

    return Typing;
})();

/**
 * Handle everything song-related
 */
var Song = (function() {
    function Song(json, basePath) {
        this.data = json;
        this.basePath = basePath;
        this.audio = null;
        this.image = null;

        this.id = json.id;

        this.currentVerse = -1;
        this.isInVerse = false;

        this.isLoading = false;
        this.isLoaded = false;
        this.isPlaying = false;
        this.loadingProgress = 0;
        this.imageLoading = false;

        this.typing = null;
    }

    Song.prototype.handleKey = function (input) {
        if (this.typing != null) {
            return this.typing.accept(input);
        }
        return false;
    };

    Song.prototype.getDisplay = function () {
        if (this.typing != null)
            return this.typing.getDisplay();
        return "";
    };

    Song.prototype.tick = function () {
        if (!this.isPlaying)
            return false;

        var ret = false;
        var time = this.getTime();

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
        } else {
            this.isInVerse = false;
        }

        if (ret) {
            this.typing = new Typing(this.getCurrentVerse()['typing']);
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
        else if (this.currentVerse >= 0 && this.currentVerse+1 < this.getLineCount() && this.isInVerse
            && this.data["event"][this.currentVerse]["end"] != this.data["event"][this.currentVerse+1]["start"])
            return {
                "lyrics": "",
                "typing": []
            };
        return {
            "lyrics": this.getLyric(this.currentVerse+1),
            "typing": this.getTyping(this.currentVerse+1)
        };
    };

    Song.prototype.getTimeUntilNextLine = function () {
        if (this.isInVerse) {
            return this.data["event"][this.currentVerse]["end"] - this.getTime();
        } else if (this.currentVerse+1 < this.getLineCount()) {
            return this.data["event"][this.currentVerse+1]["start"] - this.getTime();
        } else {
            return this.getDuration() - this.getTime();
        }
    };

    Song.prototype.getCurrentSectionTime = function () {
        if (this.isInVerse) {
            return this.data["event"][this.currentVerse]["end"] - this.data["event"][this.currentVerse]["start"];
        } else if (this.currentVerse == -1) {
            return this.data["event"][0]["start"];
        } else if (this.currentVerse+1 < this.getLineCount()) {
            return this.data["event"][this.currentVerse+1]["start"] - this.data["event"][this.currentVerse]["end"];
        } else {
            return this.getDuration() - this.data["event"][this.getLineCount()-1]["end"];
        }
    };

    Song.prototype.getTime = function () {
        return this.audio.getPosition();
    };

    Song.prototype.getDuration = function() {
        return this.audio.getDuration();
    };

    Song.prototype.getProgress = function () {
        return this.getTime() / this.getDuration();
    };

    Song.prototype.getLineCount = function() {
        return this.data["event"].length;
    };

    Song.prototype.getLyric = function (line) {
        return this.data["event"][line]["lyric"];
    };

    Song.prototype.isComplete = function () {
        return this.currentVerse == this.getLineCount();
    };

    Song.prototype.getTyping = function (line) {
        if ("typing" in this.data["event"][line])
            return this.data["event"][line]["typing"];
        return [this.data["event"][line]["lyric"]];
    };

    Song.prototype.getData = function (info) {
        return this.data['info-' + info];
    };

    Song.prototype.getAudioURL = function () {
        return this.basePath + '/' + this.data['file'];
    };

    Song.prototype.getLoadProgress  = function () {
        return this.loadingProgress;
    };

    Song.prototype.isReady = function() {
        return this.audio != null && this.isLoaded;
    };

    Song.prototype.play = function () {
        if (!this.isLoaded || this.audio == null)
            return false;

        if (!this.isPlaying)
            this.audio.play();

        this.isPlaying = true;
        return true;
    };

    Song.prototype.stop = function () {
        if (this.isPlaying)
            this.audio.stop();
        if (this.isLoading)
            this.cancel();

        this.isPlaying = false;
        this.isLoading = false;
    };

    Song.prototype.load = function () {
        if (this.isLoading)
            return false;

        console.log("Begin loading song...");

        var _this = this;
        AssetManager.load(this.id + "_audio", this.getAudioURL(), function (id) {
            _this.isLoaded = true;
            _this.isLoading = false;
            _this.loadingProgress = 1;
            _this.audio = createjs.Sound.createInstance(id);
            console.log("Song " + _this.id + " loaded.");
        }, true, function (_, progress) {
            _this.loadingProgress = progress;
        });

        this.isLoading = true;
        return true;
    };

    Song.prototype.cancel = function () {
        AssetManager.remove(this.key + "_audio");
    };

    Song.prototype.loadImage = function () {
        if (this.imageLoading)
            return;

        this.imageLoading = true;
        var _this = this;
        AssetManager.load(this.id + "_image", this.basePath + '/' + this.data['image'], function (id) {
            _this.image = new Image(id, 0, 0, 1280, 720);
            _this.image.z(10);
        });
    };

    return Song;
})();

/// ///////////////////////
/// Other Engine

/**
 * Store current game state and facilitate the state transition.
 */
var State = (function() {
    function State() {}

    // List of available states
    State.PRELOAD = 0;
    State.MENU    = 1;
    State.PRESONG = 2;
    State.SONG    = 3;
    State.SCORE   = 4;

    State.current = State.PRELOAD;
    State.transitioning = false;

    State.is = function (c) {
        return c == State.current;
    };

    State.to = function (state) {
        if (state < 0 && state > 4) {
            return;
        }

        if (State.transitioning)
            return;

        var callback = function () {
            State.transitioning = false;
            State.current = state;
            switch (state) {
                // No State.PRELOAD because nothing should transit to
                // that state
                case State.MENU:
                    MenuScreen.onIn();
                    break;
                case State.PRESONG:
                    PresongScreen.onIn();
                    break;
                case State.SONG:
                    SongScreen.onIn();
                    break;
                case State.SCORE:
                    ScoreScreen.onIn();
                    break;
            }
        };

        State.transitioning = true;
        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.onOut(callback);
                break;
            case State.MENU:
                MenuScreen.onOut(callback);
                break;
            case State.PRESONG:
                PresongScreen.onOut(callback);
                break;
            case State.SONG:
                SongScreen.onOut(callback);
                break;
            case State.SCORE:
                ScoreScreen.onOut(callback);
                break;
        }
    };

    return State;
})();

/**
 * Manage songs list and various utilities
 */
var SongManager = (function() {
    function SongManager() {}

    // Main game data
    SongManager.songData = null;

    // List of available song
    SongManager.songs = {};

    // Current song
    SongManager.song = null;

    // Related to automatic background changing
    // TODO move this to dedicated class
    SongManager.imgTransitioning = false;
    SongManager.currentImage = null;

    SongManager.initSongData = function (songData) {
        SongManager.songData = songData;

        songData.forEach(function (c) {
            // TODO make this more elegant
            PreloadScreen.loadFile(c[0] + "_data", c[1] + '/' + c[2], function(_, result) {
                SongManager.songs[c[0]] = new Song(result, c[1]);
            });
        });
    };

    SongManager.tick = function () {
        if (SongManager.song != null) {
            SongManager.song.tick();

            var song = SongManager.song;

            if (song.image == null) {
                song.loadImage();
            }

            if (!SongManager.imgTransitioning && song.image != null && !song.image.visible()) {
                song.image.z(10);
                if (SongManager.currentImage != null) {
                    SongManager.currentImage.z(15);
                    SongManager.currentImage.fadeOut('slow', function() {
                        SongManager.imgTransitioning = false;
                    });
                    song.image.show();
                } else {
                    song.image.fadeIn('slow', function() {
                        SongManager.imgTransitioning = false;
                    });
                }

                SongManager.imgTransitioning = true;
            }
        }
    };

    // Return current song if no id is specified,
    // or return song with provided id.
    SongManager.getSong = function (id) {
        if (id == undefined)
            return SongManager.song;
        return SongManager.songs[id];
    };

    SongManager.setSong = function (song) {
        if (SongManager.song != null)
            SongManager.song.stop();
        SongManager.song = song;
    };

    SongManager.formatTime = function (time) {
        var m = Math.floor(time/60000);
        var s = Math.floor(time/1000)%60;

        var ret = "" + m + ":";
        if (s < 10) ret += "0" + s;
        else        ret += "" + s;

        return ret;
    };

    SongManager.combineTyping = function (typing) {
        var ret = "";
        typing.forEach(function (c) {
            ret += c;
        });

        return ret;
    };

    return SongManager;
})();

/**
 * Manage assets preloading and callback
 */
var AssetManager = (function() {
    function AssetManager() {}

    AssetManager.queue = new createjs.LoadQueue();
    AssetManager.queue.installPlugin(createjs.Sound);
    AssetManager.status = {};
    this.complete = true;

    // TODO add error callback
    AssetManager.load = function (id, src, callback, start, progressCallback) {
        if (start == undefined)
            start = true;
        if (id in AssetManager.status) {
            callback(id, AssetManager.queue.getResult(id));
            return;
        }
        AssetManager.queue.loadFile({
            id: id,
            src: src
        }, start);
        AssetManager.status[id] = {
            status: 0,
            src: src,
            callback: callback,
            progress: progressCallback
        };
        AssetManager.complete = false;
    };

    AssetManager.remove = function (id) {
        if (id in AssetManager.status && AssetManager.status[id].status != 1) {
            AssetManager.queue.remove(id);
            delete AssetManager.status[id];
            return true;
        }
        return false;
    };

    AssetManager.onFileDownloaded = function (event) {
        var id = event.item.id;
        AssetManager.status[id].status = 1;
        AssetManager.status[id].callback(id, event.result);
    };

    AssetManager.onFileProgressed = function (event) {
        var id = event.item.id;
        if (AssetManager.status[id].progress != undefined)
            AssetManager.status[id].progress(id, event.progress);
    };

    AssetManager.onComplete = function () {
        AssetManager.complete = true;
    };

    AssetManager.isComplete = function (id) {
        if (id in AssetManager.status) {
            return AssetManager.status[id].status == 1;
        }
        return false;
    };

    AssetManager.queue.on("fileload", AssetManager.onFileDownloaded);
    AssetManager.queue.on("fileprogress", AssetManager.onFileProgressed);
    AssetManager.queue.on("complete", AssetManager.onComplete);
    AssetManager.queue.on("error", function (event) {
        console.log(event);
    });

    return AssetManager;
})();

/**
 * Keycode mapping utilities
 */
var KeyCode = (function() {
    function KeyCode() {}

    KeyCode.map = [
        [188, ','    ],
        [189, '-'    ],
        [190, '.'    ],
        [191, '/'    ],
        [219, '('    ],
        [220, '\\'   ],
        [221, ')'    ],
        [222, '\''   ],
        [ 27, 'Esc'  ],
        [ 38, 'Up'   ],
        [ 40, 'Down' ],
        [ 37, 'Left' ],
        [ 39, 'Right']
    ];

    KeyCode.fromKeyCode = function (code) {
        var input = '';
        if (code == 32) {
            input = ' ';
        } else if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
            input = String.fromCharCode(code).toLowerCase();
        } else if (code >= 96 && code <= 105) { // Numpad
            input = String.fromCharCode(code-48).toLowerCase();
        } else KeyCode.map.forEach(function (c) {
            if (c[0] == code)
                input = c[1];
        });

        return input;
    };

    KeyCode.toKeyCode = function (input) {
        input = input.toUpperCase();
        var code = input.charCodeAt(0);
        if (input == ' ') {
            code = 32;
        } else if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
            // code = code
        } else KeyCode.map.forEach(function (c) {
            if (c[1] == input)
                code = c[0];
        });
        return code;
    };

    return KeyCode;
})();

/**
 * Replacement in case the setup didn't include kanatable.js.
 * For example in case of English-song only setup
 */
var Kana = Kana || (function() {
    function KanaR() {}

    KanaR.splitKana = function (kana) {
        return [kana];
    };

    KanaR.getPossibleRomaji = function (kana) {
        return [kana];
    };

    return KanaR;
})();

/**
 * Autoplay class --- for cheating since every game need one
 */
var AutoPlay = (function() {
    function AutoPlay() {}

    AutoPlay.active = false;
    AutoPlay.lastType = 0;
    AutoPlay.interval = 1000;
    AutoPlay.currentVerse = -1;

    AutoPlay.konami = ["Up", "Down", "Down", "Left", "Right", "Left", "Right", "b", "a"];
    AutoPlay.current = 0;

    AutoPlay.begin = function () {
        AutoPlay.active = true;
        AutoPlay.current = 0;
    };

    AutoPlay.stop = function () {
        AutoPlay.active = false;
        AutoPlay.current = 0;
    };

    // Test for konami code
    AutoPlay.handleInput = function (input) {
        if (AutoPlay.current < AutoPlay.konami.length && AutoPlay.konami[AutoPlay.current] == input) {
            AutoPlay.current++;
        } else if (AutoPlay.konami[0] == input) {
            AutoPlay.current = 1;
        } else {
            AutoPlay.current = 0;
        }

        if (AutoPlay.current >= AutoPlay.konami.length) {
            AutoPlay.begin();
            console.log("AutoPlay activated.");
        }

        return AutoPlay.current != 0;
    };

    AutoPlay.tick = function () {
        if (!AutoPlay.active || SongManager.getSong() == null || SongManager.getSong().typing == null) {
            return;
        }

        var song = SongManager.getSong();

        if (AutoPlay.currentVerse != song.currentVerse) {
            AutoPlay.currentVerse = song.currentVerse;
            this.interval = Math.min(song.getTimeUntilNextLine()*0.8 / (song.typing.getCharLeft()+1), 200);
            // This is to prevent typing first character too fast
            AutoPlay.lastType = song.getTime();
        }

        if (song.getTime()-AutoPlay.lastType >= AutoPlay.interval && !song.typing.isComplete()) {
            AutoPlay.lastType = song.getTime();
            var event = $.Event('keydown', { which: KeyCode.toKeyCode(song.typing.getNextChar()) } );
            $(window).trigger(event);
        }
    };

    return AutoPlay;
})();

/// ///////////////////////
/// Graphical

/**
 * Viewport for auto resizing of of element based on browser size.
 *
 * Supports limited to font-size for text and width/height for image only.
 */
var Viewport = (function() {
    function Viewport() {}

    // This is width and height the game component will be located at.
    Viewport.STD_WIDTH = 1280;
    Viewport.STD_HEIGHT = 720;

    Viewport.elements = {};
    Viewport.width = 800;
    Viewport.height = 600;
    Viewport.top = 0;
    Viewport.left = 0;

    Viewport.sketchPercent = 1;

    Viewport.onResize = function () {
        var widthToHeight = Viewport.STD_WIDTH / Viewport.STD_HEIGHT;
        var newWidth = window.innerWidth - 3;
        var newHeight = window.innerHeight - 3;
        var newWidthToHeight = newWidth / newHeight;

        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
        } else {
            newHeight = newWidth / widthToHeight;
        }

        Viewport.width = newWidth;
        Viewport.height = newHeight;

        Viewport.sketchPercent = newWidth / Viewport.STD_WIDTH;

        Viewport.left = (window.innerWidth - newWidth) / 2;
        Viewport.top = (window.innerHeight - newHeight) / 2;

        Viewport.resizeAll();
    };

    Viewport.position = function (c, data, resizing) {
        if (!(c in Viewport.elements)) {
            Viewport.elements[c] = data;
        }

        var dx = 0, dy = 0;

        if (typeof data.align == "string") {
            var w = $(c).css('width');
            var h = $(c).css('height');

            w = w.substring(0, w.length-2);
            h = h.substring(0, h.length-2);

            if (resizing != undefined && resizing) {
                w /= (Viewport.sketchPercent);
                h /= (Viewport.sketchPercent);
            }

            data.align.split(',').forEach(function (c) {
                switch (c) {
                    case 'cx':
                        dx = w/2;
                        break;
                    case 'cy':
                        dy = h/2;
                        break;
                    case 'bx':
                        dx = w;
                        break;
                    case 'by':
                        dy = h;
                        break;
                }
            });
        }

        var css = {
            position: "absolute"
        };
        css.left = "" + (Viewport.left + (data.x-dx) * Viewport.sketchPercent) + "px";
        css.top  = "" + (Viewport.top  + (data.y-dy) * Viewport.sketchPercent) + "px";
        css["font-size"] = "" + (data.fs * Viewport.sketchPercent) + "px";
        if (data.w != 0 && data.h != 0) {
            css.overflow = "hidden";
            css.width  = "" + (data.w * Viewport.sketchPercent) + "px";
            css.height = "" + (data.h * Viewport.sketchPercent) + "px";
        }
        $(c).css(css);
    };

    Viewport.resizeAll = function () {
        for (var c in Viewport.elements) {
            if (Viewport.elements.hasOwnProperty(c)) {
                var cc = Viewport.elements[c];
                Viewport.position(c, cc, true);
            }
        }
    };

    Viewport.resizeElement = function (id) {
        if (id in Viewport.elements) {
            var cc = Viewport.elements[id];
            Viewport.position(id, cc, true);
        }
    };

    return Viewport;
})();

/**
 * Base class for all control
 */
var ControlBase = (function() {
    function ControlBase($, position) {
        this.$ = $;
        this.id = this.getID();
        this.parent = null;

        this.attr('id', this.id);
        this.css('display', 'none');

        this.$.appendTo('body');

        this.position = $.extend({}, {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            fs: 0,
            align: ''
        }, position || {});
        this.drawPosition = $.extend({}, this.position);
        Viewport.position('#' + this.id, this.drawPosition);
    }

    ControlBase._uniqueid = {};

    ControlBase.prototype.getControlName = function () {
        return 'ControlBase';
    };

    ControlBase.prototype.setPosition = function (x, y) {
        this.position.x = x;
        this.position.y = y;

        this.recalculate();
    };

    ControlBase.prototype.setSize = function (w, h) {
        var ratio;
        if (w == 0 && h == 0) {
            return false;
        } else if (w == 0) {
            ratio = h / this.position.h;
            this.position.w *= ratio;
            this.position.h = h;
        } else if (h == 0) {
            ratio = w / this.position.w;
            this.position.w = w;
            this.position.h *= ratio;
        } else {
            this.position.w = w;
            this.position.h = h;
        }

        this.recalculate();
        return true;
    };

    ControlBase.prototype.recalculate = function () {
        if (this.parent != null) {
            this.parent.recalculateChild(this);
        } else {
            $.extend(this.drawPosition, this.position);
        }
        this.shouldResize();
    };

    ControlBase.prototype.shouldResize = function () {
        Viewport.resizeElement('#' + this.id);
    };

    ControlBase.prototype.getID = function () {
        if (this.id != undefined) {
            return this.id
        }

        var controlName = this.getControlName();
        var controlUnique = 0;

        if (controlName in ControlBase._uniqueid) {
            controlUnique = ControlBase._uniqueid[controlName];
            ControlBase._uniqueid[controlName]++;
        } else {
            ControlBase._uniqueid[controlName] = controlUnique+1;
        }

        return "control_" + controlName + "_unique_" + controlUnique;
    };

    ControlBase.prototype.html = function (html) {
        var ret;
        if (html == undefined)
            ret = this.$.html();
        else
            ret = this.$.html(html);
        this.shouldResize();
        return ret;
    };

    ControlBase.prototype.txt = function (text) {
        var ret;
        if (text == undefined)
            ret = this.$.text();
        else
            ret = this.$.text(text);
        this.shouldResize();
        return ret;
    };

    ControlBase.prototype.css = function (css, data) {
        var ret;
        if (data == undefined)
            ret = this.$.css(css);
        else
            ret = this.$.css(css, data);
        this.shouldResize();
        return ret;
    };

    ControlBase.prototype.attr = function (attr, data) {
        var ret;
        if (data == undefined)
            ret = this.$.attr(attr);
        else
            ret = this.$.attr(attr, data);
        this.shouldResize();
        return ret;
    };

    ControlBase.prototype.z = function (z) {
        this.$.css('z-index', z);
        return this;
    };

    ControlBase.prototype.show = function () {
        return this.$.show();
    };

    ControlBase.prototype.hide = function () {
        return this.$.hide();
    };

    ControlBase.prototype.fadeIn = function (speed, complete) {
        return this.$.fadeIn(speed, complete);
    };

    ControlBase.prototype.fadeOut = function (speed, complete) {
        return this.$.fadeOut(speed, complete);
    };

    ControlBase.prototype.visible = function () {
        return this.css('display') != 'none';
    };

    return ControlBase;
})();

/**
 * Group of control that can be resized and relocated together.
 */
var ControlGroup = (function($super) {
    $extends(ControlGroup, $super);

    function ControlGroup(x, y, w, h) {
        this.id = this.getID();

        this.parent = null;
        this.children = [];

        this.position = {
            w: w,
            h: h,
            x: x,
            y: y,
            fs: 0,
            align: ''
        };

        this.drawPosition = $.extend({}, this.position);
    }

    ControlGroup.prototype.getControlName = function () {
        return "ControlGroup";
    };

    ControlGroup.prototype.add = function (c) {
        c.parent = this;
        this.children.push(c);
        this.recalculateChild(c);

        return this;
    };

    ControlGroup.prototype.recalculate = function () {
        $super.prototype.recalculate.call(this);
        this.recalculateChildren();
    };

    ControlGroup.prototype.recalculateChildren = function () {
        this.children.forEach(function (c) {
            c.recalculate();
        });
    };

    ControlGroup.prototype.recalculateChild = function (c) {
        c.drawPosition.x = c.position.x + this.position.x;
        c.drawPosition.y = c.position.y + this.position.y;

        var hRatio = this.drawPosition.h / this.position.h;
        var wRatio = this.drawPosition.w / this.position.w;

        c.drawPosition.h = c.position.h * hRatio;
        c.drawPosition.w = c.position.w * wRatio;
        c.drawPosition.fs = c.position.fs * Math.min(hRatio, wRatio);

        c.shouldResize();
    };

    ControlGroup.prototype.shouldResize = function () {
        // Nothing, but must override parent method
    };

    ControlGroup.prototype.html = function (html) {
        this.children.forEach(function (c) {
            c.html(html);
        });
        this.recalculateChildren();
        return this;
    };

    ControlGroup.prototype.txt = function (text) {
        this.children.forEach(function (c) {
            c.txt(text);
        });
        this.recalculateChildren();
        return this;
    };

    ControlGroup.prototype.css = function (css, data) {
        this.children.forEach(function (c) {
            if (data == undefined)
                c.css(css);
            else
                c.css(css, data);
        });
        this.recalculateChildren();
        return this;
    };

    ControlGroup.prototype.attr = function (attr, data) {
        this.children.forEach(function (c) {
            if (data == undefined)
                c.attr(attr);
            else
                c.attr(attr, data);
        });
        this.recalculateChildren();
        return this;
    };

    ControlGroup.prototype.z = function (z) {
        this.css('z-index', z);
        return this;
    };

    ControlGroup.prototype.show = function () {
        this.children.forEach(function (c) {
            c.show();
        });
        return this;
    };

    ControlGroup.prototype.hide = function () {
        this.children.forEach(function (c) {
            c.hide();
        });
        return this;
    };

    ControlGroup.prototype.fadeIn = function (speed, complete) {
        var count = 0;
        var target = this.children.length;
        var callback = function () {
            count++;
            if (count == target && complete != undefined)
                complete();
        };
        this.children.forEach(function (c) {
            c.fadeIn(speed, callback);
        });
        return this;
    };

    ControlGroup.prototype.fadeOut = function (speed, complete) {
        var count = 0;
        var target = this.children.length;
        var callback = function () {
            count++;
            if (count == target && complete != undefined)
                complete();
        };
        this.children.forEach(function (c) {
            c.fadeOut(speed, callback);
        });
        return this;
    };

    ControlGroup.prototype.visible = function () {
        return true;
    };

    return ControlGroup;
})(ControlBase);

/**
 * Text label object
 */
var Text = (function($super) {
    $extends(Text, $super);

    function Text(text, fs, x, y, color, mode) {
        $super.call(this, $('<span></span>'), {
            x: x,
            y: y,
            fs: fs,
            align: mode
        });

        this.text = text;
        this.txt(text);

        if (color != undefined)
            this.css('color', color);
    }

    Text.prototype.getControlName = function () {
        return "Text";
    };

    return Text;
})(ControlBase);

/**
 * Image object
 */
var Image = (function($super) {
    $extends(Image, $super);

    function Image(src, x, y, w, h) {
        var img = null;
        this.src = src;

        // If id is provided, load from preloaded queue
        if (src in AssetManager.status && AssetManager.status[src].status == 1) {
            img = $(AssetManager.queue.getResult(src));
        } else {
            img = $('<img />');
            img.attr('src', src);
        }

        $super.call(this, img, {
            x: x,
            y: y,
            w: w,
            h: h
        });
    }

    Image.prototype.src = function (src) {
        return this.$.attr('src', src);
    };

    Image.prototype.getControlName = function () {
        return "Image";
    };

    return Image;
})(ControlBase);

/**
 * Just simple DIV block
 */
var Block = (function($super) {
    $extends(Block, $super);

    function Block(x, y, w, h, color) {
        $super.call(this, $('<div></div>'), {
            x: x,
            y: y,
            w: w,
            h: h
        });

        if (color != undefined)
            this.css('background-color', color);
    }

    Block.prototype.getControlName = function () {
        return "Block";
    };

    return Block;
})(ControlBase);

/**
 * Progressbar
 */
var Progressbar = (function($super){
    $extends(Progressbar, $super);

    function Progressbar(x, y, w, h, color_bar, color_back) {
        $super.call(this, x, y, w, h);
        this.back = new Block(0, 0, w, h, color_back || 'rgba(0, 0, 0, 0)');
        this.bar = new Block(0, 0, 0.0000001*w, h, color_bar);
        this.add(this.back);
        this.add(this.bar);
    }

    Progressbar.prototype.getControlName = function () {
        return "Progressbar";
    };

    Progressbar.prototype.progress = function (p) {
        this.bar.setSize(Math.max(0.0000001, p)*this.back.position.w, this.back.position.h);
        this.recalculateChildren();
    };

    return Progressbar;
})(ControlGroup);

/**
 * Main (shared) graphic component, like font and windows background
 */
var Graphics = (function() {
    function Graphics() {}

    Graphics.fontLoaded = false;

    Graphics.init = function () {
        // Global setting
        $('body').css('background-color', 'black');
        var NUMBER_OF_FONT = 6;
        //noinspection JSUnusedGlobalSymbols
        WebFont.load({
            google: {
                families: ['Droid Sans', 'Droid Serif', 'Junge', 'Open Sans:400,600,700']
            },
            active: function () {
                Graphics.fontLoaded = true;
            },
            fontactive: function () {
                Viewport.resizeAll();
                PreloadScreen.completedItem++;
            }
        });
        PreloadScreen.numberOfItem += NUMBER_OF_FONT;
    };

    return Graphics;
})();

/// ///////////////////////
/// Game Screen
var PreloadScreen = (function() {
    function PreloadScreen() {}

    PreloadScreen.numberOfItem = 0;
    PreloadScreen.completedItem = 0;
    PreloadScreen.currentItem = 0;
    PreloadScreen.donnable = false;
    PreloadScreen.displayed = false;
    PreloadScreen.currentProgress = 0;

    PreloadScreen.control = new ControlGroup(0, 0, 1280, 720);

    PreloadScreen.loadFile = function (id, src, callback, start) {
        PreloadScreen.numberOfItem++;
        AssetManager.load(id, src, function (id, result) {
            PreloadScreen.completedItem++;
            PreloadScreen.currentItem = 0;
            if (callback != undefined)
                callback(id, result);
        }, start, function (id, progress) {
            PreloadScreen.currentItem = progress;
        });
    };

    PreloadScreen.getPercent = function () {
        return (PreloadScreen.completedItem+PreloadScreen.currentItem) / PreloadScreen.numberOfItem;
    };

    PreloadScreen.isDone = function () {
        return PreloadScreen.donnable && PreloadScreen.numberOfItem == PreloadScreen.completedItem;
    };

    PreloadScreen.tick = function () {
        if (PreloadScreen.currentProgress != PreloadScreen.getPercent()) {
            PreloadScreen.currentProgress = PreloadScreen.getPercent();
            PreloadScreen.progressbar.progress(PreloadScreen.currentProgress);
        }

        if (PreloadScreen.isDone() && PreloadScreen.loadingText.txt() != "Ready" && Graphics.fontLoaded) {
            PreloadScreen.loadingText.txt("Ready");
            Viewport.resizeAll();
        }
    };

    PreloadScreen.handleKey = function (input) {
        if (PreloadScreen.isDone && input == ' ') {
            State.to(State.PRESONG); // FIXME should be menu, but presong for testing
        }
    };

    PreloadScreen.onOut = function (callback) {
        PreloadScreen.control.fadeOut('slow', callback);
    };

    PreloadScreen.onIn = function () {
        PreloadScreen.loadingText = new Text("Loading...", 60, 640, 355, "white", 'cx,cy');
        PreloadScreen.loadingText.z(5);
        PreloadScreen.loadingText.css('font-family', 'Junge')
                                 .css('text-shadow', '0px 0px 20px #6f6, 0px 0px 20px #9f9');

        PreloadScreen.progressbar = new Progressbar(0, 355, 1280, 5, 'rgba(100, 255, 100, 0.5)');
        PreloadScreen.progressbar.bar.css('box-shadow', '0px 0px 20px 3px rgba(100, 255, 100, 0.5)');
        PreloadScreen.progressbar.z(1);

        PreloadScreen.control
            .add(PreloadScreen.loadingText)
            .add(PreloadScreen.progressbar);

        // TODO add more information to loading screen

        PreloadScreen.control.show();

        PreloadScreen.loadFile('__background', BACKGROUND, function(id) {
            Graphics.backgroundImage = new Image(id, 0, 0, 1280, 720);
            Graphics.backgroundImage.z(-1000);
            Graphics.backgroundImage.fadeIn('slow');
        }, false);

        PreloadScreen.loadFile('__songlist', SONGLIST, function(_, result) {
            SongManager.initSongData(result.songs);
            PreloadScreen.donnable = true;
        }, false);

        AssetManager.queue.load();
    };

    return PreloadScreen;
})();

var MenuScreen = (function() {
    function MenuScreen() {}

    MenuScreen.onIn = function () {

    };

    MenuScreen.onOut = function (callback) {

    };

    MenuScreen.tick = function () {

    };

    MenuScreen.handleKey = function (input) {

    };

    return MenuScreen;
})();

var PresongScreen = (function() {
    function PresongScreen() {}

    PresongScreen.txtStatus = new Text("Standby", 60, 640, 355, "white", "cx,cy");
    PresongScreen.txtStatus.z(15);
    PresongScreen.txtStatus.css('font-family', 'Junge')
                           .css('text-shadow', '0px 0px 20px #999, 0px 0px 20px #fff');

    PresongScreen.progressbar = new Progressbar(0, 355, 1280, 5, 'rgba(255, 255, 255, 0.5)');
    PresongScreen.progressbar.bar.css('box-shadow', '0px 0px 20px 3px rgba(153, 153, 153, 0.5)');
    PresongScreen.progressbar.z(14);

    PresongScreen.control = new ControlGroup(0, 0, 1280, 720);
    PresongScreen.control
        .add(PresongScreen.txtStatus)
        .add(PresongScreen.progressbar);

    PresongScreen.onIn = function () {
        // FIXME this hardcoded song is for checking prior to completion of menu
        SongManager.setSong(SongManager.getSong('blue-flow'));
        SongManager.getSong().load();

        PresongScreen.txtStatus.txt("Standby");
        PresongScreen.progressbar.progress(0);

        PresongScreen.control.fadeIn('slow');
    };

    PresongScreen.onOut = function (callback) {
        PresongScreen.control.hide();
        callback();
    };

    PresongScreen.tick = function () {
        SongManager.tick();
        var song = SongManager.getSong();
        if (song.isReady()) {
            PresongScreen.txtStatus.txt("Ready");
            PresongScreen.progressbar.progress(1);
        } else {
            PresongScreen.progressbar.progress(song.getLoadProgress());
        }
    };

    PresongScreen.handleKey = function (input) {
        if (SongManager.getSong().isReady() && input == ' ') {
            State.to(State.SONG);
        }

        if (input == 'Esc') {
            SongManager.getSong().stop();
            State.to(State.MENU);
        }
    };

    return PresongScreen;
})();

var SongScreen = (function() {
    function SongScreen() {}

    SongScreen.typingText = new Text("", 40, 50, 650, "white", 'cy');
    SongScreen.typingText.z(1000);
    SongScreen.typingText.css('font-family', 'Droid Sans')
                         .css('text-shadow', '0px 0px 20px #6f6, 0px 0px 20px #9f9');

    SongScreen.txtTimecode = new Text("0:00 / 0:00", 28, 1200, 600, "white", 'bx');
    SongScreen.txtTimecode.z(1000);
    SongScreen.txtTimecode.css('font-family', 'Open Sans').css('font-weight', '600');

    SongScreen.txtLineTyping = new Text("", 20, 100, 480, "white");
    SongScreen.txtLineTyping.z(1000);

    SongScreen.txtLineLyrics = new Text("", 24, 100, 500, "white");
    SongScreen.txtLineLyrics.z(1000);

    SongScreen.prgOverall = new Progressbar(300, 400, 850, 5, 'blue', 'gray');
    SongScreen.prgOverall.z(1000);

    SongScreen.prgCurrent = new Progressbar(300, 420, 850, 5, 'blue', 'gray');
    SongScreen.prgCurrent.z(1000);

    SongScreen.control = new ControlGroup(0, 0, 1280, 720);
    SongScreen.control
        .add(SongScreen.typingText)
        .add(SongScreen.txtTimecode)
        .add(SongScreen.txtLineTyping)
        .add(SongScreen.txtLineLyrics)
        .add(SongScreen.prgOverall)
        .add(SongScreen.prgCurrent);

    SongScreen.onIn = function () {
        setTimeout(function () {
            SongManager.getSong().play();
        }, 1000);
        SongScreen.control.fadeIn();

        // Stop Autoplay if active
        AutoPlay.stop();
    };

    SongScreen.onOut = function (callback) {
        SongScreen.control.hide();
        callback();
    };

    SongScreen.tick = function () {
        SongManager.tick();
        AutoPlay.tick();

        var song = SongManager.getSong();

        if (song == null)
            return;

        SongScreen.typingText.html(song.getDisplay());
        SongScreen.txtTimecode.txt(SongManager.formatTime(song.getTime()) + " / " + SongManager.formatTime(song.getDuration()));
        SongScreen.prgOverall.progress(song.getProgress());

        var tun = song.getTimeUntilNextLine();
        var tcl = song.getCurrentSectionTime();
        SongScreen.prgCurrent.progress((tcl-tun)/tcl);

        var line = song.getCurrentVerse();
        if ((song.typing != null && song.typing.isComplete()) || song.currentVerse == -1) {
            line = song.getNextVerse();
        }

        if (song.isComplete()) {
            State.to(State.SCORE);
        }

        SongScreen.txtLineTyping.html(SongManager.combineTyping(line.typing));
        SongScreen.txtLineLyrics.html(line.lyrics);
    };

    SongScreen.handleKey = function (input) {
        if (input == 'Esc') {
            State.to(State.SCORE);
            return;
        }

        if (AutoPlay.handleInput(input)) {
            return;
        }

        SongManager.getSong().handleKey(input);
    };

    return SongScreen;
})();

var ScoreScreen = (function() {
    function ScoreScreen() {}

    ScoreScreen.onIn = function () {

    };

    ScoreScreen.onOut = function (callback) {
        SongManager.getSong().stop();
        callback();
    };

    ScoreScreen.tick = function () {

    };

    ScoreScreen.handleKey = function (input) {
        if (input == ' ' || input == 'Esc')
            State.to(Screen.MENU);
    };

    return ScoreScreen;
})();

/// ///////////////////////
/// Startup

(function() {

    // Graphics Initialization
    Graphics.init();
    Viewport.onResize();

    // Window event
    $(window).on("resize", Viewport.onResize);
    $(window).on("keydown", function (event) {
        var code = event.which;
        var input = KeyCode.fromKeyCode(code);

        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.handleKey(input);
                break;
            case State.MENU:
                MenuScreen.handleKey(input);
                break;
            case State.PRESONG:
                PresongScreen.handleKey(input);
                break;
            case State.SONG:
                SongScreen.handleKey(input);
                break;
            case State.SCORE:
                ScoreScreen.handleKey(input);
                break;
        }
    });

    // Main game loop
    setInterval(function() {
        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.tick();
                break;
            case State.MENU:
                MenuScreen.tick();
                break;
            case State.PRESONG:
                PresongScreen.tick();
                break;
            case State.SONG:
                SongScreen.tick();
                break;
            case State.SCORE:
                ScoreScreen.tick();
                break;
        }
    }, INTERVAL);

    // Start game
    PreloadScreen.onIn();

})();

