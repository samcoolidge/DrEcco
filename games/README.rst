===============================
Game Collection for HPS website
===============================

All games that need to be uploaded on the website must implement the following
items:

1. The game must be submitted as a zip file, which unzips the game into a separate
   directory or as a git repo.
2. The main entry point to the game must be ``index.php``. (Not our idea!)
   The CIMS server only runs PHP scripts, so your game's main page will have to be
   in PHP. From their, you can probably run the game via Javascript.

We have copied the current server and games over to ``/web/mmc691/drecco2016`` on the CIMS
server if you want to take a look at the code. We can also provide you a zip of the whole
thing over email if you want.

You can see the current games in ``/web/mmc691/drecco2016/games/`` and there are some
docs there as well which might help you with the interface. The website is a test version
so you can try uploading your game there before final submission.

The website is available at https://cims.nyu.edu/~mmc691/drecco2016/

Testing your game
-----------------

1. If you are using a zip, copy your zip file to ``/web/mmc691/drecco2016/games/`` and unzip it.
   After unzipping, please make sure that all files are in ``rw-r--r--`` mode and all folders
   are in ``rwxr-xr-x`` mode at a minimum. You can run ``chmod 644 <filename>`` and
   ``chmod 755 <folder-name>`` to change the modes.
   If you are submitting a git repo, clone the git repo in ``/web/mmc691/drecco2016/games``.
2. Run the command ``/usr/bin/python2 add_game.py -gn <Name of game on site> -gp <Name-of-folder>``
   Also, you have to use the full path to ``/usr/bin/python2``. The default ``python2``
   doesn't have MySQL client installed.
3. Go to https://cims.nyu.edu/~mmc691/drecco2016/
   Your game should be in the list on the left. You can click on it and test it out for.
4. In case, you make changes, just overwrite the folder that already exists or rerun the
   ``add_game.py`` script with a different folder and game name. Please don't rerun the
   script with the same arguments again since it messes up the database.

Once you are done testing, please run the same steps in ``/usr/httpd/entities/drecco2016/games/``
directory to upload you game to the main site at https://cims.nyu.edu/drecco2016/


Copying the server
------------------

This is for future teams that will collect games for the course.

It is best to create a copy of the entire server to allow the game developers to test their
submissions. You can create a copy of the server in your public web directory on CIMS. The
following steps should get you going -

1. First, create a MySQL database for the server. Follow the instructions at
   https://cims.nyu.edu/webapps/content/systems/userservices/databases to setup a database
   for yourself.
2. Copy the existing server to your local web directory.
   ``cp -av /usr/https/entities/drecco2016/ ~/public_html/`` will create a copy which can
   be accessed from https://cims.nyu.edu/~<your-net-id>/drecco2016.
3. Change the database credentials in ``dbman.conf``, ``create_tables.py`` and
   ``games/add_game.py`` to your new database. Also, change the
   ``<base href="https://cims.nyu.edu/drecco2016>`` in line 4 in ``index.php`` to
   ``<base href="https://cims.nyu.edu/~<your-net-id>/drecco2016>``. Also, make changes to
   this doc if you need to before redistributing.
4. Now, you should see a fresh website with no games in it.
   Run ``/usr/bin/python2 ./add_game.py -gn 'Dig That' -gp DigThat`` and see that the game
   is available in your new server.


Notes
-----

* The registration and login forms do not work correctly on the site. To try and fix them,
  update the incorrect base and root paths to the correct one.

  ``find . -type f -exec grep '~by653' {} + 2>/dev/null`` will help you find instances of
  where the path is incorrect.

  After that, the CSS will probably need to be updated as well. This is just one issue that
  was spotted. There are other issues that require investigation before the login and
  registration will work.

* After all the games have been uploaded to the main site, ask the CIMS IT team to run
  ``sudo chown -R shasha:shasha /usr/httpd/entities/drecco2016/games/`` to fix the file owners.

Let us know in case of questions or issues at https://gitlab.com/mmc691/hps-game-collection/

| Cheers,
| TeamRocket (Munir and Elaina)
