var load_header_footer = function(selector) {
        // ヘッダーをロード
        $('header').load('lib/header.html', null, function() {
            $(selector, this)
                .addClass('active')
                .children('a')
                .css('cursor', 'default')
                .click(function(e) {
                    e.preventDefault();
                });
            $('[data-toggle="tooltip"]', this).tooltip();
            $('li.disabled', this)
                .children('a')
                .click(function(e) {
                    e.preventDefault();
                });

            configureLogin();
        });

        // フッターをロード
        $('footer').load('lib/footer.php?url=' + encodeURIComponent(location.host + location.pathname) + '&title=' + encodeURIComponent(document.title));
};
