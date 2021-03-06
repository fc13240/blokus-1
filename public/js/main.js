$(function(){

    const socket = io();

    let roomNum;

    //自分で部屋番号をcookieから読み取りたいが、取得できないので、サーバー側にGETを送ってそれを教えてもらう。
    $.ajax({
        type : "GET",
        url : "/cookie",
        dataType : "text",
        async : false,
        success : (res)=>{
            console.log(`getting roomNum successfully. r=${res}`);
            roomNum = Number.parseInt(res);
        }
    });

    socket.emit("whereroom", roomNum);

    console.log(document.cookie);
    console.log("hello " + roomNum);
    const ctx = $("#cnvs")[0].getContext("2d");
    function init_user(){
        let user_base = {
            mouse : new Point(0, 0),
            clicked : false,
            wheel : 0,
            mousedown : false, //これらはイベントであり状態ではない
            mouseup : false,
            keycodes : []
        }
        return user_base;
    }
    let user = init_user();
    let mouse = new Point(0, 0);

    let game = new Game(9, 4);
    game.start();

    let my_color = Color.BLUE;
    const gamecanvas = new GameCanvas(game, ctx, new Point(0, 0), 1200, 1000, my_color);

    $("#cnvs").mousemove((e)=>{

        user.mouse = new Point(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
    });

    $("#cnvs").click(e=>{
        user.clicked = true;

    });

    $("#debugbox").append("<h2 id='drag'>a</h2>");
    $("#cnvs").mousedown((e)=>{
        e.preventDefault();
        user.mousedown = true;
    });

    $("#cnvs").hover(e=>{;}, e=>{
        user.mouseup = true;
    });

    $("#cnvs").mouseup((e)=>{
        user.mouseup = true;
    });

    $("#cnvs").mousewheel((eo, delta, deltaX, deltaY)=>{
        // eo.preventDefault();
        user.wheel = delta;
        // console.log(delta, deltaX, deltaY);
        return false;
    });
    function render(){
        gamecanvas.update(user);
        gamecanvas.draw();
        // user = init_user();
        user.clicked = false;
        user.wheel = 0;
        user.mousedown = false;
        user.mouseup = false;
    }

    setInterval(render, 100);
});
