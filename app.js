var Discord = require(".\discord.js");
var fs = require(".\fs");
var watch = require(".\node-watch");



const client = new Discord.Client();
var data = require("./data.json");
var config = require("./config.json");
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
    watch('./data.json', function (evt, name) {
        console.log(evt,name);
        if(evt == 'update'){
            delete require.cache[require.resolve('./data.json')];
            data =  require('./data.json');
        }
    }); //refresh data.json whenever a change happens
    watch('./config.json', function (evt, name) {
        console.log(evt,name);
        if(evt == 'update'){
            delete require.cache[require.resolve('./config.json')];
            config =  require('./config.json');
        }
    }); //refresh config.json whenever a change happens

    setInterval(function () {
        var date = new Date();
        var utcDate = new Date(date.toUTCString());
        utcDate.setHours(utcDate.getHours()-9);
        var usDate = new Date(utcDate);
        var hours = usDate.getHours();

        if(hours == config.time || config.time == "now")
        {
            var today = new Date();
            var mmraw = today.getMonth();
            var ddraw = today.getDate();
            if(ddraw < 10){
                var dd = ("0" + today.getDate()).slice(-2);
            }
            else{
                var dd = ddraw;
            }
            if(mmraw < 10){
                var mm = ("0" + (today.getMonth() + 1)).slice(-2);
            }
            else {
                var mm = today.getMonth()+1;
            }
            var arr = [];
            var a = 0;
            data.tab.every(function (item) {
                    if(mm === data.tab[a+1]){
                        console.log("Month ok");
                        if(dd == data.tab[a+2]){
                            console.log("Day ok");
                            arr.push(`<@${data.tab[a]}>`);
                            a++;
                            return true;
                        }
                        else{
                            a++;
                            return true;
                        }
                    }
                    else{
                        a++;
                        return true;
                    }
            });
            var arr2 = arr.join(', ');

            if(arr.length !== 0){
                client.channels.get(config.channelID).send(`@everyone Today is ${arr2}'s Birthday`);
            }

        }
        }, 60000);

});
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("message", async message => {
    if(message.author.bot) return;
    if(message.author.dmChannel) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'set_time'){
        if(!message.member.roles.some(r=>["Administrator", "Moderator", "god"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");

        var UserInput = args.join("");
        var regex = /([0-9]{2})$/;
        if(regex.test(UserInput) || UserInput == 'now'){
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.time = UserInput;
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
            message.channel.send('Time has been changed succsesfully');
        }
        else{
            message.channel.send("Invalid time");
        }
        console.log('Changed time');
    }   //ok

    if(command == "set_prefix"){
        if(!message.member.roles.some(r=>["Administrator", "Moderator", "god"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");
        var regex = /([\.\,\!\"\§\$\%\&\/\=}?}`\´\*\+\~\'\#\-\_\<\>\|\\]{1,2})$/;
        var UserInput = args.join("");
        if(regex.test(UserInput) == true){
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.prefix = UserInput;
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
                message.channel.send('prefix has been changed succsesfully');
            });
        }
        else{
            message.channel.send("Invalid prefix");
        }
        console.log('Changed prefix');

    }      //ok

    if(command === 'set_channel'){
        if(!message.member.roles.some(r=>["Administrator", "Moderator", "god"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");

        var regex = /([0-9]{10,20})$/;
        var UserInput = args.join("");
        if(regex.test(UserInput) == true){
            fs.readFile("config.json", function (err, data) {
            if (err) throw err;
            var cf = JSON.parse(data);
            cf.channelID = UserInput;
            var json = JSON.stringify(cf);
            fs.writeFileSync("config.json", json, "utf8");
            });
            message.channel.send('ID has been changed succsesfully');
        }
        else{
            message.channel.send("Invalid ID");
        }
        console.log('Changed ID');
    }       //not ok

    if(command == "set_command"){
        if(!message.member.roles.some(r=>["Administrator", "Moderator", "god"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");
        var UserInput = args.join("");
        fs.readFile("config.json", function (err, data) {
            if (err) throw err;
            var cf = JSON.parse(data);
            cf.command = UserInput;
            var json = JSON.stringify(cf);
            fs.writeFileSync("config.json", json, "utf8");
        });
        console.log('Changed command');
        message.channel.send('ID has been changed succsesfully');

    }      //ok


    if(command === config.command) {
        var a = 0;
        var check = false;
        var ID = message.member.id;
        const UserInput = args.join(" ");
        var regex = /([0-9]{2})(\.)([0-9]{2})(\.)$/;
        var BirthdaySplitDay = UserInput.split('.')[1];
        var BirthdaySplitMonth = UserInput.split('.')[0];
        console.log("User: "+ message.member.id +" issued the command: "+config.command+" ; Content: "+UserInput);
        data.tab.every(function () {
			if (ID == data.tab[a]) {
                check = true;
                return false;
            }
            else{
			    a++;
			    return true;
			}
        });
            console.log("ID check = already known");
        if(check == false) {
            if (regex.test(UserInput) == true) {

                if (BirthdaySplitDay > 31 || BirthdaySplitDay <= 0) {
                    message.delete().catch(O_o => {});
                    console.log("User: "+ID+" did a mistake entering their birthday");
                    message.channel.send("Something went horribly wrong...");
                    return false;
                }

                else if (BirthdaySplitMonth > 12 || BirthdaySplitMonth <= 0) {
                    message.delete().catch(O_o => {});
                    console.log("User: "+message.member.id+" did a mistake entering their birthday");
                    message.channel.send("Something went horribly wrong...");
                    return false;
                }

                else if (BirthdaySplitDay > 30 && BirthdaySplitMonth % 2 === 1) {
                    message.delete().catch(O_o => {});
                    console.log("User: "+message.member.id+" did a mistake entering their birthday");
                    mmessage.channel.send("Something went horribly wrong...");
                    return false;
                }

                else if (BirthdaySplitDay > 28 && BirthdaySplitMonth === "02") {
                    message.delete().catch(O_o => {});
                    console.log("User: "+message.member.id+" did a mistake entering their birthday");
                    message.channel.send("Something went horribly wrong...");
                    return false;
                }

                else{
                    fs.readFile("data.json", function (err, data) {
                        if (err) throw err;
                        var BDData = JSON.parse(data);
                        if (!BDData.hasOwnProperty("tab"))
                            BDData.tab = [];
                        BDData.tab.push(message.member.id, BirthdaySplitMonth, BirthdaySplitDay);
                        var json = JSON.stringify(BDData);
                        fs.writeFileSync("data.json", json, "utf8");
                    });
                    message.delete().catch(O_o => {});
                    message.channel.send(":ok_hand:");
                    return false;
                }

            }
            else{
                console.log("User: "+message.member.id+" did a typo or smth");
                message.channel.send("...");
                return false;
            }
        }
        else{
            message.delete().catch(O_o => {});
            message.channel.send(":no_entry:");
        }
    }
});

client.login(config.token);