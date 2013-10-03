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
        console.log(character);
        console.log(this.possible[0]);
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
        return {
            "lyrics": this.getLyric(this.currentVerse+1),
            "typing": this.getTyping(this.currentVerse+1)
        };
    };

    Song.prototype.getTime = function () {
        return this.audio.getPosition();
    };

    Song.prototype.getDuration = function() {
        return this.audio.getDuration();
    };

    Song.prototype.getProgress = function () {
        return this.getTime() / this.getDuration();
    }

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

    Song.prototype.getData = function (info) {
        return this.data['info-' + info];
    };

    Song.prototype.getAudioURL = function () {
        return this.basePath + '/' + this.data['file'];
    }

    Song.prototype.getLoadProgress  = function () {
        return this.loadingProgress;
    }

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

        var _this = this;
        AssetManager.load(this.id + "_audio", this.getAudioURL(), function (id) {
            _this.isLoaded = true;
            _this.isLoading = false;
            _this.loadingProgress = 1;
            _this.audio = createjs.Sound.createInstance(id);
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
        var _this = this;
        AssetManager.load(this.id + "_image", this.getAudioURL(), function (id) {
            _this.image = new Image(_this.id + "_image", 0, 0, 1280, 720);
            _this.image.z(10);
        });
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
            case State.MENU:
                break;
            case State.PRESONG:
                PresongScreen.handleKey(input);
                break;
            case State.SONG:
                SongScreen.handleKey(input);
                break;
            case State.SCORE:
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
                case State.MENU:
                    break;
                case State.PRESONG:
                    PresongScreen.onIn();
                    break;
                case State.SONG:
                    SongScreen.onIn();
                    break;
                case State.SCORE:
                    break;
                // TODO other state
            }
        };

        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.onOut(callback);
                break;
            case State.MENU:
                break;
            case State.PRESONG:
                PresongScreen.onOut(callback);
                break;
            case State.SONG:
                SongScreen.onOut(callback);
                break;
            case State.SCORE:
                break;
            // TODO other state
        }
    }

    return State;
})();

var SongManager = (function() {
    function SongManager() {}

    SongManager.songData = null;
    SongManager.songs = {};
    SongManager.song = null;
    SongManager.imgTransitioning = false;
    SongManager.currentImage = null;

    SongManager.initSongData = function (songData) {
        SongManager.songData = songData;

        songData.forEach(function (c) {
            PreloadScreen.loadFile(c[0] + "_data", c[1] + '/' + c[2], function(_, result) {
                SongManager.songs[c[0]] = new Song(result, c[1]);
            });
        });
    };

    SongManager.tick = function () {
        if (SongManager.song != null) {
            SongManager.song.tick();

            var song = SongManager.song;

//            if (!SongManager.imgTransitioning && !song.image.visible()) {
//
//            }
        }
    };

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
    AssetManager.queue.on("fileprogress", AssetManager.onFileProgressed);
    AssetManager.queue.on("complete", AssetManager.onComplete);

    return AssetManager;
})();

/// ///////////////////////
/// Graphical

/**
 * Viewport for auto resizing of of element
 * based on browser size.
 *
 * Supports limited to font-size for text
 * and width/height for image only.
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

        if (display != undefined && display) {
            this.$.css('display', 'block');
        }
    }

    Text._uniqid = 0;

    Text.prototype.txt = function (text) {
        var ret = this.$.html(text);
        Viewport.resizeAll();
        return ret;
    };

    Text.prototype.z = function (z) {
        return this.$.css('z-index', z);
    };

    Text.prototype.show = function () {
        return this.$.show();
    };

    Text.prototype.hide = function () {
        return this.$.hide();
    };

    Text.prototype.visible = function () {
        return this.$.css('display') != 'none';
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

    Image.prototype.show = function () {
        return this.$.show();
    };

    Image.prototype.hide = function () {
        return this.$.hide();
    };

    Image.prototype.visible = function () {
        return this.$.css('display') != 'none';
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

    Progressbar.prototype.show = function () {
        return this.$.show();
    };

    Progressbar.prototype.hide = function () {
        return this.$.hide();
    };

    Progressbar.prototype.visible = function () {
        return this.$.css('display') != 'none';
    };

    return Progressbar;
})();

var Graphics = (function() {
    function Graphics() {}

    Graphics.fontLoaded = false;

    Graphics.init = function () {
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
    };

    return Graphics;
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
            PreloadScreen.loadingText.show();
            PreloadScreen.displayed = true;
        }
    };

    PreloadScreen.handleKey = function (input) {
        if (PreloadScreen.isDone && input == ' ') {
            State.to(State.PRESONG); // FIXME should be menu, but presong for testing
        }
    };

    PreloadScreen.onOut = function (callback) {
        PreloadScreen.progressbar.$.fadeOut('slow');
        PreloadScreen.loadingText.$.fadeOut('slow', callback);
    };

    PreloadScreen.onIn = function () {
        PreloadScreen.loadingText = new Text("Loading...", 60, 640, 355, "white", false, 'xy');
        PreloadScreen.loadingText.z(5);
        PreloadScreen.loadingText.$.css('font-family', 'monda')
                                   .css('text-shadow', '0px 0px 20px #6f6, 0px 0px 20px #9f9');

        PreloadScreen.progressbar = new Progressbar(0, 355, 1280, 5, 'rgba(100, 255, 100, 0.3)');
        PreloadScreen.progressbar.z(1);

        // TODO add more information to loading screen

        PreloadScreen.progressbar.show();

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
    };

    return PreloadScreen;
})();

var MenuScreen = (function() {
    function MenuScreen() {}

    return MenuScreen;
});

var PresongScreen = (function() {
    function PresongScreen() {}

    PresongScreen.txtStatus = new Text("Standby", 60, 640, 355, "white", false, "xy");
    PresongScreen.txtStatus.z(15);
    PresongScreen.txtStatus.$.css('font-family', 'monda')
                             .css('text-shadow', '0px 0px 20px #6f6, 0px 0px 20px #9f9');

    PresongScreen.progressbar = new Progressbar(0, 355, 1280, 5, 'rgba(100, 255, 100, 0.3)');
    PresongScreen.progressbar.z(14);

    PresongScreen.onIn = function () {
        // FIXME this hardcoded song is for checking prior to completion of menu
        SongManager.setSong(SongManager.getSong('real-world'));
        SongManager.getSong().load();

        PresongScreen.txtStatus.txt("Standby");
        PresongScreen.progressbar.progress(0);

        PresongScreen.txtStatus.$.fadeIn('slow');
        PresongScreen.progressbar.$.fadeIn('slow');
    };

    PresongScreen.onOut = function (callback) {
        PresongScreen.txtStatus.$.fadeOut('slow');
        PresongScreen.progressbar.$.fadeOut('slow', callback);
    };

    PresongScreen.tick = function () {
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
            State.to(State.MENU);
        }
    };

    return PresongScreen;
})();

var SongScreen = (function() {
    function SongScreen() {}

    SongScreen.typingText = new Text("", 40, 50, 650, "white", false, 'y');
    SongScreen.typingText.z(1000);

    SongScreen.onIn = function () {
        setTimeout(function () {
            SongManager.getSong().play();
        }, 1000);
        SongScreen.typingText.$.fadeIn();
    };

    SongScreen.onOut = function () {
        SongManager.getSong().stop(callback);
        SongScreen.typingText.$.fadeOut('slow', callback);
    };

    SongScreen.tick = function () {
        SongManager.tick();
        SongScreen.typingText.txt(SongManager.getSong().getDisplay());
    };

    SongScreen.handleKey = function (input) {
        SongManager.getSong().handleKey(input);
    };

    return SongScreen;
})();

/// ////////////////////////
/// Startup

(function() {

    // Graphics Initialization
    Graphics.init();
    Viewport.onResize();

    // Set window event
    $(window).on("keydown", State.onKeyDown);
    $(window).on("resize", Viewport.onResize);

    // Start preloading screen
    PreloadScreen.onIn();

    console.log("Initialized");

    setInterval(function() {
        switch (State.current) {
            case State.PRELOAD:
                PreloadScreen.tick();
                break;
            case State.MENU:
                break;
            case State.PRESONG:
                PresongScreen.tick();
                break;
            case State.SONG:
                SongScreen.tick();
                break;
            case State.SCORE:
                break;
        }
    }, 100);

})();

