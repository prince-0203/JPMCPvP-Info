/*--------------------------------------------------------------------------*
 *  
 *  footerFixed.js
 *  
 *  MIT-style license. 
 *  
 *  2007 Kazuma Nishihata [to-R]
 *  http://blog.webcreativepark.net
 *  
 *--------------------------------------------------------------------------*/

new function(){

    //メイン
    function footerFixed(){
        //フッターのtopからの位置
        document.getElementsByTagName('footer')[0].style.top = "0px";
        var ft = document.getElementsByTagName('footer')[0].offsetTop;
        //フッターの高さ
        var fh = document.getElementsByTagName('footer')[0].offsetHeight;
        //ウィンドウの高さ
        if (window.innerHeight){
            var wh = window.innerHeight;
        }else if(document.documentElement && document.documentElement.clientHeight !== 0){
            var wh = document.documentElement.clientHeight;
        }
        if(ft+fh<wh){
            document.getElementsByTagName('footer')[0].style.position = "relative";
            document.getElementsByTagName('footer')[0].style.top = (wh-fh-ft-1)+"px";
        }
    }

    //文字サイズ
    function checkFontSize(func){

        //判定要素の追加	
        var e = document.createElement("div");
        var s = document.createTextNode("S");
        e.appendChild(s);
        e.style.visibility="hidden";
        e.style.position="absolute";
        e.style.top="0";
        document.body.appendChild(e);
        var defHeight = e.offsetHeight;

        //判定関数
        function checkBoxSize(){
            if(defHeight != e.offsetHeight){
                func();
                defHeight= e.offsetHeight;
            }
        }
        setInterval(checkBoxSize,1000);
    }

    //イベントリスナー
    function addEvent(elm,listener,fn){
        try{
            elm.addEventListener(listener,fn,false);
        }catch(e){
            elm.attachEvent("on"+listener,fn);
        }
    }

    addEvent(window,"load",footerFixed);
    addEvent(window,"load",function(){
        checkFontSize(footerFixed);
    });
    addEvent(window,"resize",footerFixed);

};