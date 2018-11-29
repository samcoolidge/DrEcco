# DrEcco
Collection of Games for the DrEcco Website

## Writing A Game

To write a game compatible with the Dr. Ecco Website the main entry point must be `index.php`. The CIMS server only runs PHP scripts, so your game's main page will have to be in PHP. Aside from that you can write the code as you wish. If you want to see example games to get started there are plenty in the games folder.

## Testing 

The current server has been copied to "/web/sc6432/drecco2016" on CIMS. There may be a folder DrEcco2018 there.. please ignore for now. The site https://cims.nyu.edu/~sc6432/drecco2016/ is a test version of the website that points to an empty database. Here you can upload your games and make sure they are running properly. In order to do so

- copy your zip file to /web/sc6432/drecco2016/games/ and unzip
- make sure that all files are in `rw-r--r--` mode and all folders are in `rwxr-xr-x` mode at a minimum. You can run `chmod 644 <filename>` and `chmod 755 <folder-name>` to change the modes.
- Run the command `/usr/bin/python2 add_game.py -gn <Name of game on site> -gp <Name-of-folder>`. Note that you must use the full path `/usr/bin/python2` as the default version of `python2` does not have MySQL.
- Check out https://cims.nyu.edu/~sc6432/drecco2016/ and make sure your game is displayed on the left. Click on the link and see if it is working properly.
- If you need to make a change just overwrite the folder with a new version. Please do not run add_game again as this will mess up the database.

## Submission

Once the game has been tested and is running properly. You can submit to me the same .zip file you uploaded to /web/sc6432/drecco2016 or it is fine if you just want to send me an email saying that your final version is there and I can copy it myself. I will then add the final games to the DrEcco website. 


