var Kana = (function() {
    /**
     * This table contains all possible Romaji-Kana pair that will be used in the game.
     * The first pair of each Kana denote the Romaji will be used in displaying the lyrics,
     * while subsequent pair denote pair possible to type in.
     *
     * @type {Array}
     */
    romajitable = new Array(
//////////////////////////////////////////////////
        new Array("ぁ", "xa"),
        new Array("あ", "a"),
//        new Array("ああ", "aa"),

        new Array("ぃ", "xi"),
        new Array("い", "i"),
        new Array("いぃ", "yi"),
        new Array("いぃ", "ixi"),
//        new Array("いぃい", "yii"),
//        new Array("いぃい", "ixii"),
//        new Array("いい", "ii"),
        new Array("いぇ", "ye"),
        new Array("いぇえ", "yee"),

        new Array("ぅ", "xu"),
        new Array("う", "u"),
        new Array("うぁ", "wa"),
        new Array("うぁ", "uxa"),
        new Array("うぁあ", "waa"),
        new Array("うぁあ", "uxaa"),
        new Array("うぃ", "wi"),
        new Array("うぃ", "uxi"),
        new Array("うぃい", "wii"),
        new Array("うぃい", "uxii"),
        new Array("うぅ", "wu"),
        new Array("うぅ", "uxu"),
        new Array("うぅう", "wuu"),
        new Array("うぅう", "uxuu"),
        new Array("うう", "uu"),
        new Array("うぇ", "we"),
        new Array("うぇ", "uxe"),
        new Array("うぇえ", "wee"),
        new Array("うぇえ", "uxee"),
        new Array("うぉ", "wo"),
        new Array("うぉ", "uxo"),
        new Array("うぉう", "wou"),
        new Array("うぉう", "uxou"),
        new Array("うぉお", "woo"),
        new Array("うぉお", "uxoo"),

        new Array("ぇ", "xe"),
        new Array("え", "e"),
        new Array("ええ", "ee"),

        new Array("ぉ", "xo"),
        new Array("お", "o"),
        new Array("おう", "ou"),
        new Array("おお", "oo"),
//////////////////////////////////////////////////
        new Array("か", "ka"),
        new Array("かあ", "kaa"),

        new Array("が", "ga"),
        new Array("があ", "gaa"),

        new Array("き", "ki"),
        new Array("きぃ", "kyi"),
        new Array("きぃい", "kyii"),
        new Array("きい", "kii"),
        new Array("きぇ", "kye"),
        new Array("きぇえ", "kyee"),
        new Array("きゃ", "kya"),
        new Array("きゃあ", "kyaa"),
        new Array("きゅ", "kyu"),
        new Array("きゅう", "kyuu"),
        new Array("きょ", "kyo"),
        new Array("きょう", "kyou"),
        new Array("きょお", "kyoo"),

        new Array("ぎ", "gi"),
        new Array("ぎぃ", "gyi"),
        new Array("ぎぃい", "gyii"),
        new Array("ぎい", "gii"),
        new Array("ぎぇ", "gye"),
        new Array("ぎぇえ", "gyee"),
        new Array("ぎゃ", "gya"),
        new Array("ぎゃあ", "gyaa"),
        new Array("ぎゅ", "gyu"),
        new Array("ぎゅう", "gyuu"),
        new Array("ぎょ", "gyo"),
        new Array("ぎょう", "gyou"),
        new Array("ぎょお", "gyoo"),

        new Array("く", "ku"),
        new Array("くぁ", "kwa"),
        new Array("くぁあ", "kwaa"),
        new Array("くぃ", "kwi"),
        new Array("くぃい", "kwii"),
        new Array("くぅ", "kwu"),
        new Array("くぅう", "kwuu"),
        new Array("くう", "kuu"),
        new Array("くぇ", "kwe"),
        new Array("くぇえ", "kwee"),
        new Array("くぉ", "kwo"),
        new Array("くぉう", "kwou"),
        new Array("くぉお", "kwoo"),

        new Array("ぐ", "gu"),
        new Array("ぐぁ", "gwa"),
        new Array("ぐぁあ", "gwaa"),
        new Array("ぐぃ", "gwi"),
        new Array("ぐぃい", "gwii"),
        new Array("ぐぅ", "gwu"),
        new Array("ぐぅう", "gwuu"),
        new Array("ぐう", "guu"),
        new Array("ぐぇ", "gwe"),
        new Array("ぐぇえ", "gwee"),
        new Array("ぐぉ", "gwo"),
        new Array("ぐぉう", "gwou"),
        new Array("ぐぉお", "gwoo"),

        new Array("け", "ke"),
        new Array("けえ", "kee"),
        new Array("げ", "ge"),
        new Array("げえ", "gee"),

        new Array("こ", "ko"),
        new Array("こう", "kou"),
        new Array("こお", "koo"),
        new Array("ご", "go"),
        new Array("ごう", "gou"),
        new Array("ごお", "goo"),
//////////////////////////////////////////////////
        new Array("さ", "sa"),
        new Array("さあ", "saa"),
        new Array("ざ", "za"),
        new Array("ざあ", "zaa"),

        new Array("し", "shi"),
        new Array("しい", "shii"),
        new Array("しぇ", "she"),
        new Array("しぇえ", "shee"),
        new Array("しゃ", "sha"),
        new Array("しゃあ", "shaa"),
        new Array("しゅ", "shu"),
        new Array("しゅう", "shuu"),
        new Array("しょ", "sho"),
        new Array("しょう", "shou"),
        new Array("しょお", "shoo"),

        new Array("じ", "ji"),
        new Array("じぃ", "jyi"),
        new Array("じぃい", "jyii"),
        new Array("じい", "jii"),
        new Array("じぇ", "je"),
        new Array("じぇえ", "jee"),
        new Array("じゃ", "ja"),
        new Array("じゃあ", "jaa"),
        new Array("じゅ", "ju"),
        new Array("じゅう", "juu"),
        new Array("じょ", "jo"),
        new Array("じょう", "jou"),
        new Array("じょお", "joo"),

        new Array("す", "su"),
        new Array("すぁ", "sa"),
        new Array("すぁあ", "saa"),
        new Array("すぃ", "si"),
        new Array("すぃい", "sii"),
        new Array("すぅ", "su"),
        new Array("すぅう", "suu"),
        new Array("すう", "suu"),
        new Array("すぇ", "se"),
        new Array("すぇえ", "see"),
        new Array("すぉ", "so"),
        new Array("すぉう", "sou"),
        new Array("すぉお", "soo"),

        new Array("ず", "zu"),
        new Array("ずう", "zuu"),

        new Array("せ", "se"),
        new Array("せえ", "see"),

        new Array("ぜ", "ze"),
        new Array("ぜえ", "zee"),

        new Array("そ", "so"),
        new Array("そう", "sou"),
        new Array("そお", "soo"),

        new Array("ぞ", "zo"),
        new Array("ぞう", "zou"),
        new Array("ぞお", "zoo"),

        new Array("た", "ta"),
        new Array("たあ", "taa"),

        new Array("だ", "da"),
        new Array("だあ", "daa"),

        new Array("ち", "chi"),
        new Array("ちい", "chii"),
        new Array("ちぇ", "che"),
        new Array("ちぇえ", "chee"),
        new Array("ちゃ", "cha"),
        new Array("ちゃあ", "chaa"),
        new Array("ちゅ", "chu"),
        new Array("ちゅう", "chuu"),
        new Array("ちょ", "cho"),
        new Array("ちょう", "chou"),
        new Array("ちょお", "choo"),

        new Array("ぢ", "dji"),
        new Array("ぢい", "djii"),
        new Array("ぢぇ", "dje"),
        new Array("ぢぇえ", "djee"),
        new Array("ぢゃ", "dja"),
        new Array("ぢゃあ", "djaa"),
        new Array("ぢゅ", "dju"),
        new Array("ぢゅう", "djuu"),
        new Array("ぢょ", "djo"),
        new Array("ぢょう", "djou"),
        new Array("ぢょお", "djoo"),

        new Array("っ", "xtsu"),
        new Array("っいぃ", "yyi"),
        new Array("っいぃい", "yyii"),
        new Array("っいぇ", "yye"),
        new Array("っいぇえ", "yyee"),
        new Array("っうぁ", "wwa"),
        new Array("っうぁあ", "wwaa"),
        new Array("っうぃ", "wwi"),
        new Array("っうぃい", "wwii"),
        new Array("っうぅ", "wwu"),
        new Array("っうぅう", "wwuu"),
        new Array("っうぇ", "wwe"),
        new Array("っうぇえ", "wwee"),
        new Array("っうぉ", "wwo"),
        new Array("っうぉう", "wwou"),
        new Array("っうぉお", "wwoo"),
        new Array("っか", "kka"),
        new Array("っかあ", "kkaa"),
        new Array("っが", "gga"),
        new Array("っがあ", "ggaa"),
        new Array("っき", "kki"),
        new Array("っきぃ", "kkyi"),
        new Array("っきぃい", "kkyii"),
        new Array("っきい", "kkii"),
        new Array("っきぇ", "kkye"),
        new Array("っきぇえ", "kkyee"),
        new Array("っきさ", "xxa"),
        new Array("っきさあ", "xxaa"),
        new Array("っきし", "xxi"),
        new Array("っきしい", "xxii"),
        new Array("っきす", "xxu"),
        new Array("っきすう", "xxuu"),
        new Array("っきせ", "xxe"),
        new Array("っきせえ", "xxee"),
        new Array("っきそ", "xxo"),
        new Array("っきそう", "xxou"),
        new Array("っきそお", "xxoo"),
        new Array("っきゃ", "kkya"),
        new Array("っきゃあ", "kkyaa"),
        new Array("っきゅ", "kkyu"),
        new Array("っきゅう", "kkyuu"),
        new Array("っきょ", "kkyo"),
        new Array("っきょう", "kkyou"),
        new Array("っきょお", "kkyoo"),
        new Array("っぎ", "ggi"),
        new Array("っぎぃ", "ggyi"),
        new Array("っぎぃい", "ggyii"),
        new Array("っぎい", "ggii"),
        new Array("っぎぇ", "ggye"),
        new Array("っぎぇえ", "ggyee"),
        new Array("っぎゃ", "ggya"),
        new Array("っぎゃあ", "ggyaa"),
        new Array("っぎゅ", "ggyu"),
        new Array("っぎゅう", "ggyuu"),
        new Array("っぎょ", "ggyo"),
        new Array("っぎょう", "ggyou"),
        new Array("っぎょお", "ggyoo"),
        new Array("っく", "kku"),
        new Array("っくぁ", "kkwa"),
        new Array("っくぁあ", "kkwaa"),
        new Array("っくぃ", "kkwi"),
        new Array("っくぃい", "kkwii"),
        new Array("っくぅ", "kkwu"),
        new Array("っくぅう", "kkwuu"),
        new Array("っくう", "kkuu"),
        new Array("っくぇ", "kkwe"),
        new Array("っくぇえ", "kkwee"),
        new Array("っくぉ", "kkwo"),
        new Array("っくぉう", "kkwou"),
        new Array("っくぉお", "kkwoo"),
        new Array("っぐ", "ggu"),
        new Array("っぐぁ", "ggwa"),
        new Array("っぐぁあ", "ggwaa"),
        new Array("っぐぃ", "ggwi"),
        new Array("っぐぃい", "ggwii"),
        new Array("っぐぅ", "ggwu"),
        new Array("っぐぅう", "ggwuu"),
        new Array("っぐう", "gguu"),
        new Array("っぐぇ", "ggwe"),
        new Array("っぐぇえ", "ggwee"),
        new Array("っぐぉ", "ggwo"),
        new Array("っぐぉう", "ggwou"),
        new Array("っぐぉお", "ggwoo"),
        new Array("っけ", "kke"),
        new Array("っけえ", "kkee"),
        new Array("っげ", "gge"),
        new Array("っげえ", "ggee"),
        new Array("っこ", "kko"),
        new Array("っこう", "kkou"),
        new Array("っこお", "kkoo"),
        new Array("っご", "ggo"),
        new Array("っごう", "ggou"),
        new Array("っごお", "ggoo"),
        new Array("っさ", "ssa"),
        new Array("っさあ", "ssaa"),
        new Array("っざ", "zza"),
        new Array("っざあ", "zzaa"),
        new Array("っし", "sshi"),
        new Array("っしい", "sshii"),
        new Array("っしぇ", "sshe"),
        new Array("っしぇえ", "sshee"),
        new Array("っしゃ", "ssha"),
        new Array("っしゃあ", "sshaa"),
        new Array("っしゅ", "sshu"),
        new Array("っしゅう", "sshuu"),
        new Array("っしょ", "ssho"),
        new Array("っしょう", "sshou"),
        new Array("っじ", "jji"),
        new Array("っじぃ", "jjyi"),
        new Array("っじぃい", "jjyii"),
        new Array("っじい", "jjii"),
        new Array("っじぇ", "jje"),
        new Array("っじぇえ", "jjee"),
        new Array("っじゃ", "jja"),
        new Array("っじゃあ", "jjaa"),
        new Array("っじゅ", "jju"),
        new Array("っじゅう", "jjuu"),
        new Array("っじょ", "jjo"),
        new Array("っじょう", "jjou"),
        new Array("っじょお", "jjoo"),
        new Array("っす", "ssu"),
        new Array("っすぁ", "ssa"),
        new Array("っすぁあ", "ssaa"),
        new Array("っすぃ", "ssi"),
        new Array("っすぃい", "ssii"),
        new Array("っすぅ", "ssu"),
        new Array("っすぅう", "ssuu"),
        new Array("っすう", "ssuu"),
        new Array("っすぇ", "sse"),
        new Array("っすぇえ", "ssee"),
        new Array("っすぉ", "sso"),
        new Array("っすぉう", "ssou"),
        new Array("っすぉお", "ssoo"),
        new Array("っず", "zzu"),
        new Array("っずう", "zzuu"),
        new Array("っせ", "sse"),
        new Array("っせえ", "ssee"),
        new Array("っぜ", "zze"),
        new Array("っぜえ", "zzee"),
        new Array("っそ", "sso"),
        new Array("っそう", "ssou"),
        new Array("っそお", "ssoo"),
        new Array("っぞ", "zzo"),
        new Array("っぞう", "zzou"),
        new Array("っぞお", "zzoo"),
        new Array("った", "tta"),
        new Array("ったあ", "ttaa"),
        new Array("っだ", "dda"),
        new Array("っだあ", "ddaa"),
        new Array("っち", "cchi"),
        new Array("っちい", "cchii"),
        new Array("っちぇ", "cche"),
        new Array("っちぇえ", "cchee"),
        new Array("っちゃ", "ccha"),
        new Array("っちゃあ", "cchaa"),
        new Array("っちゅ", "cchu"),
        new Array("っちゅう", "cchuu"),
        new Array("っちょ", "ccho"),
        new Array("っちょう", "cchou"),
        new Array("っちょお", "cchoo"),
        new Array("っぢ", "ddji"),
        new Array("っぢい", "ddjii"),
        new Array("っぢぇ", "ddje"),
        new Array("っぢぇえ", "ddjee"),
        new Array("っぢゃ", "ddja"),
        new Array("っぢゃあ", "ddjaa"),
        new Array("っぢゅ", "ddju"),
        new Array("っぢゅう", "ddjuu"),
        new Array("っぢょ", "ddjo"),
        new Array("っぢょう", "ddjou"),
        new Array("っぢょお", "ddjoo"),
        new Array("っつ", "ttsu"),
        new Array("っつぁ", "ttsa"),
        new Array("っつぁあ", "ttsaa"),
        new Array("っつぃ", "ttsi"),
        new Array("っつぃい", "ttsii"),
        new Array("っつう", "ttsuu"),
        new Array("っつぇ", "ttse"),
        new Array("っつぇえ", "ttsee"),
        new Array("っつぉ", "ttso"),
        new Array("っつぉう", "ttsou"),
        new Array("っつぉお", "ttsoo"),
        new Array("っづ", "ddzu"),
        new Array("って", "tte"),
        new Array("ってぃ", "tti"),
        new Array("ってぃい", "ttii"),
        new Array("ってえ", "ttee"),
        new Array("っで", "dde"),
        new Array("っでえ", "ddee"),
        new Array("っと", "tto"),
        new Array("っとぁ", "tta"),
        new Array("っとぁあ", "ttaa"),
        new Array("っとぅ", "ttu"),
        new Array("っとう", "ttou"),
        new Array("っとぇ", "tte"),
        new Array("っとぇえ", "ttee"),
        new Array("っとぉ", "tto"),
        new Array("っとぉう", "ttou"),
        new Array("っとぉお", "ttoo"),
        new Array("っとお", "ttoo"),
        new Array("っど", "ddo"),
        new Array("っどう", "ddou"),
        new Array("っどお", "ddoo"),
        new Array("っは", "hha"),
        new Array("っはあ", "hhaa"),
        new Array("っば", "bba"),
        new Array("っばあ", "bbaa"),
        new Array("っぱ", "ppa"),
        new Array("っぱあ", "ppaa"),
        new Array("っひ", "hhi"),
        new Array("っひぃ", "hhyi"),
        new Array("っひぃい", "hhyii"),
        new Array("っひい", "hhii"),
        new Array("っひぇ", "hhye"),
        new Array("っひぇえ", "hhyee"),
        new Array("っひゃ", "hhya"),
        new Array("っひゃあ", "hhyaa"),
        new Array("っひゅ", "hhyu"),
        new Array("っひゅう", "hhyuu"),
        new Array("っひょ", "hhyo"),
        new Array("っひょう", "hhyou"),
        new Array("っひょお", "hhyoo"),
        new Array("っび", "bbi"),
        new Array("っびぃ", "bbyi"),
        new Array("っびぃい", "bbyii"),
        new Array("っびい", "bbii"),
        new Array("っびぇ", "bbye"),
        new Array("っびぇえ", "bbyee"),
        new Array("っびゃ", "bbya"),
        new Array("っびゃあ", "bbyaa"),
        new Array("っびゅ", "bbyu"),
        new Array("っびゅう", "bbyuu"),
        new Array("っびょ", "bbyo"),
        new Array("っびょう", "bbyou"),
        new Array("っびょお", "bbyoo"),
        new Array("っぴ", "ppi"),
        new Array("っぴぃ", "ppyi"),
        new Array("っぴぃい", "ppyii"),
        new Array("っぴい", "ppii"),
        new Array("っぴぇ", "ppye"),
        new Array("っぴぇえ", "ppyee"),
        new Array("っぴゃ", "ppya"),
        new Array("っぴゃあ", "ppyaa"),
        new Array("っぴゅ", "ppyu"),
        new Array("っぴゅう", "ppyuu"),
        new Array("っぴょ", "ppyo"),
        new Array("っぴょう", "ppyou"),
        new Array("っぴょお", "ppyoo"),
        new Array("っふ", "ffu"),
        new Array("っふぁ", "ffa"),
        new Array("っふぁあ", "ffaa"),
        new Array("っふぃ", "ffi"),
        new Array("っふぃい", "ffii"),
        new Array("っふう", "ffuu"),
        new Array("っふぇ", "ffe"),
        new Array("っふぇえ", "ffee"),
        new Array("っふぉ", "ffo"),
        new Array("っふぉう", "ffou"),
        new Array("っふぉお", "ffoo"),
        new Array("っふゃ", "ffya"),
        new Array("っふゃあ", "ffyaa"),
        new Array("っふゅ", "ffyu"),
        new Array("っふゅう", "ffyuu"),
        new Array("っふょ", "ffyo"),
        new Array("っふょう", "ffyou"),
        new Array("っふょお", "ffyoo"),
        new Array("っぶ", "bbu"),
        new Array("っぶう", "bbuu"),
        new Array("っぷ", "ppu"),
        new Array("っぷう", "ppuu"),
        new Array("っへ", "hhe"),
        new Array("っへえ", "hhee"),
        new Array("っべ", "bbe"),
        new Array("っべえ", "bbee"),
        new Array("っぺ", "ppe"),
        new Array("っぺえ", "ppee"),
        new Array("っほ", "hho"),
        new Array("っほう", "hhou"),
        new Array("っほお", "hhoo"),
        new Array("っぼ", "bbo"),
        new Array("っぼう", "bbou"),
        new Array("っぼお", "bboo"),
        new Array("っぽ", "ppo"),
        new Array("っぽう", "ppou"),
        new Array("っぽお", "ppoo"),
        new Array("っや", "yya"),
        new Array("っやあ", "yyaa"),
        new Array("っゆ", "yyu"),
        new Array("っゆう", "yyuu"),
        new Array("っよ", "yyo"),
        new Array("っよう", "yyou"),
        new Array("っよお", "yyoo"),
        new Array("っら", "rra"),
        new Array("っらあ", "rraa"),
        new Array("っり", "rri"),
        new Array("っりぃ", "rryi"),
        new Array("っりぃい", "rryii"),
        new Array("っりい", "rrii"),
        new Array("っりぇ", "rrye"),
        new Array("っりぇえ", "rryee"),
        new Array("っりゃ", "rrya"),
        new Array("っりゃあ", "rryaa"),
        new Array("っりゅ", "rryu"),
        new Array("っりゅう", "rryuu"),
        new Array("っりょ", "rryo"),
        new Array("っりょう", "rryou"),
        new Array("っりょお", "rryoo"),
        new Array("っる", "rru"),
        new Array("っるう", "rruu"),
        new Array("っれ", "rre"),
        new Array("っれえ", "rree"),
        new Array("っろ", "rro"),
        new Array("っろう", "rrou"),
        new Array("っろお", "rroo"),
        new Array("っわ", "wwa"),
        new Array("っわあ", "wwaa"),
        new Array("っゐ", "wwi"),
        new Array("っゐい", "wwii"),
        new Array("っゑ", "wwe"),
        new Array("っゑえ", "wwee"),
        new Array("っを", "wwo"),
        new Array("っをう", "wwou"),
        new Array("っをお", "wwoo"),
        new Array("っゔ", "vvu"),
        new Array("っゔぁ", "vva"),
        new Array("っゔぁあ", "vvaa"),
        new Array("っゔぃ", "vvi"),
        new Array("っゔぃい", "vvii"),
        new Array("っゔう", "vvuu"),
        new Array("っゔぇ", "vve"),
        new Array("っゔぇえ", "vvee"),
        new Array("っゔぉ", "vvo"),
        new Array("っゔぉう", "vvou"),
        new Array("っゔぉお", "vvoo"),
        new Array("つ", "tsu"),
        new Array("つぁ", "tsa"),
        new Array("つぁあ", "tsaa"),
        new Array("つぃ", "tsi"),
        new Array("つぃい", "tsii"),
        new Array("つう", "tsuu"),
        new Array("つぇ", "tse"),
        new Array("つぇえ", "tsee"),
        new Array("つぉ", "tso"),
        new Array("つぉう", "tsou"),
        new Array("つぉお", "tsoo"),

        new Array("づ", "du"),
        new Array("づ", "dzu"),
        new Array("づう", "dzuu"),

        new Array("て", "te"),
        new Array("てぃ", "ti"),
        new Array("てぃい", "tii"),
        new Array("てえ", "tee"),
        new Array("で", "de"),
        new Array("でぃ", "di"),
        new Array("でぃい", "dii"),
        new Array("でえ", "dee"),
        new Array("と", "to"),
        new Array("とぁ", "ta"),
        new Array("とぁあ", "taa"),
        new Array("とぅ", "tu"),
        new Array("とう", "tou"),
        new Array("とぇ", "te"),
        new Array("とぇえ", "tee"),
        new Array("とぉ", "to"),
        new Array("とぉう", "tou"),
        new Array("とぉお", "too"),
        new Array("とお", "too"),
        new Array("ど", "do"),
        new Array("どぅ", "du"),
        new Array("どぅう", "duu"),
        new Array("どう", "dou"),
        new Array("どお", "doo"),
//////////////////////////////////////////////////
        new Array("な", "na"),
        new Array("なあ", "naa"),
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
        new Array("ぬ", "nu"),
        new Array("ぬう", "nuu"),
        new Array("ね", "ne"),
        new Array("ねえ", "nee"),
        new Array("の", "no"),
        new Array("のう", "nou"),
        new Array("のお", "noo"),
//////////////////////////////////////////////////
        new Array("は", "ha"),
        new Array("はあ", "haa"),
        new Array("ば", "ba"),
        new Array("ぱ", "pa"),
        new Array("ぱあ", "paa"),
        new Array("ひ", "hi"),
        new Array("ひぃ", "hyi"),
        new Array("ひぃい", "hyii"),
        new Array("ひい", "hii"),
        new Array("ひぇ", "hye"),
        new Array("ひぇえ", "hyee"),
        new Array("ひゃ", "hya"),
        new Array("ひゃあ", "hyaa"),
        new Array("ひゅ", "hyu"),
        new Array("ひゅう", "hyuu"),
        new Array("ひょ", "hyo"),
        new Array("ひょう", "hyou"),
        new Array("ひょお", "hyoo"),
        new Array("び", "bi"),
        new Array("びぃ", "byi"),
        new Array("びぃい", "byii"),
        new Array("びい", "bii"),
        new Array("びぇ", "bye"),
        new Array("びぇえ", "byee"),
        new Array("びゃ", "bya"),
        new Array("びゃあ", "byaa"),
        new Array("びゅ", "byu"),
        new Array("びゅう", "byuu"),
        new Array("びょ", "byo"),
        new Array("びょう", "byou"),
        new Array("びょお", "byoo"),
        new Array("ぴ", "pi"),
        new Array("ぴぃ", "pyi"),
        new Array("ぴぃい", "pyii"),
        new Array("ぴい", "pii"),
        new Array("ぴぇ", "pye"),
        new Array("ぴぇえ", "pyee"),
        new Array("ぴゃ", "pya"),
        new Array("ぴゃあ", "pyaa"),
        new Array("ぴゅ", "pyu"),
        new Array("ぴゅう", "pyuu"),
        new Array("ぴょ", "pyo"),
        new Array("ぴょう", "pyou"),
        new Array("ぴょお", "pyoo"),
        new Array("ふ", "fu"),
        new Array("ふぁ", "fa"),
        new Array("ふぁあ", "faa"),
        new Array("ふぃ", "fi"),
        new Array("ふぃい", "fii"),
        new Array("ふう", "fuu"),
        new Array("ふぇ", "fe"),
        new Array("ふぇえ", "fee"),
        new Array("ふぉ", "fo"),
        new Array("ふぉう", "fou"),
        new Array("ふぉお", "foo"),
        new Array("ふゃ", "fya"),
        new Array("ふゃあ", "fyaa"),
        new Array("ふゅ", "fyu"),
        new Array("ふゅう", "fyuu"),
        new Array("ふょ", "fyo"),
        new Array("ふょう", "fyou"),
        new Array("ふょお", "fyoo"),
        new Array("ぶ", "bu"),
        new Array("ぶう", "buu"),
        new Array("ぷ", "pu"),
        new Array("ぷう", "puu"),
        new Array("へ", "he"),
        new Array("へえ", "hee"),
        new Array("べ", "be"),
        new Array("べえ", "bee"),
        new Array("ぺ", "pe"),
        new Array("ぺえ", "pee"),
        new Array("ほ", "ho"),
        new Array("ほう", "hou"),
        new Array("ほお", "hoo"),
        new Array("ぼ", "bo"),
        new Array("ぼう", "bou"),
        new Array("ぼお", "boo"),
        new Array("ぽ", "po"),
        new Array("ぽう", "pou"),
        new Array("ぽお", "poo"),
//////////////////////////////////////////////////
        new Array("ま", "ma"),
        new Array("まあ", "maa"),
        new Array("み", "mi"),
        new Array("みぃ", "myi"),
        new Array("みぃい", "myii"),
        new Array("みい", "mii"),
        new Array("みぇ", "mye"),
        new Array("みぇえ", "myee"),
        new Array("みゃ", "mya"),
        new Array("みゃあ", "myaa"),
        new Array("みゅ", "myu"),
        new Array("みゅう", "myuu"),
        new Array("みょ", "myo"),
        new Array("みょう", "myou"),
        new Array("みょお", "myoo"),
        new Array("む", "mu"),
        new Array("むう", "muu"),
        new Array("め", "me"),
        new Array("めえ", "mee"),
        new Array("も", "mo"),
        new Array("もう", "mou"),
        new Array("もお", "moo"),
//////////////////////////////////////////////////
        new Array("ゃ", "xya"),
        new Array("や", "ya"),
        new Array("やあ", "yaa"),
        new Array("ゅ", "xyu"),
        new Array("ゆ", "yu"),
        new Array("ゆう", "yuu"),
        new Array("ょ", "xyo"),
        new Array("よ", "yo"),
        new Array("よう", "you"),
        new Array("よお", "yoo"),
//////////////////////////////////////////////////
        new Array("ら", "ra"),
        new Array("らあ", "raa"),
        new Array("り", "ri"),
        new Array("りぃ", "ryi"),
        new Array("りぃい", "ryii"),
        new Array("りい", "rii"),
        new Array("りぇ", "rye"),
        new Array("りぇえ", "ryee"),
        new Array("りゃ", "rya"),
        new Array("りゃあ", "ryaa"),
        new Array("りゅ", "ryu"),
        new Array("りゅう", "ryuu"),
        new Array("りょ", "ryo"),
        new Array("りょう", "ryou"),
        new Array("りょお", "ryoo"),
        new Array("る", "ru"),
        new Array("るう", "ruu"),
        new Array("れ", "re"),
        new Array("れえ", "ree"),
        new Array("ろ", "ro"),
        new Array("ろう", "rou"),
        new Array("ろお", "roo"),
        new Array("わ", "wa"),
        new Array("わあ", "waa"),
        new Array("ゐ", "wi"),
        new Array("ゐい", "wii"),
        new Array("ゑ", "we"),
        new Array("ゑえ", "wee"),
        new Array("を", "wo"),
        new Array("をう", "wou"),
        new Array("をお", "woo"),
//////////////////////////////////////////////////
        new Array("ん", "n"),
        new Array("ん", "nn"),
//////////////////////////////////////////////////
        new Array("ゔ", "vu"),
        new Array("ゔぁ", "va"),
        new Array("ゔぁあ", "vaa"),
        new Array("ゔぃ", "vi"),
        new Array("ゔぃい", "vii"),
        new Array("ゔう", "vuu"),
        new Array("ゔぇ", "ve"),
        new Array("ゔぇえ", "vee"),
        new Array("ゔぉ", "vo"),
        new Array("ゔぉう", "vou"),
        new Array("ゔぉお", "voo"),
//////////////////////////////////////////////////
        new Array("ァ", "xa"),
        new Array("ア", "a"),
        new Array("ィ", "xi"),
        new Array("イ", "i"),
        new Array("イィ", "yi"),
        new Array("イイ", "ii"),
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
        new Array("タ", "ta"),
        new Array("ダ", "da"),
        new Array("チ", "chi"),
        new Array("チェ", "che"),
        new Array("チェエ", "chee"),
        new Array("チャ", "cha"),
        new Array("チュ", "chu"),
        new Array("チョ", "cho"),
        new Array("ヂ", "dji"),
        new Array("ヂェ", "dje"),
        new Array("ヂャ", "dja"),
        new Array("ヂャア", "djaa"),
        new Array("ヂュ", "dju"),
        new Array("ヂョ", "djo"),
        new Array("ッ", "xtsu"),
        new Array("ッイィ", "yyi"),
        new Array("ッイェ", "yye"),
        new Array("ッウァ", "wwa"),
        new Array("ッウィ", "wwi"),
        new Array("ッウゥ", "wwu"),
        new Array("ッウェ", "wwe"),
        new Array("ッウォ", "wwo"),
        new Array("ッカ", "kka"),
        new Array("ッガ", "gga"),
        new Array("ッキ", "kki"),
        new Array("ッキィ", "kkyi"),
        new Array("ッキェ", "kkye"),
        new Array("ッキャ", "kkya"),
        new Array("ッキュ", "kkyu"),
        new Array("ッキョ", "kkyo"),
        new Array("ッギ", "ggi"),
        new Array("ッギィ", "ggyi"),
        new Array("ッギェ", "ggye"),
        new Array("ッギャ", "ggya"),
        new Array("ッギュ", "ggyu"),
        new Array("ッギョ", "ggyo"),
        new Array("ック", "kku"),
        new Array("ックァ", "kkwa"),
        new Array("ックィ", "kkwi"),
        new Array("ックゥ", "kkwu"),
        new Array("ックェ", "kkwe"),
        new Array("ックォ", "kkwo"),
        new Array("ッグ", "ggu"),
        new Array("ッグァ", "ggwa"),
        new Array("ッグィ", "ggwi"),
        new Array("ッグゥ", "ggwu"),
        new Array("ッグェ", "ggwe"),
        new Array("ッグォ", "ggwo"),
        new Array("ッケ", "kke"),
        new Array("ッゲ", "gge"),
        new Array("ッコ", "kko"),
        new Array("ッゴ", "ggo"),
        new Array("ッサ", "ssa"),
        new Array("ッザ", "zza"),
        new Array("ッシ", "sshi"),
        new Array("ッシェ", "sshe"),
        new Array("ッシャ", "ssha"),
        new Array("ッシュ", "sshu"),
        new Array("ッショ", "ssho"),
        new Array("ッジ", "jji"),
        new Array("ッジィ", "jjyi"),
        new Array("ッジェ", "jje"),
        new Array("ッジャ", "jja"),
        new Array("ッジュ", "jju"),
        new Array("ッジョ", "jjo"),
        new Array("ッス", "ssu"),
        new Array("ッスぃ", "ssi"),
        new Array("ッスァ", "ssa"),
        new Array("ッスゥ", "ssu"),
        new Array("ッスェ", "sse"),
        new Array("ッスォ", "sso"),
        new Array("ッズ", "zzu"),
        new Array("ッセ", "sse"),
        new Array("ッゼ", "zze"),
        new Array("ッソ", "sso"),
        new Array("ッゾ", "zzo"),
        new Array("ッタ", "tta"),
        new Array("ッダ", "dda"),
        new Array("ッチ", "cchi"),
        new Array("ッチェ", "cche"),
        new Array("ッチェエ", "cchee"),
        new Array("ッチャ", "ccha"),
        new Array("ッチュ", "cchu"),
        new Array("ッチョ", "ccho"),
        new Array("ッヂ", "ddji"),
        new Array("ッヂェ", "ddje"),
        new Array("ッヂャ", "ddja"),
        new Array("ッヂュ", "ddju"),
        new Array("ッヂョ", "ddjo"),
        new Array("ッツ", "ttsu"),
        new Array("ッツァ", "ttsa"),
        new Array("ッツィ", "ttsi"),
        new Array("ッツェ", "ttse"),
        new Array("ッツォ", "ttso"),
        new Array("ッヅ", "ddzu"),
        new Array("ッテ", "tte"),
        new Array("ッティ", "tti"),
        new Array("ッデ", "dde"),
        new Array("ット", "tto"),
        new Array("ットァ", "tta"),
        new Array("ットゥ", "ttu"),
        new Array("ットェ", "tte"),
        new Array("ットォ", "tto"),
        new Array("ッド", "ddo"),
        new Array("ッハ", "hha"),
        new Array("ッバ", "bba"),
        new Array("ッパ", "ppa"),
        new Array("ッヒ", "hhi"),
        new Array("ッヒィ", "hhyi"),
        new Array("ッヒェ", "hhye"),
        new Array("ッヒャ", "hhya"),
        new Array("ッヒュ", "hhyu"),
        new Array("ッヒョ", "hhyo"),
        new Array("ッビ", "bbi"),
        new Array("ッビィ", "bbyi"),
        new Array("ッビェ", "bbye"),
        new Array("ッビャ", "bbya"),
        new Array("ッビュ", "bbyu"),
        new Array("ッビョ", "bbyo"),
        new Array("ッピ", "ppi"),
        new Array("ッピィ", "ppyi"),
        new Array("ッピェ", "ppye"),
        new Array("ッピャ", "ppya"),
        new Array("ッピュ", "ppyu"),
        new Array("ッピョ", "ppyo"),
        new Array("ッフ", "ffu"),
        new Array("ッファ", "ffa"),
        new Array("ッフィ", "ffi"),
        new Array("ッフェ", "ffe"),
        new Array("ッフォ", "ffo"),
        new Array("ッフャ", "ffya"),
        new Array("ッフュ", "ffyu"),
        new Array("ッフョ", "ffyo"),
        new Array("ッブ", "bbu"),
        new Array("ップ", "ppu"),
        new Array("ッヘ", "hhe"),
        new Array("ッベ", "bbe"),
        new Array("ッペ", "ppe"),
        new Array("ッホ", "hho"),
        new Array("ッボ", "bbo"),
        new Array("ッポ", "ppo"),
        new Array("ッヤ", "yya"),
        new Array("ッユ", "yyu"),
        new Array("ッヨ", "yyo"),
        new Array("ッラ", "rra"),
        new Array("ッリ", "rri"),
        new Array("ッリィ", "rryi"),
        new Array("ッリェ", "rrye"),
        new Array("ッリャ", "rrya"),
        new Array("ッリュ", "rryu"),
        new Array("ッリョ", "rryo"),
        new Array("ッル", "rru"),
        new Array("ッレ", "rre"),
        new Array("ッロ", "rro"),
        new Array("ッワ", "wwa"),
        new Array("ッヰ", "wwi"),
        new Array("ッヱ", "wwe"),
        new Array("ッヲ", "wwo"),
        new Array("ッヴ", "vvu"),
        new Array("ッヴァ", "vva"),
        new Array("ッヴィ", "vvi"),
        new Array("ッヴェ", "vve"),
        new Array("ッヴォ", "vvo"),
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
        new Array("ャ", "xya"),
        new Array("ヤ", "ya"),
        new Array("ュ", "xyu"),
        new Array("ユ", "yu"),
        new Array("ョ", "xyo"),
        new Array("ヨ", "yo"),
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
        new Array("ワ", "wa"),
        new Array("ヰ", "wi"),
        new Array("ヱ", "we"),
        new Array("ヲ", "wo"),
        new Array("ン", "n"),
        new Array("ンバ", "mba"),
        new Array("ンビ", "mbi"),
        new Array("ンビィ", "mbyi"),
        new Array("ンビェ", "mbye"),
        new Array("ンビャ", "mbya"),
        new Array("ンビュ", "mbyu"),
        new Array("ンビョ", "mbyo"),
        new Array("ンブ", "mbu"),
        new Array("ンベ", "mbe"),
        new Array("ンボ", "mbo"),
        new Array("ンマ", "mma"),
        new Array("ンミ", "mmi"),
        new Array("ンミィ", "mmyi"),
        new Array("ンミェ", "mmye"),
        new Array("ンミャ", "mmya"),
        new Array("ンミュ", "mmyu"),
        new Array("ンミョ", "mmyo"),
        new Array("ンム", "mmu"),
        new Array("ンメ", "mme"),
        new Array("ンモ", "mmo"),
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
    for (var i = 0; i < romajitable.length; i++) {
        if (romajitable[i][0] in hash)
            hash[romajitable[i][0]].push(romajitable[i][1]);
        else
            hash[romajitable[i][0]] = new Array(romajitable[i][1]);

        if (maxlen < romajitable[i][0].length) {
            maxlen = romajitable[i][0].length;
        }
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