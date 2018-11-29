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
<div class="container">
    <?php include $base."header.php"; ?>
    <nav>
        <ul>
        <li><a href="">Home</a></li>
        </ul>
        <?php include $base."leftMenuGame.php"; ?>
    </nav>
	<article>
        <h1 id="gameName">Corner Chess</h1>
        <h3 id="groupName">Team LongNames</h3>
        <h3>Rules</h3>
        <ul class="list-group">
          <li class="list-group-item">
            At each ply, the player can either bring a new piece into play, 
            or move an existing piece in the board.
          </li>
          <li class="list-group-item">
            The first move for each player (white and black), must be bringing the King into play.
          </li>
          <li class="list-group-item">
            Pieces being brought into play cannot be placed over an existing piece.
          </li>
          <li class="list-group-item">
            White can only check black after black has checked or at ply 4 (whichever is earlier).
           </li>
          <li class="list-group-item">
            Black cannot check white before ply 2.
          </li>
        </ul>
        <h3>Leaderboard</h3>
	<div id="scoreArea">
	<?php 
	    include $base."getScore.php";
	    /*
	    * arg1: gameName, should be the same as the dir name 
	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
	    *       if smaller score is better. Otherwise no need to pass variable
	    */
	    getScore("CornerChess", 1);
	?>
	</div>
	<h3>Hit <b> POPUP</b> to play</h3>
        <form id="gameSettings" class="well">
        </form>
	<h3 style="text-align:center">Screenshot</h3>
	<img src="games/CornerChess/img/corner_chess.png" width="100%" heigth="100%" />
<!--        <iframe src="games/corner_chess/iframe.html" class="game" width="800px" height="800px"></iframe> -->
</article>
</div>

    <?php include $base."footer.php"; ?>
<script type="text/javascript">
    newWindowBtn(2000,2000,"games/CornerChess/iframe.html", []);
</script>
</body>
</html>
