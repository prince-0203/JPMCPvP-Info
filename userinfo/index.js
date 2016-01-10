/*jshint browser: true, jquery: true*/

function openWindow(href, width, height) {
    window.open(href, '', 'width=' + width + ', height=' + height + ', menubar=no, toolbar=no, location=yes, status=no, resizable=yes, scrollbars=yes');
}
function dateToJapanese(date) {
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 '　+ date.getHours() + '時' + date.getMinutes() + '分' + date.getSeconds() + '秒';
}

$(function () {
    'use strict';
    
    load_header_footer('#contents, #usersearch');
    
    $('script[type="text/x-jsrender"][src]').each(function(i, value) {
        $.ajax({
            url: $(value).attr('src'),
            async: false
        })
            .done(function(data) {
                $(value).text(data);
            });
    });
    
    function playerSearch(id) {
        
        loginOAuth.getData('/players/' + id, {fields: 'kills,matches,objective,ctw,teampvp,total'}, function(data) {
            if(data) {
                data.locationHref = location.href;
                data.last_login = dateToJapanese(new Date(data.last_login));
                data.last_logout = dateToJapanese(new Date(data.last_logout));
                //data.recentstats = RecentStats.execute(data);
                console.log(RecentStats.execute(data));

                $.each(data.matches, function() {
                    this.finished = dateToJapanese(new Date(this.finished));
                    this.started = dateToJapanese(new Date(this.started));
                    this.deathall = this.death_count + this.envdeath_count;
                    // 試合のK/Dレートを計算
                    if(this.death_count === 0) {
                        this.kd_ratio = 1;
                    } else {
                        this.kd_ratio = Math.round((this.kill_count / this.deathall) * 1000) / 1000;
                    }
                });

                data.teampvp.deathall = data.teampvp.death_count + data.teampvp.envdeath_count;

                $.each(data.kills, function() {
                    this.time = dateToJapanese(new Date(this.time));
                });

                $.each(data.deaths, function() {
                    this.time = dateToJapanese(new Date(this.time));
                });
                
                $('#result').html($('#resultTmpl').render(data));
                
                $('.makeCounterColumn').off('click.e', '.makeCounter');
                $('.makeCounterColumn').on('click.e', '.makeCounter', function() {
                    var m1 = $('#makeCounterModal');
                    var idData = {
                        id: data.uuid,
                        path: $(this).data('path')
                    };
                    m1.html($('#makeCounterModalTmpl').render(idData));
                    $('#makeCounterModalNext').off();
                    $('#makeCounterModalNext').on('click.e', function() {
                        var m2 = $('#counterModal');
                        var params =
                            '?id=' + $('#minecraftID', m1).val() +
                            '&datatype=' + $('#path', m1).val() +
                            '&backcolor=' + $('#backColor', m1).val().slice(1) +
                            '&strcolor=' + $('#strColor', m1).val().slice(1) +
                            '&font=' + $('#font', m1).val() +
                            '&fontsize=' + $('#fontSize', m1).val();
                        if(!$('#marginauto', m1).prop('checked')){
                            params += '&margin=' + $('#margin', m1).val();
                        }
                        var counterData = {
                            params: params,
                            html: '<a href="http://prince.webcrow.jp/JPMCPvP-Info/"><img src="http://prince.webcrow.jp/JPMCPvP-Info/nyancounter.php' + params + '" alt="JPMCPvP Nyan Counter" title="JPMCPvP Nyan Counter" /></a>',
                            bbcode: '[url=http://prince.webcrow.jp/JPMCPvP-Info/][img]http://prince.webcrow.jp/JPMCPvP-Info/nyancounter.php' + params + '[/img][/url]'
                        };
                        m2.html($('#counterModalTmpl').render(counterData));
                        //inputの全選択ボタン
                        $('.selectAll').off();
                        $('.selectAll').click(function() {
                            $(this)
                                .parent()
                                .prev()
                                .select();
                        });
                        
                        m1.modal('hide');
                        m2.modal();
                    });
                    
                    //カラーピッカーを設定
                    $('.colorPick').each(function() {
                        $(this).ColorPickerSliders({
                            swatches: ['white', 'red', 'green', 'blue', 'black'],
                            hsvpanel: true,
                            order: {
                                rgb: 1
                            }
                        });
                    });
                    //スライダーを設定
                    $('.slider').slider();
                    $('#marginauto').click(function() {
                        if($(this).prop('checked')) {
                            $("#margin").slider("disable");
                        } else {
                            $("#margin").slider("enable");
                        }
                    });
                    
                    m1.modal();
                });
                
                $(window).resize();
            } else {
                $('header')
                    .after('<section class="container" style="display: none"><div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>指定されたユーザーの情報を取得できませんでした。<a href="about/#faq class="alert-link">よくある質問</a>をご覧ください。</div></section>')
                    .next()
                    .show(500)
                    .find('button.close')
                    .one('click', function() {
                        $(this)
                            .closest('section')
                            .hide(500);
                    });
            }
        });
    }

    //フォームを送信しない
    $('#searchForm').submit(function() {
        history.replaceState('', '', 'userinfo/?id=' + $('#MinecraftID').val());
        playerSearch($('#MinecraftID').val());
        return false;
    });
        
    var urlParam = getUrlParam();
    
    if(typeof(urlParam.id) !== 'undefined') {
        $('#MinecraftID').val(urlParam.id);
        playerSearch(urlParam.id);
    }
});