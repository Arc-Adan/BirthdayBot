curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
npm install --save discord.js
npm install fs
npm install node-watch

Change the Token and the channelID in config.json

If any error occur or if you have any questions feel free to DM me on Discord "Sir Muffin™#8911"

data.json should never be empty if it is anyways pate this into it: {"tab":["1","1","1"]}
else the bot wont work.


Commands

set_prefix --> followed by 1 or 2 special characters to set the prefix
set_time --> follow by 1 or 2 digits 24 hour format 0-23 to set the time the bot writes 
set_command --> followed by anything to set the command to set the add command for the user birthday
set_channel --> followed by a 10-20 digit number to set the channel where the bot writes the birthday