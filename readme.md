JPMCPvP Info - http://prince.webcrow.jp/JPMCPvP-Info/
===
# 概要
Japan Minecraft PvP(JPMCPvP)の情報を提供する、 prince_0203が運営している非公式サイトです。
"Bootstrap"の日本語表示を改善した"Honoka"のForkテーマ"Umi"を使用しています。
もともとソースコード公開の予定はなかったのでコメントも少ないですしコードも汚いです。また一部のファイルは非公開にしています。
IssueとかPull Requestとか送る人がいるのかわかりませんが大歓迎です。要望やソースコードに関する質問もIssueで構いません。できれば日本語で。

# ライセンス


# ファイル構成
/
┣ about - Aboutページです。
┣ index - index.htmlのjs・cssが入っています。
┣ lib - Javascript・CSSライブラリが入っています。
┃┣ colorpicker - "Bootstrap Color Picker Slider"が入ってます。
┃┣ shareicon - フッターのSNSアイコンが入ってます。
┃┣ slider - bootstrap-sliderが入ってます。
┃┣ umi - "Bootstrap"の日本語表示を改善した"Honoka"のForkテーマ"Umi"が入ってます。
┃┣ common.css - 共有CSSです。
┃┣ footer.php - フッターです。各ページからJavascriptで読み込んでいます。
┃┣ jquery-2.1.4.min.js - jQueryです。
┃┣ js.cookie-2.0.4.js - js-cookieです。ログイン時のアクセストークンの保存にCookieを使用しています。
┃┣ jsrender.min.js - JsRenderです。
┃┣ loadheader.js - ヘッダー・フッターを読み込むJavascriptです。
┃┣ login.js - ログイン部分のUI管理に使ってます。
┃┣ login-oauth.js - Login with minecraft.jp用のライブラリ。minecraftjp-php-sdkのJavascript移植…にしたかったのですが、微妙に失敗。
┃┣ logo.png - ロゴにする予定。どうしてもヘッダーにうまく入らない。
┃┣ logo-white.png - 同上。
┃┗ urlparam.js - URLパラメータ解析用のライブラリ。
┣ nyancounter - Nyancounterの説明ページです。
┣ phpdata - PHPで使用するデータを入れています。実際のサイトではアクセス制限をかけているので見れません。
┃┗ font - Nyan Counterで使用するフォントが入ってます。
┣ phplib - PHPで使用するライブラリを入れています。実際のサイトではアクセス制限をかけているので見れません。
┃┗ recentstats.php - 7sr_氏が制作したRecentStatsを一部改造したものです。Nyan Counterで使用しています。
┣ servers - サーバーリストが見られるページです。
┣ userinfo - ユーザーの情報を見たりNyan Counterを作成できるページです。
┣ diamond.png - index.htmlのアレです。
┣ favicon.png - ファビコンです。
┣ index.html - トップページです。
┣ login-callback.txt - Login with minecraft.jpのコールバックに使ってます。
┗ nyancounter.php - 当サイトの目玉機能、Nyan Counterです。