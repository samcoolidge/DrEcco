// this file is used to save scores to Dr Ecco's website
// for homework use only

function saveScore(spoiler, choreo, level, score) {
  let hardness = ''
  if (level === 0) hardness = 'easy'
  else if (level === 1) hardness = 'intermediate'
  else if (level === 2) hardness = 'hard'
  else hardness = 'hell'
  
  $.get('https://cims.nyu.edu/drecco2016/games/dancing2017/saveScore.php', {
        score: score,
        gamename: 'Dancing2017',
        playername: 'c:' + choreo + ' vs s:' + spoiler + ' (' + hardness + ')'
    }).done(function(data) {
        console.log("Saved success");
        console.log(data);
    }).fail(function(data) {
        console.log("Saved failure");
        console.log(data);
    });
}
