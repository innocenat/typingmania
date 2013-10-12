/**
 * TypingMania Complement File
 * ----------------------------------------------
 * Copyright 2013 (c) Nat Pavasant
 * Available under the term of MIT License
 * See LICENSE file for more detail
 */

/* WARNING: MAKE SIRE THIS FILE IS SAVED AS UTF-16 LE
   BECAUSE FUCK YOU FIREFOX! */

var Kana = (function() {
    /**
     * This table contains all possible Romaji-Kana pair that will be used in the game.
     * The first pair of each Kana denote the Romaji will be used in displaying the lyrics,
     * while subsequent pair denote pair possible to type in.
     *
     * @type {Array}
     */
    var romajitable = new Array(
//////////////////////////////////////////////////
        new Array("ぁ", "xa"),
        new Array("あ", "a"),

        new Array("ぃ", "xi"),
        new Array("い", "i"),
        new Array("いぃ", "yi"),
        new Array("いぇ", "ye"),
        new Array("いぃ", "ixi"),
        new Array("いぇ", "ixe"),

        new Array("ぅ", "xu"),
        new Array("う", "u"),
        new Array("うぁ", "wa"),
        new Array("うぃ", "wi"),
        new Array("うぅ", "wu"),
        new Array("うぇ", "we"),
        new Array("うぉ", "wo"),
        new Array("うぁ", "uxa"),
        new Array("うぃ", "uxi"),
        new Array("うぅ", "uxu"),
        new Array("うぇ", "uxe"),
        new Array("うぉ", "uxo"),

        new Array("ぇ", "xe"),
        new Array("え", "e"),

        new Array("ぉ", "xo"),
        new Array("お", "o"),
//////////////////////////////////////////////////
        new Array("か", "ka"),
        new Array("が", "ga"),

        new Array("き", "ki"),
        new Array("きぃ", "kyi"),
        new Array("きぇ", "kye"),
        new Array("きゃ", "kya"),
        new Array("きゅ", "kyu"),
        new Array("きょ", "kyo"),
        new Array("きぃ", "kixi"),
        new Array("きぇ", "kixe"),
        new Array("きゃ", "kixya"),
        new Array("きゅ", "kixyu"),
        new Array("きょ", "kixyo"),

        new Array("ぎ", "gi"),
        new Array("ぎぃ", "gyi"),
        new Array("ぎぇ", "gye"),
        new Array("ぎゃ", "gya"),
        new Array("ぎゅ", "gyu"),
        new Array("ぎょ", "gyo"),
        new Array("ぎぃ", "gixi"),
        new Array("ぎぇ", "gixe"),
        new Array("ぎゃ", "gixya"),
        new Array("ぎゅ", "gixyu"),
        new Array("ぎょ", "gixyo"),

        new Array("く", "ku"),
        new Array("くぁ", "kwa"),
        new Array("くぃ", "kwi"),
        new Array("くぅ", "kwu"),
        new Array("くぇ", "kwe"),
        new Array("くぉ", "kwo"),
        new Array("くぁ", "kuxa"),
        new Array("くぃ", "kuxi"),
        new Array("くぅ", "kuxu"),
        new Array("くぇ", "kuxe"),
        new Array("くぉ", "kuxo"),

        new Array("ぐ", "gu"),
        new Array("ぐぁ", "gwa"),
        new Array("ぐぃ", "gwi"),
        new Array("ぐぅ", "gwu"),
        new Array("ぐぇ", "gwe"),
        new Array("ぐぉ", "gwo"),
        new Array("ぐぁ", "guxa"),
        new Array("ぐぃ", "guxi"),
        new Array("ぐぅ", "guxu"),
        new Array("ぐぇ", "guxe"),
        new Array("ぐぉ", "guxo"),

        new Array("け", "ke"),
        new Array("げ", "ge"),

        new Array("こ", "ko"),
        new Array("ご", "go"),
//////////////////////////////////////////////////
        new Array("さ", "sa"),
        new Array("ざ", "za"),

        new Array("し", "si"),
        new Array("しぇ", "sye"),
        new Array("しゃ", "sya"),
        new Array("しゅ", "syu"),
        new Array("しょ", "syo"),
        new Array("しぇ", "sixe"),
        new Array("しゃ", "sixa"),
        new Array("しゅ", "sixu"),
        new Array("しょ", "sixo"),
        new Array("し", "shi"),
        new Array("しぇ", "she"),
        new Array("しゃ", "sha"),
        new Array("しゅ", "shu"),
        new Array("しょ", "sho"),
        new Array("しぇ", "shixe"),
        new Array("しゃ", "shixya"),
        new Array("しゅ", "shixyu"),
        new Array("しょ", "shixyo"),

        new Array("じ", "zi"),
        new Array("じぃ", "zyi"),
        new Array("じぇ", "ze"),
        new Array("じゃ", "za"),
        new Array("じゅ", "zu"),
        new Array("じょ", "zo"),
        new Array("じゃ", "zya"),
        new Array("じゅ", "zyu"),
        new Array("じょ", "zyo"),
        new Array("じぃ", "zixi"),
        new Array("じぇ", "zixe"),
        new Array("じゃ", "zixya"),
        new Array("じゅ", "zixyu"),
        new Array("じょ", "zixyo"),
        new Array("じ", "ji"),
        new Array("じぃ", "jyi"),
        new Array("じぇ", "je"),
        new Array("じゃ", "ja"),
        new Array("じゅ", "ju"),
        new Array("じょ", "jo"),
        new Array("じゃ", "jya"),
        new Array("じゅ", "jyu"),
        new Array("じょ", "jyo"),
        new Array("じぃ", "jixi"),
        new Array("じぇ", "jixe"),
        new Array("じゃ", "jixya"),
        new Array("じゅ", "jixyu"),
        new Array("じょ", "jixyo"),

        new Array("す", "su"),
        new Array("すぁ", "sa"),
        new Array("すぃ", "si"),
        new Array("すぅ", "suu"),
        new Array("すぇ", "se"),
        new Array("すぉ", "so"),
        new Array("すぁ", "suxa"),
        new Array("すぃ", "suxi"),
        new Array("すぅ", "suxu"),
        new Array("すぇ", "suxe"),
        new Array("すぉ", "suxo"),

        new Array("ず", "zu"),

        new Array("せ", "se"),
        new Array("ぜ", "ze"),

        new Array("そ", "so"),
        new Array("ぞ", "zo"),
//////////////////////////////////////////////////
        new Array("た", "ta"),
        new Array("だ", "da"),

        new Array("ち", "ti"),
        new Array("ちぇ", "tye"),
        new Array("ちゃ", "tya"),
        new Array("ちゅ", "tyu"),
        new Array("ちょ", "tyo"),
        new Array("ちぇ", "tixe"),
        new Array("ちゃ", "tixya"),
        new Array("ちゅ", "tixyu"),
        new Array("ちょ", "tixyo"),
        new Array("ち", "chi"),
        new Array("ちぇ", "che"),
        new Array("ちゃ", "cha"),
        new Array("ちゅ", "chu"),
        new Array("ちょ", "cho"),
        new Array("ちぇ", "chixe"),
        new Array("ちゃ", "chixya"),
        new Array("ちゅ", "chixyu"),
        new Array("ちょ", "chixyo"),

        new Array("ぢ", "di"),
        new Array("ぢぇ", "dye"),
        new Array("ぢゃ", "dya"),
        new Array("ぢゅ", "dyu"),
        new Array("ぢょ", "dyo"),
        new Array("ぢぇ", "dixe"),
        new Array("ぢゃ", "dixya"),
        new Array("ぢゅ", "dixyu"),
        new Array("ぢょ", "dixyo"),
        new Array("ぢ", "dji"),
        new Array("ぢぇ", "dje"),
        new Array("ぢゃ", "dja"),
        new Array("ぢゅ", "dju"),
        new Array("ぢょ", "djo"),
        new Array("ぢぇ", "djixe"),
        new Array("ぢゃ", "djixya"),
        new Array("ぢゅ", "djixyu"),
        new Array("ぢょ", "djixyo"),

        new Array("つ", "tu"),
        new Array("つぁ", "tya"),
        new Array("つぃ", "tyi"),
        new Array("つぇ", "tye"),
        new Array("つぉ", "tyo"),
        new Array("つぁ", "tuxa"),
        new Array("つぃ", "tuxi"),
        new Array("つぇ", "tuxe"),
        new Array("つぉ", "tuxo"),
        new Array("つ", "tsu"),
        new Array("つぁ", "tsa"),
        new Array("つぃ", "tsi"),
        new Array("つぇ", "tse"),
        new Array("つぉ", "tso"),
        new Array("つぁ", "tsuxa"),
        new Array("つぃ", "tsuxi"),
        new Array("つぇ", "tsuxe"),
        new Array("つぉ", "tsuxo"),

        new Array("づ", "du"),
        new Array("づ", "dzu"),

        new Array("て", "te"),
        new Array("てぃ", "ti"),
        new Array("てぃ", "texi"),

        new Array("で", "de"),
        new Array("でぃ", "dexi"),

        new Array("と", "to"),
        new Array("とぁ", "ta"),
        new Array("とぅ", "tu"),
        new Array("とぇ", "te"),
        new Array("とぉ", "to"),
        new Array("とぁ", "toxa"),
        new Array("とぅ", "toxu"),
        new Array("とぇ", "toxe"),
        new Array("とぉ", "toxo"),

        new Array("ど", "do"),
        new Array("どぅ", "du"),
        new Array("どぅ", "doxu"),
//////////////////////////////////////////////////
        new Array("な", "na"),
        new Array("ぬ", "nu"),
        new Array("ね", "ne"),
        new Array("の", "no"),

        new Array("に", "ni"),
        new Array("にぃ", "nyi"),
        new Array("にぃい", "nyii"),
        new Array("にい", "nii"),
        new Array("にぇ", "nye"),
        new Array("にぇえ", "nyee"),
        new Array("にゃ", "nya"),
        new Array("にゃあ", "nyaa"),
        new Array("にゅ", "nyu"),
        new Array("にゅう", "nyuu"),
        new Array("にょ", "nyo"),
        new Array("にょう", "nyou"),
        new Array("にょお", "nyoo"),
//////////////////////////////////////////////////
        new Array("は", "ha"),
        new Array("ば", "ba"),
        new Array("ぱ", "pa"),
        
        new Array("ひ", "hi"),
        new Array("ひぃ", "hyi"),
        new Array("ひぇ", "hye"),
        new Array("ひゃ", "hya"),
        new Array("ひゅ", "hyu"),
        new Array("ひょ", "hyo"),
        new Array("ひぃ", "hixi"),
        new Array("ひぇ", "hixe"),
        new Array("ひゃ", "hixya"),
        new Array("ひゅ", "hixyu"),
        new Array("ひょ", "hixyo"),

        new Array("び", "bi"),
        new Array("びぃ", "byi"),
        new Array("びぇ", "bye"),
        new Array("びゃ", "bya"),
        new Array("びゅ", "byu"),
        new Array("びょ", "byo"),
        new Array("びぃ", "bixi"),
        new Array("びぇ", "bixe"),
        new Array("びゃ", "bixya"),
        new Array("びゅ", "bixyu"),
        new Array("びょ", "bixyo"),

        new Array("ぴ", "pi"),
        new Array("ぴぃ", "pyi"),
        new Array("ぴぇ", "pye"),
        new Array("ぴゃ", "pya"),
        new Array("ぴゅ", "pyu"),
        new Array("ぴょ", "pyo"),
        new Array("ぴぃ", "pixi"),
        new Array("ぴぇ", "pixe"),
        new Array("ぴゃ", "pixya"),
        new Array("ぴゅ", "pixyu"),
        new Array("ぴょ", "pixyo"),

        new Array("ふ", "fu"),
        new Array("ふぁ", "fa"),
        new Array("ふぃ", "fi"),
        new Array("ふぇ", "fe"),
        new Array("ふぉ", "fo"),
        new Array("ふゃ", "fya"),
        new Array("ふゅ", "fyu"),
        new Array("ふょ", "fyo"),
        new Array("ふぁ", "fuxa"),
        new Array("ふぃ", "fuxi"),
        new Array("ふぇ", "fuxe"),
        new Array("ふぉ", "fuxo"),
        new Array("ふゃ", "fuxya"),
        new Array("ふゅ", "fuxyu"),
        new Array("ふょ", "fuxyo"),
        new Array("ふ", "hu"),
        new Array("ふぃ", "hyi"),
        new Array("ふぇ", "hye"),
        new Array("ふゃ", "hya"),
        new Array("ふゅ", "hyu"),
        new Array("ふょ", "hyo"),
        new Array("ふぁ", "huxa"),
        new Array("ふぃ", "huxi"),
        new Array("ふぇ", "huxe"),
        new Array("ふぉ", "huxo"),
        new Array("ふゃ", "huxya"),
        new Array("ふゅ", "huxyu"),
        new Array("ふょ", "huxyo"),
        new Array("ぶ", "bu"),
        new Array("ぷ", "pu"),
        
        new Array("へ", "he"),
        new Array("べ", "be"),
        new Array("ぺ", "pe"),
        
        new Array("ほ", "ho"),
        new Array("ぼ", "bo"),
        new Array("ぽ", "po"),
//////////////////////////////////////////////////
        new Array("ま", "ma"),
        new Array("む", "mu"),
        new Array("め", "me"),
        new Array("も", "mo"),

        new Array("み", "mi"),
        new Array("みぃ", "myi"),
        new Array("みぇ", "mye"),
        new Array("みゃ", "mya"),
        new Array("みゅ", "myu"),
        new Array("みょ", "myo"),
        new Array("みぃ", "mixi"),
        new Array("みぇ", "mixe"),
        new Array("みゃ", "mixya"),
        new Array("みゅ", "mixyu"),
        new Array("みょ", "mixyo"),
//////////////////////////////////////////////////
        new Array("ゃ", "xya"),
        new Array("や", "ya"),

        new Array("ゅ", "xyu"),
        new Array("ゆ", "yu"),

        new Array("ょ", "xyo"),
        new Array("よ", "yo"),
//////////////////////////////////////////////////
        new Array("ら", "ra"),
        new Array("る", "ru"),
        new Array("れ", "re"),
        new Array("ろ", "ro"),

        new Array("り", "ri"),
        new Array("りぃ", "ryi"),
        new Array("りぇ", "rye"),
        new Array("りゃ", "rya"),
        new Array("りゅ", "ryu"),
        new Array("りょ", "ryo"),
        new Array("りぃ", "rixi"),
        new Array("りぇ", "rixe"),
        new Array("りゃ", "rixya"),
        new Array("りゅ", "rixyu"),
        new Array("りょ", "rixyo"),
//////////////////////////////////////////////////
        new Array("わ", "wa"),
        new Array("ゐ", "wi"),
        new Array("ゑ", "we"),
        new Array("を", "wo"),
//////////////////////////////////////////////////
        new Array("ん", "n"),
        new Array("ん", "nn"),
//////////////////////////////////////////////////
        new Array("ゔ", "vu"),
        new Array("ゔぁ", "va"),
        new Array("ゔぃ", "vi"),
        new Array("ゔぇ", "ve"),
        new Array("ゔぉ", "vo"),
//////////////////////////////////////////////////
        new Array("っ", "xtu"),
        new Array("っ", "xtsu"),
        /* the rest of っ- will be automatically generated */
//////////////////////////////////////////////////
        new Array("ァ", "xa"),
        new Array("ア", "a"),

        new Array("ィ", "xi"),
        new Array("イ", "i"),
        new Array("イィ", "yi"),
        new Array("イェ", "ye"),

        new Array("ゥ", "xu"),
        new Array("ウ", "u"),
        new Array("ウァ", "wa"),
        new Array("ウィ", "wi"),
        new Array("ウゥ", "wu"),
        new Array("ウェ", "we"),
        new Array("ウォ", "wo"),

        new Array("ェ", "xe"),
        new Array("エ", "e"),

        new Array("ォ", "xo"),
        new Array("オ", "o"),
//////////////////////////////////////////////////
        new Array("カ", "ka"),
        new Array("ガ", "ga"),

        new Array("キ", "ki"),
        new Array("キィ", "kyi"),
        new Array("キェ", "kye"),
        new Array("キャ", "kya"),
        new Array("キュ", "kyu"),
        new Array("キョ", "kyo"),

        new Array("ギ", "gi"),
        new Array("ギィ", "gyi"),
        new Array("ギェ", "gye"),
        new Array("ギャ", "gya"),
        new Array("ギュ", "gyu"),
        new Array("ギョ", "gyo"),

        new Array("ク", "ku"),
        new Array("クァ", "kwa"),
        new Array("クィ", "kwi"),
        new Array("クゥ", "kwu"),
        new Array("クェ", "kwe"),
        new Array("クォ", "kwo"),

        new Array("グ", "gu"),
        new Array("グァ", "gwa"),
        new Array("グィ", "gwi"),
        new Array("グゥ", "gwu"),
        new Array("グェ", "gwe"),
        new Array("グォ", "gwo"),

        new Array("ケ", "ke"),
        new Array("ゲ", "ge"),

        new Array("コ", "ko"),
        new Array("ゴ", "go"),
//////////////////////////////////////////////////
        new Array("サ", "sa"),
        new Array("ザ", "za"),

        new Array("シ", "shi"),
        new Array("シェ", "she"),
        new Array("シャ", "sha"),
        new Array("シュ", "shu"),
        new Array("ショ", "sho"),

        new Array("ジ", "ji"),
        new Array("ジィ", "jyi"),
        new Array("ジェ", "je"),
        new Array("ジャ", "ja"),
        new Array("ジュ", "ju"),
        new Array("ジョ", "jo"),

        new Array("ス", "su"),
        new Array("スァ", "sa"),
        new Array("スィ", "si"),
        new Array("スゥ", "su"),
        new Array("スェ", "se"),
        new Array("スォ", "so"),
        new Array("ズ", "zu"),

        new Array("セ", "se"),
        new Array("ゼ", "ze"),

        new Array("ソ", "so"),
        new Array("ゾ", "zo"),
//////////////////////////////////////////////////
        new Array("タ", "ta"),
        new Array("ダ", "da"),

        new Array("チ", "chi"),
        new Array("チェ", "che"),
        new Array("チャ", "cha"),
        new Array("チュ", "chu"),
        new Array("チョ", "cho"),

        new Array("ヂ", "dji"),
        new Array("ヂェ", "dje"),
        new Array("ヂャ", "dja"),
        new Array("ヂュ", "dju"),
        new Array("ヂョ", "djo"),

        new Array("ッ", "xtsu"),
        new Array("ツ", "tsu"),
        new Array("ツァ", "tsa"),
        new Array("ツィ", "tsi"),
        new Array("ツェ", "tse"),
        new Array("ツォ", "tso"),
        new Array("ヅ", "dzu"),

        new Array("テ", "te"),
        new Array("ティ", "ti"),

        new Array("デ", "de"),
        new Array("ディ", "di"),

        new Array("ト", "to"),
        new Array("トァ", "ta"),
        new Array("トゥ", "tu"),
        new Array("トェ", "te"),
        new Array("トォ", "to"),

        new Array("ド", "do"),
        new Array("ドゥ", "du"),
//////////////////////////////////////////////////
        new Array("ナ", "na"),
        new Array("ニ", "ni"),
        new Array("ニィ", "nyi"),
        new Array("ニェ", "nye"),
        new Array("ニャ", "nya"),
        new Array("ニュ", "nyu"),
        new Array("ニョ", "nyo"),
        new Array("ヌ", "nu"),
        new Array("ネ", "ne"),
        new Array("ノ", "no"),
//////////////////////////////////////////////////
        new Array("ハ", "ha"),
        new Array("バ", "ba"),
        new Array("パ", "pa"),
        new Array("ヒ", "hi"),
        new Array("ヒィ", "hyi"),
        new Array("ヒェ", "hye"),
        new Array("ヒャ", "hya"),
        new Array("ヒュ", "hyu"),
        new Array("ヒョ", "hyo"),
        new Array("ビ", "bi"),
        new Array("ビィ", "byi"),
        new Array("ビェ", "bye"),
        new Array("ビャ", "bya"),
        new Array("ビュ", "byu"),
        new Array("ビョ", "byo"),
        new Array("ピ", "pi"),
        new Array("ピィ", "pyi"),
        new Array("ピェ", "pye"),
        new Array("ピャ", "pya"),
        new Array("ピュ", "pyu"),
        new Array("ピョ", "pyo"),
        new Array("フ", "fu"),
        new Array("ファ", "fa"),
        new Array("フィ", "fi"),
        new Array("フェ", "fe"),
        new Array("フォ", "fo"),
        new Array("フャ", "fya"),
        new Array("フュ", "fyu"),
        new Array("フョ", "fyo"),
        new Array("ブ", "bu"),
        new Array("プ", "pu"),
        new Array("ヘ", "he"),
        new Array("ベ", "be"),
        new Array("ペ", "pe"),
        new Array("ホ", "ho"),
        new Array("ボ", "bo"),
        new Array("ポ", "po"),
//////////////////////////////////////////////////
        new Array("マ", "ma"),
        new Array("ミ", "mi"),
        new Array("ミィ", "myi"),
        new Array("ミェ", "mye"),
        new Array("ミャ", "mya"),
        new Array("ミュ", "myu"),
        new Array("ミョ", "myo"),
        new Array("ム", "mu"),
        new Array("メ", "me"),
        new Array("モ", "mo"),
//////////////////////////////////////////////////
        new Array("ャ", "xya"),
        new Array("ヤ", "ya"),
        new Array("ュ", "xyu"),
        new Array("ユ", "yu"),
        new Array("ョ", "xyo"),
        new Array("ヨ", "yo"),
//////////////////////////////////////////////////
        new Array("ラ", "ra"),
        new Array("リ", "ri"),
        new Array("リィ", "ryi"),
        new Array("リェ", "rye"),
        new Array("リャ", "rya"),
        new Array("リュ", "ryu"),
        new Array("リョ", "ryo"),
        new Array("ル", "ru"),
        new Array("レ", "re"),
        new Array("ロ", "ro"),
//////////////////////////////////////////////////
        new Array("ワ", "wa"),
        new Array("ヰ", "wi"),
        new Array("ヱ", "we"),
        new Array("ヲ", "wo"),
//////////////////////////////////////////////////
        new Array("ン", "n"),
//////////////////////////////////////////////////
        new Array("ヴ", "vu"),
        new Array("ヴァ", "va"),
        new Array("ヴィ", "vi"),
        new Array("ヴェ", "ve"),
        new Array("ヴォ", "vo"),
        new Array("ヵ", "xka"),
        new Array("ヶ", "xke"),
        new Array("ー", "-"),

        // placeholder to end the array, so that I dont have to readjust the commas
        // every time I add more entries and re-sort the list above　
        new Array("ー", "ー")
    );

    var hash = {};
    var maxlen = 0;

    function appendTable(kana, romaji) {
        if (kana in hash)
            hash[kana].push(romaji);
        else
            hash[kana] = new Array(romaji);

        if (maxlen < kana.length)
            maxlen = kana.length;
    }

    for (var i = 0; i < romajitable.length; i++) {
        // Normal romaji
        appendTable(romajitable[i][0], romajitable[i][1]);

        // Prefix with っ
        appendTable('っ' + romajitable[i][0], romajitable[i][1].charAt(0) + romajitable[i][1]);
        appendTable('っ' + romajitable[i][0], 'xtsu' + romajitable[i][1]);
        appendTable('っ' + romajitable[i][0], 'xtu' + romajitable[i][1]);

        // Prefix with ッ
        appendTable('ッ' + romajitable[i][0], romajitable[i][1].charAt(0) + romajitable[i][1]);
        appendTable('ッ' + romajitable[i][0], 'xtsu' + romajitable[i][1]);
        appendTable('ッ' + romajitable[i][0], 'xtu' + romajitable[i][1]);

    }

    var Kana = {};

    Kana.getPossibleRomaji = function (kana) {
        if (kana in hash)
            return hash[kana];
        return [kana];
    };

    Kana.splitKana = function (kana) {
        var ret = [];
        var pos = 0;
        while (pos < kana.length) {
            var len = maxlen;
            if (kana.length - pos < len) {
                len = kana.length - pos;
            }
            var found = false;
            while (len > 0 && !found) {
                if (kana.substring(pos, pos + len) in hash) {
                    ret.push(kana.substring(pos, pos + len));
                    pos += len;
                    found = true;
                }
                len--;
            }
            if (!found) {
                ret.push(kana.charAt(pos));
                pos++;
            }
        }
        return ret;
    };

    Kana.convertToRomaji = function (kana) {
        var romaji = "";
        Kana.splitKana(kana).forEach(function (c) {
            if (c in hash) {
                romaji += hash[c][0];
            } else {
                romaji += c;
            }
        });
        return romaji;
    };

    return Kana;
})();
