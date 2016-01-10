JPMCPvP Info
# 概要
Japan Minecraft PvP(JPMCPvP)の情報を提供する、 prince_0203が運営している非公式サイトです。
"Bootstrap"の日本語表示を改善した"Honoka"のForkテーマ"Umi"を使用しています。
もともとソースコード公開の予定はなかったのでコメントも少ないですしコードも汚いです。また一部のファイルは非公開にしています。
IssueとかPull Requestとか送る人がいるのかわかりませんが大歓迎です。要望やソースコードに関する質問もIssueで構いません。できれば日本語で。

# ライセンス
特に明示しません。**これは、権利を放棄したということでも、自由に使用できるようにしたという意味ではありません。**
利用者は自由にソースコードを閲覧でき、ソースコードをForkすることも可能です。

>### No License
>あなた(作者)がすべての権利を保持し、配布・複製・派生物(改造)を許可しません。サービスの受諾条件を必要とするサイトにソースコードを公開することによって、いくつかの権利を付与することができます。
>たとへば、GitHubで公開することによって、ほかの人はあなたのソースコードを表示し、フォークできる権利を与へたことになります。
>*(訳注: 要するに、GitHubでライセンスを明示しないソースコードは自動的にこの状態に置かれるといふことです。この状態では作者が著作権を持ち、利用者にライセンス(許諾)は与へられてゐません。ただし、[GitHubのサービス利用規約](https://help.github.com/>articles/github-terms-of-service)により、ソースコードの閲覧とリポジトリのフォークは保証されてゐます。それ以外の利用は原作者が権利を持つ通常の著作物として取り扱ふ必要があります)*
>| [No License](http://choosealicense.com/no-license/) | |
>|---|----|
>| 必須事項 | ライセンスと著作権の表示 |
>| 許可されること | 個人利用、商用利用 |
>| 禁止事項 | 修正(改造)、配布、別のライセンスを課すこと |
>
>&mdash;http://qiita.com/tadsan/items/99d816e78ca429093b75#3-6

# 管理方法(備忘録)
- 小規模な変更(リンク切れ・Typoの修正等)はmasterへ直接コミット
- それ以外はブランチを作成してコミットする

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