/**
 * TypingMania Main File
 * ----------------------------------------------
 * Copyright 2013 (c) Nat Pavasant
 * Available under the term of MIT License
 * See LICENSE file for more detail
 */

var BACKGROUND = 'data/background.jpg';
var SONGLIST   = 'data/songs.json';

/// ///////////////////////
/// Song Engine
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
                // TODO make it more pretty and maybe dom-based only
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
        this.image = null;

        var _this = this;
        jQuery.getJSON(basePath + "/" + file, function(data) {
            _this.setData(data);
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

    Song.handleKey = function (input) {
        if (Song.currentTyping != null) {
            Song.currentTyping.accept(input);
        }
    };

    Song.mainLoop = function () {
        if (this.currentSong != null && this.currentSong.isPlaying) {
            var changed = this.currentSong.process(this.currentSong.getTime());
            var cur = this.currentSong.getCurrentVerse();
            if (changed) {
                Song.currentTyping = new Typing(cur['typing']);
            }
        }
    };

    Song.getDisplay = function () {
        if (Song.currentTyping != null)
            return Song.currentTyping.getDisplay();
        else
            return "";
    }

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

    Song.prototype.beginLoading = function () {
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
        return true;
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
/// Other Engine
var State = (function() {
    function State() {}

    State.PRELOAD = 0;
    State.MENU    = 1;
    State.PRESONG = 2;
    State.SONG    = 3;
    State.SCORE   = 4;

    State.current = State.PRELOAD;

    State.is = function (c) {
        return c == State.current;
    };

    State.onKeyDown = function (event) {
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

        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.handleKey(input);
                break;
            // TODO other state
        }
    };

    State.to = function (state) {
        if (state < 0 && state > 4) {
            return;
        }

        var callback = function () {
            State.current = state;
            switch (state) {
                // TODO other state
            }
        };

        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.onOut(callback);
            // TODO other state
        }
    }

    return State;
})();

var SongManager = (function() {
    function SongManager() {}

    SongManager.songData = null;
    SongManager.songs = {};

    SongManager.initSongData = function (songData) {
        SongManager.songData = songData;

        songData.forEach(function (c) {
            PreloadScreen.loadFile(c[0] + "_data", c[1] + '/' + c[2], function(_, result) {
                SongManager.songs[c[0]] = result;
            });
        });
    };

    return SongManager;
})();

var AssetManager = (function() {
    function AssetManager() {}

    AssetManager.queue = new createjs.LoadQueue();
    AssetManager.queue.installPlugin(createjs.Sound);
    AssetManager.status = {};
    this.complete = true;

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

    AssetManager.onComplete = function (event) {
        AssetManager.complete = true;
    };

    AssetManager.isComplete = function (id) {
        if (id in AssetManager.status) {
            return AssetManager.status[id].status == 1;
        }
        return false;
    }

    AssetManager.queue.on("fileload", AssetManager.onFileDownloaded);
    AssetManager.queue.on("complete", AssetManager.onComplete);

    return AssetManager;
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
    Viewport.left = 0;

    Viewport.sketchPercent = 1;

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

        Viewport.sketchPercent = newWidth / Viewport.STD_WIDTH;

        Viewport.left = (window.innerWidth - newWidth) / 2;
        Viewport.top = (window.innerHeight - newHeight) / 2;

        Viewport.resizeAll();
    };

    Viewport.position = function (c, x, y, w, h, fs, mode, subsequent) {
        if (w == undefined)
            w = 0;
        if (h == undefined)
            h = 0;

        if (!(c in Viewport.elements)) {
            Viewport.elements[c] = {
                x: x,
                y: y,
                w: w,
                h: h,
                fs: fs,
                mode: mode
            };
        }

        var dx = 0, dy = 0;
        if (mode != undefined) {
            dx = $(c).css('width');
            dy = $(c).css('height');

            dx = dx.substring(0, dx.length-2);
            dy = dy.substring(0, dy.length-2);
            dx /= (Viewport.sketchPercent * 2);
            dy /= (Viewport.sketchPercent * 2);

            if (subsequent == undefined) {
                dx *= Viewport.sketchPercent;
                dy *= Viewport.sketchPercent;
            }
            if (mode == "x") {
                // dx = dx;
                dy = 0;
            } else if (mode == 'y') {
                dx = 0;
                // dy = dy;
            } else if (mode == 'xy') {
                // dx = dx;
                // dy = dy;
            } else {
                dx = 0;
                dy = 0;
            }
        }

        var css = {
            position: "absolute"
        };
        css.left = "" + (Viewport.left + (x-dx) * Viewport.width / Viewport.STD_WIDTH) + "px";
        css.top  = "" + (Viewport.top + (y-dy) * Viewport.height / Viewport.STD_HEIGHT) + "px";
        css["font-size"] = "" + (fs * Viewport.height / Viewport.STD_HEIGHT) + "px";
        if (w != 0 && h != 0) {
            css.overflow = "hidden";
            css.width = "" + (w * Viewport.width / Viewport.STD_WIDTH) + "px";
            css.height = "" + (h * Viewport.height / Viewport.STD_HEIGHT) + "px";
        }
        $(c).css(css);
    };

    Viewport.resizeAll = function () {
        for (var c in Viewport.elements) {
            if (Viewport.elements.hasOwnProperty(c)) {
                var cc = Viewport.elements[c];
                Viewport.position(c, cc.x, cc.y, cc.w, cc.h, cc.fs, cc.mode, true);
            }
        }
    };

    (function($) {
        $.pos = Viewport.position;
    })(jQuery);

    return Viewport;
})();

var Text = (function() {
    function Text(text, fs, x, y, color, display, mode) {
        this.text = text;
        this.fs = fs;
        this.x = x;
        this.y = y;
        this.id = 'txt_unique_' + Text._uniqid;
        Text._uniqid++;

        this.$ = $('<span />');
        this.$.attr('id', this.id);
        this.txt(text);

        if (color != undefined)
            this.$.css('color', color);

        this.$.css('display', 'none');
        this.$.appendTo('body');
        $.pos('#' + this.id, x, y, 0, 0, fs, mode);

        if (display != undefined && display)
            this.$.css('display', 'block');
    }

    Text._uniqid = 0;

    Text.prototype.txt = function (text) {
        return this.$.html(text);
    };

    Text.prototype.z = function (z) {
        return this.$.css('z-index', z);
    };

    return Text;
})();

var Image = (function() {
    function Image(src, x, y, w, h, display) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // If id is provided, load from preloaded queue
        if (src in AssetManager.status && AssetManager.status[src].status == 1) {
            this.$ = $(AssetManager.queue.getResult(src));
        } else {
            this.$ = $('<img />');
            this.src(src);
        }

        this.id = 'image_unique_' + Image._uniqid;
        Image._uniqid++;

        this.$.attr('id', this.id);

        this.$.css('display', 'none');
        this.$.appendTo('body');
        $.pos('#' + this.id, x, y, w, h);
        if (display != undefined && display)
            this.$.css('display', 'block');
    }

    Image._uniqid = 0;

    Image.prototype.src = function (src) {
        return this.$.attr('src', src);
    };

    Image.prototype.z = function (z) {
        return this.$.css('z-index', z);
    };

    return Image;
})();

var Progressbar = (function() {
    function Progressbar(x, y, w, h, color_bar, color_back) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if (color_back == undefined) {
            color_back = 'rgba(0, 0, 0, 0)';
        }

        this.id = 'progress_unique_' + Progressbar._uniqid + '_back';
        this.id_inside = 'progress_unique_' + Progressbar._uniqid + '_bar';
        Progressbar._uniqid++;

        this.$ = $('<div />');
        this.$.attr('id', this.id);
        this.$.css('background-color', color_back);

        this.$b = $('<div />');
        this.$b.attr('id', this.id_inside);
        this.$b.css('background-color', color_bar);

        this.$.css('display', 'none');
        this.$.appendTo('body');
        this.$b.appendTo(this.$);

        $.pos('#' + this.id, x, y, w, h);
        this.$b.css({
            width: "0%",
            height: "100%"
        })
    }

    Progressbar._uniqid = 0;

    Progressbar.prototype.progress = function (p) {
        this.$b.css('width', "" + (100*p) + "%");
    };

    Progressbar.prototype.z = function (z) {
        return this.$.css('z-index', z);
    };

    return Progressbar;
})();

var Graphics = (function() {
    function Graphics() {}

    Graphics.queue = new createjs.LoadQueue();
    Graphics.backgroundImage = null;
    Graphics.fontLoaded = false;

    Graphics.init = function () {
        // TODO make loading screen and use preloadJS to preload everything

        // Global setting
        $('body').css('background-color', 'black');
        var NUMBER_OF_FONT = 1;
        WebFont.load({
            google: {
                families: ['Monda']
            },
            active: function () {
                Graphics.fontLoaded = true;
                PreloadScreen.completedItem += NUMBER_OF_FONT;
            }
        });
        PreloadScreen.numberOfItem += NUMBER_OF_FONT;

//        AssetManager.load('__background', 'data/background.jpg', function (id) {
//            (new Image('__background', 0, 0, 1280, 720, false)).$.fadeIn('slow');
//        });
    };

    return Graphics;
})();

var SongScreen = (function() {
    function SongScreen() {}

    SongScreen.currentSong = null;
    SongScreen.typingText = new Text("", 36, 0, 0, "white", true);
    SongScreen.typingText.z(1000);

    SongScreen.set = function (song) {
        SongScreen.currentSong = song;
    };

    SongScreen.process = function () {
        Song.mainLoop();
        SongScreen.typingText.txt(Song.getDisplay());
    };

    return SongScreen;
})();

var PreloadScreen = (function() {
    function PreloadScreen() {}

    PreloadScreen.numberOfItem = 0;
    PreloadScreen.completedItem = 0;
    PreloadScreen.currentItem = 0;
    PreloadScreen.donnable = false;
    PreloadScreen.displayed = false;

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
        PreloadScreen.progressbar.progress(PreloadScreen.getPercent());
        if (PreloadScreen.isDone() && PreloadScreen.loadingText.$.text() != "Ready" && Graphics.fontLoaded) {
            PreloadScreen.loadingText.txt("Ready");
            Viewport.resizeAll();
        }
        if (Graphics.fontLoaded && !PreloadScreen.displayed) {
            PreloadScreen.loadingText.$.show();
            PreloadScreen.displayed = true;
        }
    };

    PreloadScreen.handleKey = function (input) {
        if (PreloadScreen.isDone && input == ' ') {
            State.to(State.MENU);
        }
    };

    PreloadScreen.onOut = function (callback) {
        PreloadScreen.progressbar.$.fadeOut('slow');
        PreloadScreen.loadingText.$.fadeOut('slow', callback);
    };

    PreloadScreen.loadingText = new Text("Loading...", 60, 640, 355, "white", false, 'xy');
    PreloadScreen.loadingText.z(10);
    PreloadScreen.loadingText.$.css('font-family', 'monda')
                               .css('text-shadow', '0px 0px 20px #6f6, 0px 0px 20px #9f9');

    PreloadScreen.progressbar = new Progressbar(0, 355, 1280, 5, 'rgba(100, 255, 100, 0.3)');
    PreloadScreen.progressbar.z(1);

    // TODO add more information to loading screen

    PreloadScreen.progressbar.$.show();

    PreloadScreen.loadFile('__background', BACKGROUND, function(id) {
        Graphics.backgroundImage = new Image(id, 0, 0, 1280, 720);
        Graphics.backgroundImage.z(-1000);
        Graphics.backgroundImage.$.fadeIn('slow');
    }, false);

    PreloadScreen.loadFile('__songlist', SONGLIST, function(_, result) {
        SongManager.initSongData(result.songs);
        PreloadScreen.donnable = true;
    }, false);

    AssetManager.queue.load();

    return PreloadScreen;
})();

/// ////////////////////////
/// Startup

(function() {

    $(window).keydown(State.onKeyDown);

    Graphics.init();
    Viewport.onResize();
    $(window).on("resize", Viewport.onResize);

    var s = new Song("songs/Real World (TV ver.)", "real-world.json");
    Song.setSong(s);
    setInterval(function() {
        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.tick();
                break;
            case State.MENU:
                break;
            case State.PRESONG:
                break;
            case State.SONG:
                //SongScreen.process();
                break;
            case State.SCORE:
                break;
        }

//        if (!s.isReady())
//            s.beginLoading();
//        else if (!s.isPlaying)
//            s.play();
//        SongScreen.process();
    }, 20);

})();

