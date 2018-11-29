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
        <h1 id="gameName">Safe Roving</h1>
        <h3 id="groupName">Team 442</h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
            <div>
                <b>Player 1</b>
                <ul>
                    <li>Player 1 plays first and plants as many mines as given in game controls on the field. </li>
                    <li>The mine placement should not block all paths of the mothership from the base to the destination.</li>
                    <li>Mines cannot be placed on the mothership and on the destination.</li>
		    <li>Left click the mothership once you finish placing mines to hide the mines and start player 2.</li>

                </ul>
                <b>Player 2</b>
                <br>
                <ul>
                    <li> Your objective is to move the mothership from the base to the destination across a minefield as quickly as possible. 
                        To aid you in your quest, you have some dispensible rovers to scout and destroy mines.</li>
                    <li>In each turn you may move the mothership, spawn a rover if you have one available, or move a rover.</li>
                    <li>To move the mothership or a rover, select it with left click and then left click on a tile that is adjacent to it. 
                        Neither the mothership nor the rovers can move diagonally on the field or through other rovers or skip tiles.</li>
                </ul>
            </div>
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
            getScore("Safe Roving", 0);
            ?>
        </div>
        <h3>Play game in pop up window:<h3>
        <form id="gameSettings" class="well"></form>
        <iframe src="games/roving/Roving_SP.html" class="game" width="800" height="800"></iframe>

    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(1200,1200,"games/roving/Roving_SP.html", []);
</script>
</body>
</html>
