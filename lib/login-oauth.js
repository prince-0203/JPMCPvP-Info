/*jshint browser: true, jquery: true*/

//
// JPMCPvP Login OAuth Library for Javascript(jQuery)
//  Author: prince-0203<https://github.com/prince-0203>
//
// JPMCPvPの新APIをJavascriptで簡単に扱うためのライブラリです。
// はじめは公開できるようなライブラリにする予定だったのですが、
// 結局サイトに依存するコードをところどころ書いてしまったので配布する予定はないです。
//

// **重要** 内部でsetIntervalを使用している関係で、checkLoginComplete(), getCode(), getAccessToken()のコールバック関数の中ではthisが使えない。

var loginOAuth = {
    clientId: 'CLIENT_ID',
    redirectUri: 'http://prince.webcrow.jp/JPMCPvP-Info/login-callback.txt',

    loginTimer: null,

    //
    // 現在Access Tokenが有効か調べ、有効であればAccess Tokenを返す
    //
    isLoggingIn: (Cookies.get('accesstoken') ? Cookies.get('accesstoken') : null),

    //
    // 指定したウィンドウの読み込みが完了しているか調べる
    //
    isLoaded: function(win) {
        try {
            return ('about:blank' !== win.location.href) && (null !== win.document.body.innerHTML);
        } catch (err) {
            return false;
        }
    },

    //
    // ログインが完了したか0.5秒おきに確認し、完了していたらcallbackを呼ぶ
    //
    checkLoginComplete: function(loginWindow, callback) {
        if (!loginOAuth.isLoaded(loginWindow)) {
            loginOAuth.loginTimer = setTimeout(function() {
                loginOAuth.checkLoginComplete(loginWindow, callback);
            }, 500);
            return;
        } else {
            callback();
        }
    },

    //
    // Login URLを取得する
    //
    getLoginUrl: function() {
        return 'https://minecraft.jp/oauth/authorize?response_type=code&client_id=' + loginOAuth.clientId + '&redirect_uri=' + encodeURI(loginOAuth.redirectUri) + '&scope=openid%20profile';
    },

    //
    // Codeを取得する
    //
    getCode: function(callback) {
        var loginWindow = window.open(loginOAuth.getLoginUrl(), '', 'width=640,height=500,resizable=yes,scrollbars=yes');
        if(loginWindow === null) {
            callback(null);
        }

        loginOAuth.checkLoginComplete(loginWindow, function() {
            var match = loginWindow.location.href.match(/[?&]code=([^&]*)/i);
            loginWindow.close();
            if (match && match[1]) {
                callback(match[1]);
            } else {
                callback(null);
            }
        });

        return;
    },

    //
    // Access Tokenを取得する
    //
    getAccessTokenData: function(code, callback) {
        $.ajax({
            url: 'https://minecraft.jp/oauth/token',
            type: 'POST',
            data: {
                client_id: loginOAuth.clientId,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: loginOAuth.redirectUri
            },
            dataType: 'JSON'
        })
            .done(function(data) {
                callback(data);
            })
            .fail(function() {
                callback(null);
            });

        return;
    },

    //
    // クッキーからAccess Tokenを削除し、loginOAuth.isLoggingInをnullにする
    //
    logout: function() {
        loginOAuth.isLoggingIn = null;
        Cookies.remove('accesstoken', {
            domain: 'prince.webcrow.jp',
            path: '/JPMCPvP-Info/'
        });
        return;
    },

    //
    // 一発でどんな状況下でもAccess Tokenを取得できるようにするための関数
    //
    getAccessToken: function(callback) {
        if(Cookies.get('accesstoken')) {
            //
            // 有効なAccess Tokenがクッキーに存在した
            //
            callback(Cookies.get('accesstoken'));
        } else {
            //
            // Access Tokenがクッキーに存在しなかった
            //
            loginOAuth.getCode(function(code) {
                if(code) {
                    //
                    // Codeの取得に成功した
                    //
                    loginOAuth.getAccessTokenData(code, function(accessTokenData) {
                        if(accessTokenData) {
                            //
                            // Access Tokenの取得に成功した
                            //
                            loginOAuth.isLoggingIn = accessTokenData.access_token;
                            Cookies.set('accesstoken', accessTokenData.access_token, {
                                expires: new Date().getTime() + accessTokenData.expires_in * 1000,
                                domain: 'prince.webcrow.jp',
                                path: '/JPMCPvP-Info/'
                            });
                            callback(accessTokenData.access_token);
                        } else {
                            //
                            // Access Tokenの取得に失敗した
                            //
                            callback(null);
                        }
                    });
                } else {
                    //
                    // Codeの取得に失敗した
                    //
                    callback(null);
                }
            });

        }

        return;
    },

    //
    // APIからデータを取得する
    //  String requestUri: リクエストのURI, "/players/monocrafty" 等
    //  Object data: パラメータ, JavascriptのObjectを指定すること 省略不可なので何もない場合は{}を指定すること
    // ログインしていた場合はAccess Tokenを、していなかった場合はClient IDを使用する
    //
    getData: function(requestUri, data, callback) {
        if(loginOAuth.isLoggingIn) {
            data.access_token = loginOAuth.isLoggingIn;
        } else {
            data.client_id = loginOAuth.clientId;
        }
        $.ajax({
            url: 'https://pvp-api.minecraft.jp/v1' + requestUri,
            type: 'GET',
            data: data,
            dataType: 'JSON'
        })
            .done(function(data) {
                callback(data);
            })
            .fail(function() {
                callback(null);
            });
    }
};
