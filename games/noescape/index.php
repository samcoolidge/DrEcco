<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
    <base href="../../">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <script src="js/gameSettings.js"></script>
    <link rel="stylesheet" type="text/css" href="css/facebox.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('a[rel*=facebox]').facebox()
        })
    </script>
</head>
<body>
    <div id="popup" style="display:none;opacity:0;width:100%;height:100%;position:fixed">
        <div id="exiter" style="background-color:black;opacity:0.7;width:100%;height:100%;position:fixed;z-index:-1"></div>
        <div class="well" style="margin:0 auto;width:350px;z-index:2;position:relative;top:50%;">
            <form style="display:inline" action="dbman/saveScore.php" method="get">
                Username:
                <input id="playername" type="text" name="playername" value="player1" style="height:25px;">
                <input id="gamename" type="text" name="gamename" value="noescape" style="display:none">
                <input id="formscore" type="number" name="score" value="0" style="display:none">
                <div id="submitscore" class="btn-sm btn-primary" onlick='alert("test");' style="display:inline;cursor:pointer">submit</div>
            </form>
        </div>

        </div>
<div class="container">

    <?php include "../../header.php"; ?>
    <nav>
        <ul>
        <li><a href="../../">Home</a></li>
        </ul>
        <?php include $base."leftMenuGame.php"; ?>

    </nav>
    <article>
        <h1 id="gameName">No Escape</h1>
        <h5 id="groupName" style="text-indent: 20px;">Team ~/</h5>
        <h3>Description</h3>
        <div id="gameDesc" class="container-fluid well">
            <p>
            <strong>Controls:</strong> use WASD or Arrow Keys to move<br><br>
            <strong>Goal:</strong> escape the maze with the <i>lowest</i> score. You are the red dot. Walls are black.<br><br>
            <strong>Tip:</strong> You can phase through walls. But every time you do, the weight of each step increases by 0.25.<br><br>
            <strong>Tip:</strong> Don't forget to save one phase for the end. Because this maze truly has no escape!
            </p>
        </div>

        <h3>Leaderboard</h3>
        <div id="scoreArea", class="jumbotron">
            <?php
            include $base."getScore.php";
            /*
            * arg1: gameName, should be the same as the dir name
            * arg2: if your score is sortable, pass 1 if higher score is better, 0
            *       if smaller score is better. Otherwise no need to pass variable
            */
            getScore("No Escape", 0);
            ?>
        </div>
        <h3>Settings</h3>
        <div class="container-fluid well">
            <span>Difficulty Level</span>
            <button class="diff btn btn-primary">1</button>
            <button class="diff btn btn-primary">2</button>
            <button class="diff btn btn-primary">3</button>
            <button class="diff btn btn-primary">4</button>
            <button class="diff btn btn-primary">5</button>
        </div>

        <div id="warning" style="color:red;margin-left:7px;opacity:0;"><strong>Warning, this maze may have no escape! Good luck.</strong></div>
        <div style="float:left;width:525px">
            <canvas id="game" width="525px" height="525px" style="background-color:#ccc"></canvas>
        </div>
        <div class="container-fluid well" style="float:left;margin-top:7px">
            <button class="btn btn-primary btn-sm" id="restart">Restart Game</button>
            <br><br>
            <div id="score"><strong>Score:</strong> <span class="result">0</span></div>
            <div id="phases"><strong>Phases Used:</strong> <span class="result">0</span>/5</div>
            <div id="state"><strong>Game State:</strong> <span class="result">Playing.</span></div>
            <br>
            <button id="savescore" class="btn btn-primary btn-sm" style="display:block">Save Score!</button>
        </div>
        <script type="text/javascript" src="games/noescape/noescape_final.js"></script>
        <script>document.getElementById("game").focus();</script>
    </article>
    <?php include "footer.php"; ?>
</div>
</body>
</html>
