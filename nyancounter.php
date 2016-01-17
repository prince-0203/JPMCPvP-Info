<?php

/***************

オプション一覧

id: MinecraftID
backcolor: 背景RGB(0x0A0A0A等 0を外してはいけない 省略した場合0x000000)
strcolor: 文字RGB(同上 省略した場合0xFFFFFF)
font: フォント 以下の数字で指定する(省略した場合0)
    0: 美咲ゴシック(misaki_gothic.ttf)
    1: IPA ゴシック(ipag.ttf)
    2: IPA Pゴシック(ipagp.ttf)
    3: IPA 明朝(ipam.ttf)
    4: IPA P明朝(ipamp.ttf)
    5: 07 ラノベPOP(LightNovelPOP.ttf)
fontsize: フォントサイズ 負荷の関係で100以下(省略した場合20)
margin: 余白 負荷の関係で20以下(省略した場合fontsize/10)
datatype: 取得するデータ 以下のような形式で指定する(省略した場合以下の通り)
    player->Player->total->nyan_accumulated

***************/

//ヘッダー指定
header('Content-Type: image/png');
header('Cache-Control: max-age=300');

// エラー出力しない
ini_set('display_errors', 0);
ini_set("display_startup_errors", 0);

// ログ出力
if($_SERVER['SERVER_NAME'] !== 'localhost'){
    include './phplib/log.php';
}

require_once './phplib/recentstats.php';

date_default_timezone_set('Asia/Tokyo');

//16進数のRGB値を連想配列に変換する関数
function RGB16to10 ($RGB16) {

    //「******」という形になっているはずなので、2つずつ「**」に区切る
    //そしてhexdec関数で変換して配列に格納する
    $RGB10['red'] = hexdec(substr($RGB16, 0, 2));
    $RGB10['green'] = hexdec(substr($RGB16, 2, 2));
    $RGB10['blue'] = hexdec(substr($RGB16, 4, 2));
    
    return $RGB10;
}

//テキストを画像にして返す関数
function textToImg($text, $backRGB, $strRGB, $fontPath, $fontSize, $margin) {
    // 大きさを測定
    $result = imageTTFBBox($fontSize, 0, $fontPath, $text);
    
    // 幅と高さを取得
    $width = abs($result[4]) + abs($result[6]) + $margin * 2;
    $height = abs($result[1]) + abs($result[7]) + $margin * 2;
    
    // イメージリソースを生成
    $img = imageCreateTrueColor($width, $height);
    
    // 色を生成
    $backColor = imageColorAllocate($img, $backRGB['red'], $backRGB['green'], $backRGB['blue']);
    $strColor = imageColorAllocate($img, $strRGB['red'], $strRGB['green'], $strRGB['blue']);
    
    // 背景を塗りつぶす
    imageFilledRectangle($img, 0, 0, $width, $height, $backColor);
    
    // 文字を描く
    imageTTFText($img, $fontSize, 0, $margin + abs($result[0]), $margin + abs($result[7]), $strColor, $fontPath, $text);
    
    return $img;
}

//fontは有効な数字か
if(isset($_GET['font']) && is_numeric($_GET['font'])) {
    switch($_GET['font']) {
        case 0:
            $fontPath = 'phpdata/font/misaki_gothic.ttf';
            break;
        case 1:
            $fontPath = 'phpdata/font/ipag.ttf';
            break;
        case 2:
            $fontPath = 'phpdata/font/ipagp.ttf';
            break;
        case 3:
            $fontPath = 'phpdata/font/ipam.ttf';
            break;
        case 4:
            $fontPath = 'phpdata/font/ipamp.ttf';
            break;
        case 5:
            $fontPath = 'phpdata/font/LightNovelPOP.ttf';
            break;
        default:
            $fontPath = 'phpdata/font/misaki_gothic.ttf';
            break;
    }
} else {
    $fontPath = 'phpdata/font/misaki_gothic.ttf';
}

//fontsizeは100以下の数字か
if(isset($_GET['fontsize']) && is_numeric($_GET['fontsize']) && $_GET['fontsize'] >= 1 && $_GET['fontsize'] <= 100) {
    $fontSize = $_GET['fontsize'];
} else {
    $fontSize = 20;
}

//marginは20以下の数字か
if(isset($_GET['margin']) && is_numeric($_GET['margin']) && $_GET['margin'] >= 0 && $_GET['margin'] <= 20) {
    $margin = $_GET['margin'];
} else {
    $margin = $fontSize / 10;
}

//文字色は有効か
if(isset($_GET['strcolor'])) {
    $strColor = RGB16to10($_GET['strcolor']);
} else {
    $strColor['red'] = 0xFF;
    $strColor['green'] = 0xFF;
    $strColor['blue'] = 0xFF;
}

//背景色は有効か
if(isset($_GET['backcolor'])) {
    $backColor = RGB16to10($_GET['backcolor']);
} else {
    $backColor['red'] = 0;
    $backColor['green'] = 0;
    $backColor['blue'] = 0;
}

//DataTypeは有効か
if (isset($_GET['datatype']) && preg_match('/^[A-Za-z0-9_>[\]-]+$/', $_GET['datatype'])) {
    $dataType = $_GET['datatype'];
} else {
    $dataType = 'player->Player->total->nyan_accumulated';
}

//データ取得
$cp = curl_init();
curl_setopt($cp, CURLOPT_RETURNTRANSFER, true);
curl_setopt($cp, CURLOPT_FAILONERROR, true);
curl_setopt($cp, CURLOPT_URL, 'http://api.minecraft.jp/pvp/' . $_GET['id'] . '.json');
curl_setopt($cp, CURLOPT_TIMEOUT, 5);
$JSONData = curl_exec($cp);
if($JSONData === FALSE) {
    http_response_code(500);
    header('X-Debug-cURL-Error: ' . curl_error($cp));
    curl_close($cp);
    readfile('phpdata/font/error.png');
    exit;
}
curl_close($cp);

//解析・出力
$obj = json_decode($JSONData, TRUE);
if(isset($obj['player']['Player']['last_login'])) {
    $obj['player']['Player']['last_login']['ja'] = date('Y年m月d日 H時i分s秒', $obj['player']['Player']['last_login']['sec']);
    $obj['player']['Player']['last_logout']['ja'] = date('Y年m月d日 H時i分s秒', $obj['player']['Player']['last_logout']['sec']);

    $obj['player']['Player']['recentstats'] = RecentStatsCommand::execute($obj['player']['Player']);

    $dataTypeArray = explode('->', $dataType);
    foreach ($dataTypeArray as $value) {
        if(isset($obj[$value])) {
            $obj = $obj[$value];
        } else {
            $obj = NULL;
            break;
        }
    }

    if($obj === NULL) {
        http_response_code(400);
        header('X-Debug-Error: Requested data was not found.');
        readfile('phpdata/font/error.png');
    } else {
        if(is_float($obj)) {
            $obj = round($obj, 2);
        }
        $img = textToImg($obj, $backColor, $strColor, $fontPath, $fontSize, $margin);
        imagePng($img);
        imageDestroy($img);
    }
} else {
    http_response_code(500);
    header('X-Debug-Error: Recieved data was invalid.');
    readfile('phpdata/font/error.png');
}
