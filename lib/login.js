/*jshint browser: true, jquery: true*/

var configureLogin = function() {
    var getUserInfo = function(callback) {
        loginOAuth.getData('/players/me', {fields: 'total'}, function(data) {
            if(data) {
                callback(data);
            } else {
                callback(null);
            }
        });
    };


    if(loginOAuth.isLoggingIn) {
        loginOAuth.getAccessToken(function() {
            getUserInfo(function(data) {
                if(data) {
                    // jQueryにouterHTMLが存在しない…
                    document.getElementById('login').outerHTML = '<li class="active"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img src="https://avatar.minecraft.jp/' + data.name + '/minecraft/t.png"> ' + data.name + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><a target="_blank" href="' + data.permalink_url + '"><i class="glyphicon glyphicon-new-window"></i> プロフィール</a></li><li><a href="http://prince.webcrow.jp/JPMCPvP-Info/userinfo/?id=' + data.name + '">User Info</a></li><li role="separator" class="divider"></li><li id="logout"><a href="#"><i class="glyphicon glyphicon-log-out"></i> ログアウト</a></li></ul></li>';
                    $('#logout').click(function() {
                        loginOAuth.logout();
                        location.reload();
                    });
                } else {
                    $('header')
                        .after('<section class="container" style="display: none"><div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>ログインに失敗しました。<a href="about/#faq class="alert-link">よくある質問</a>をご覧ください。</div></section>')
                        .next()
                        .show(500)
                        .find('button.close')
                        .one('click', function() {
                            $(this)
                                .closest('section')
                                .hide(500);
                        });
                    loginOAuth.logout();
                }
            });
        });
    } else {
        $('#login > a').click(function() {
            loginButton = $('#login');
            loginButton
                .html('<a style="cursor: pointer"><i class="glyphicon glyphicon-log-in"></i> ログイン処理中…</a>')
                .prop('disabled', true)
                .children('a')
                .css('cursor', 'default')
                .on('click.login', function(e) {
                    e.preventDefault();
                });

            loginOAuth.getAccessToken(function(data) {
                if(data) {
                    var accessToken = data;
                    console.log('ログインに成功しました。\nAccess Token: ' + accessToken);
                    $(loginButton).html('<a><i class="glyphicon glyphicon-log-in"></i> ユーザーデータを取得中…</a>');
                    getUserInfo(function(data) {
                        if(data) {
                            $('header')
                                .after('<section class="container" style="display: none"><div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 'ログインに成功しました。こんにちは、' + data.name + 'さん！' + '</div></section>')
                                .next()
                                .show(500)
                                .find('button.close')
                                .one('click', function() {
                                    $(this)
                                        .closest('section')
                                        .hide(500);
                                });
                            document.getElementById('login').outerHTML = '<li class="active"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img src="https://avatar.minecraft.jp/' + data.name + '/minecraft/t.png"> ' + data.name + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><a target="_blank" href="' + data.permalink_url + '"><i class="glyphicon glyphicon-new-window"></i> プロフィール</a></li><li><a href="http://prince.webcrow.jp/JPMCPvP-Info/userinfo/?id=' + data.name + '">User Info</a></li><li role="separator" class="divider"></li><li id="logout"><a href="#"><i class="glyphicon glyphicon-log-out"></i> ログアウト</a></li></ul></li>';
                            $('#logout').click(function() {
                                loginOAuth.logout();
                                location.reload();
                            });
                        } else {
                            $('header')
                                .after('<section class="container" style="display: none"><div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>ユーザーデータの取得に失敗しました。<a href="about/#faq class="alert-link">よくある質問</a>をご覧ください。</div></section>')
                                .next()
                                .show(500)
                                .find('button.close')
                                .one('click', function() {
                                    $(this)
                                        .closest('section')
                                        .hide(500);
                                });
                            loginOAuth.logout();
                            loginButton
                                .html('<a style="cursor: pointer"><i class="glyphicon glyphicon-log-in"></i> ログイン</a>')
                                .prop('disabled', false)
                                .children('a')
                                .off('.login');
                        }
                    });
                } else {
                    $('header')
                        .after('<section class="container" style="display: none"><div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>ログインに失敗しました。<a href="about/#faq class="alert-link">よくある質問</a>をご覧ください。</div></section>')
                        .next()
                        .show(500)
                        .find('button.close')
                        .one('click', function() {
                            $(this)
                                .closest('section')
                                .hide(500);
                        });
                    loginOAuth.logout();
                    loginButton
                        .html('<a style="cursor: pointer"><i class="glyphicon glyphicon-log-in"></i> ログイン</a>')
                        .prop('disabled', false)
                        .children('a')
                        .off('.login');
                }
            });
        });

    }
};