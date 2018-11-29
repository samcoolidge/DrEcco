<?php
//DATABASE CONNECTION VARIABLES
$host = "warehouse.cims.nyu.edu"; // Host name

$username = "sc6432"; // Mysql username
$password = "f2wnpaah"; //Msql password
$db_name = "sc6432_sc6432_test"; //Database name


//DO NOT CHANGE BELOW THIS LINE UNLESS YOU CHANGE THE NAMES OF THE MEMBERS AND LOGINATTEMPTS TABLES

$tbl_prefix = ""; //***PLANNED FEATURE, LEAVE VALUE BLANK FOR NOW*** Prefix for all database tables
$tbl_members = $tbl_prefix."members";
$tbl_attempts = $tbl_prefix."loginAttempts";
$tbl_saves = $tbl_prefix."saves";
$tbl_games = $tbl_prefix."game";
$tbl_scores = $tbl_prefix."scores";
