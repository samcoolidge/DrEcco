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
        <li><a href="games/empty">Empty Template</a></li>
	<li><a href="games/multiplayer-snake/">Snake</a></li>
        <?php include $base."leftMenuGame.php"; ?>
    </nav>
    <article>
        <h1 id="gameName"></h1>
        <h3 id="groupName"></h3>
        <div id="gameDesc" class="jumbotron">
            <h2>Rules</h2>
            <p>Dancing Without Stars is a game with two players: the choreographer and the spoiler. The dance floor (shown below) consists of squares which one dancer or one star (but not both) can occupy at any time. The choreographer's goal is to get the red and blue dancers to partner up&mdash;i.e., to move dancers so that every red dancer is vertically or horizontally adjacent to its own blue dancer (dancers cannot share partners). The goal of the spoiler is to prevent the dancers from pairing up for as long as possible by moving the stars to block the dancers.</p>
            <p>The game proceeds in alternating turns: the choreographer moves the specified dancers, then the spoiler moves the specified stars. The choreographer, during her turn, chooses a dancer and moves it up/down/left/right using <b>W/S/A/D</b>, respectively. The choreographer can only move a dancer diagonally if that dancer is in a corner, using <b>C</b>. The spoiler, on his turn, has two options: either (1) choose a star and move it up/down/left/right, using the same <b>W/S/A/D</b> controls, or (2) choose a star and move that star to a random unoccupied position on the board, using <b>R</b>.  A restriction on star placement is imposed that they cannot be within 1 Euclidean unit away from another to prevent cornering a dancer.</p>
            <p>The game is over when the choreographer has paired each red dancer with its own blue dancer. The choreographer's score is the number of <i>choreographer turns</i> it took for the dancers to pair up.</p>
            <h2>Interface</h2>
            <p>The area below is the dance floor. Below the dance floor is the <b>Randomly Teleport Selected Star</b> button, the <b>New Game</b> button, the <b>Player Turn</b> indicator, the <b>Score indicator</b>, and the <b>Game Status</b> indicator. <b>Player Turn</b> indicates whose turn it is. <b>Score</b> indicates how many choreographer turns have passed. <b>Game Status</b> displays whether the game is over or not.</p>
            <p>To start a new game, press the <b>New Game</b> button.</p>
            <p>To select a star/dancer, click the square containing the star/dancer.</p>
            <p>To un-select a dancer/star, click the selected a second time.</p>
            <p>To move a selected star/dancer, press <b>W/S/A/D</b> for up/down/left/right, respectively. If the move is legal, then the move will occur. If the move is illegal, then the move will not occur and you can try again. Your turn is only finished when you have made a legal move. As the choreographer, a dancer may move diangonally if it is in the corner, using <b>C</b>.</p>
            <p>To randomly teleport a selected star, press <b>R</b>.</p>
        </div>
        <iframe src="games/Dancing/dancing_without_stars.html" class="game" width="800" height="800"></iframe>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    initInfo("Dancing Without Stars", "Team 42", "");
</script>
</body>
</html>
