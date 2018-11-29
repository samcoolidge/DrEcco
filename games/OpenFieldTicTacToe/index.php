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
        <li><a href="games/empty">Empty Template</a></li>
        </ul>
        <?php include $base."leftMenuGame.php"; ?>
    </nav>
    <article>
        <h1 id="gameName"></h1>
        <h3 id="groupName"></h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
          <p>
            This is a two player game for <a href="https://cacm.acm.org/magazines/2017/1/211108-open-field-tic-tac-toe/fulltext">open field tic tac toe</a>.
          </p>
		  <p>
		    In the spirit of Gomoku, two people play tic-tac-toe but on a board of user-chosen size。
		  </p>
		  <p>
		    A player wins by getting four pieces in a row—vertically, horizontally, or diagonally.
          </p>
		  <p>
		    Warm-up. Can the first player force a win in seven turns or less, where a turn consists of both player placing pieces?
		  </p>
        </div>
      	<div id="scoreArea", class="jumbotron">
      	<?php
      	    include $base."getScore.php";
      	    /*
      	    * arg1: gameName, should be the same as the dir name
      	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
      	    *       if smaller score is better. Otherwise no need to pass variable
      	    *
      	    */
      	    getScore("OpenFieldTicTacToe");
      	?>
      	</div>
        <h3>Settings</h3>
        <form id="gameSettings" class="well">
        </form>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    initInfo("OpenFieldTicTacToe", "by Winter", "");
    newWindowBtn(1024, 1024,"./games/OpenFieldTicTacToe/winter.html", []);
</script>
</body>
</html>
