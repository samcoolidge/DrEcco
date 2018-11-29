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
        <h1 id="gameName">The Rubber Band Game</h1>
        <h3 id="groupName">Team Zorro</h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
            <div>
                <p>
                    <b>How to Win</b>
                    <br>
                    <font size="2">The objective of the game is to control more nails that your opponent. You gain control of nails by encircling them with rubber bands. Nails that do not touch a rubber band will belong to the player whose rubber band encloses the nail. If both players' bands enclose a nail, the nail belongs to the player whose band is closer to the nail.</font>
                </p>
                <p>
                    <b>Turns</b>
                    <br>
                    <font size="2">Both players play alternately, placing rubber bands on the nails. Players start with 5 bands by default. This number can be changed by making a selection in the settings menu (accesible by the button with the cog icon).</font>
                </p>
                <p>
                    <b>Rules</b>
                    <br>
                <ul>
                    <li>You can select a maximum of 4 nails. The minimum is 1</li>
                    <li>You may not place a rubber band on a nail that already has another band touching it</li>
                    <li>Selection order matters. You can only draw convex shapes with the band. Concave shapes are not allowed</li>
                    <li>Any invalid selection is discarded. You may also reselect nails if you wish to change your current selection</li>
                </ul>
                </p>
            </div>
        </div>
        <div id="scoreArea", class="jumbotron">
	<?php
	    include $base."getScore.php";
	    /*
	    * arg1: gameName, should be the same as the dir name
	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
	    *       if smaller score is better. Otherwise no need to pass variable
	    */
	    getScore("Rubberband", 1);
	?>
	</div>
        <h3>Play It!</h3>
        <form id="gameSettings" class="well">
        </form>
<!--        <iframe src="games/Rubberband/iframe.html" class="game" width="800" height="800"></iframe>-->
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(1000,900,"games/Rubberband/iframe.html", ['textBoxDemo', 'btnDemo', 'selectDemo']);
</script>
</body>
</html>
