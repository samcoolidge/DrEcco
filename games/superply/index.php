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
        <h1 id="gameName">Superply</h1>
        <h3 id="groupName">By Wildcards</h3>
        <h3>Brief Game Description:</h3>
        <div id="gameDesc" class="jumbotron">
            There are two players, blue and red. <br/>
            The goal of the blue player is to build a blue path across the grid (from the leftmost column to the rightmost) where a blue path consists of a sequence blue squares such that the first one is in the left column, the last is in the right column and each square touches the next one in the sequence on a side or on a corner.<br/>
            The goal of the red player is to build a red path from top to bottom.<br/>
            To claim a square, the blue/red player must choose one that satisfies the hint he/she gets and that is not already occupied.<br/>
            If the player's selection is not valid the turn goes to the other player.</p>
        </div>
        <div id="scoreArea", class="jumbotron">
            <?php
            include $base."getScore.php";
            /*
            * arg1: gameName, should be the same as the dir name
            * arg2: if your score is sortable, pass 1 if higher score is better, 0
            *       if smaller score is better. Otherwise no need to pass variable
            */
            getScore("superply");
            ?>
        </div>
        <h3>Hit the POPUP button to start game!</h3>
        <form id="gameSettings" class="well"></form>
     </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(2000,2000,"games/superply/example.html",[]);
</script>
</body>
</html>
