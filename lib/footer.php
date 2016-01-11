
<div class="text-center">
<?php
$url = rawurlencode($_GET['url']);
$title = rawurlencode($_GET['title']);
echo '<div class="share" id="twitter-share"><a href="https://twitter.com/intent/tweet?' . "text={$title}&url=http%3a%2f%2f{$url}&hashtags=JPMCPvP" . '" target="_blank"><img src="lib/shareicon/twitter.png" /></a></div>' . "\n";
echo '<div class="share" id="facebook-share"><a href="https://www.facebook.com/sharer/sharer.php?u=http%3a%2f%2f' . $url . '" target="_blank"><img src="lib/shareicon/facebook.png" /></a></div>' . "\n";
echo '<div class="share" id="google-share"><a href="https://plus.google.com/share?url=prince.webcrow.jp" target="_blank"><img src="lib/shareicon/google.png" /></a></div>' . "\n";
echo '<div class="share" id="hatena-share"><a href="http://b.hatena.ne.jp/entry/' . $_GET['url'] . '" target="_blank"><img src="lib/shareicon/hatena.png" /></a></div>' . "\n";
?>
</div>
<div class="text-center copyright">
	(c)2015 prince<br>
	Minecraft copyrights of <a href="https://mojang.com" target="_blank">Mojang AB</a>. and this site is not affiliated with <a href="https://mojang.com" target="_blank">Mojang AB</a>.<br>
	Japan Minecraft PvP copyrights of <a href="https://minecraft.jp" target="_blank">Japan Minecraft Network</a>. and this site is not affiliated with <a href="https://minecraft.jp" target="_blank">Japan Minecraft Network</a>.
</div>
