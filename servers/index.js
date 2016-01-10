/*jshint browser: true, jquery: true*/

$(function () {
    'use strict';

    load_header_footer('#contents, #servers');

    loginOAuth.getData('/servers/online', {}, function(data) {
        if(data) {
            $('#online-player').text(data.count + '人のプレイヤーがオンラインです。');
        } else {
            $('#online-player').html('オンライン人数を取得できませんでした。<a href="about/#faq>よくある質問</a>をご覧ください。');
        }
    });
    
    //Mojangサーバーのステータスを取得
    var table = $('#mojangServerStatusTable');
    $.getJSON('//status.mojang.com/check')
        .done(function(data) {
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]){
                    switch(data[i][key]) {
                        case 'green':
                            table.append('<tr class="success"><th><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>' + key + '</th><td>正常</td></tr>');
                            break;
                        case 'yellow':
                            table.append('<tr class="warning"><th><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' + key + '</th><td>一応稼働中</td></tr>');
                            break;
                        case 'red':
                            table.append('<tr class="danger"><th><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' + key + '</th><td>ダウン中</td></tr>');
                            break;
                        default:
                            table.append('<tr class="warning"><th><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>' + key + '</th><td>不明</td></tr>');
                            break;
                    }
                }
            }
        })
        .fail(function() {
            table.appendTo('<tr>データを取得できませんでした。<a href="about/#faq>よくある質問</a>をご覧ください。</tr>');
        });
    
    //JPMCPvPのサーバー一覧を取得
    loginOAuth.getData('/servers', {}, function(data) {
        if(data) {
            data.sort(function(val1, val2) {
                if(typeof(val1.order) === 'undefined') {
                    return 1;
                }
                if(typeof(val2.order) === 'undefined') {
                    return -1;
                }
                if(val1.order > val2.order) {
                    return 1;
                } else {
                    return -1;
                }
            });
            $.each(data, function(i) {
                var serverListPanel = '<div class="col-sm-6"><div class="panel panel-default"><div class="panel-heading">' +
                    '<div class="panel-title">' + this.name + '</div></div><table class="table table-bordered table-striped table-responsive"><tbody>';
                
                if(this.current_map !== '') {
                    serverListPanel += '<tr><th>Current Map</th><td>' + this.current_map + '</td></tr>';
                }
                if(this.next_map !== '') {
                    serverListPanel += '<tr><th>Next Map</th><td>' + this.next_map + '</td></tr>';
                }
                serverListPanel += '<tr><th>Player Count</th><td>' + this.player_count + '/' + this.max + '</td></tr>' +
                                '</tbody></table>' +
				                '<div class="panel-body"><button class="btn btn-info btn-block moreInfo" data-server-id="' + i + '" disabled="disabled">詳細</button></div></div></div>';
                $('#serverList').append(serverListPanel);
            });
        } else {
            $('#serverList').append('<div class="panel panel-warning"><div class="panel-body">サーバー一覧の取得に失敗しました。</div></div>');
        }
    });
    
    //詳細ボタンクリック
    
});