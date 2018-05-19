//---------------------------------------------------------------------
//		Discord Birthday bot written for https://discord.me/evac
//---------------------------------------------------------------------
var Discord = require("discord.js");
var fs = require("fs");
var watch = require("node-watch");
var data = require("./data.json");
var config = require("./config.json");
var mod = true;
var log = true;
var removemsg = true;

//LakelynBot <3

if(config.token == "") {
    console.log("Enter the Bot Token and restart the Bot");
    process.exit(1);
};//check if config.json has a bot token
if(config.channelID == ""){
    console.log("Enter the Channel ID and restart the Bot");
    process.exit(1);
}; //check if config.json has a channelID

const client = new Discord.Client();
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels.`);
    //client.user.setActivity(`with Muffin :heart:`);
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
        if(config.log === "on"){
            log = true;
        };
        if(config.log === "off"){
            log = false;
        };
        if(config.removemsg === "on"){
            removemsg = true;
        };
        if(config.removemsg === "off"){
            removemsg = false;
        };
    }, 500);

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
                client.channels.get(config.channelID).send(`Today is ${arr2}'s Birthday`);
            }

        }
        }, 60000);

}); // Output the Birthday

client.on("guildMemberRemove",(member) => {
    //client.channels.get("426853176587583493").send(`<@${member.id}> has just left the server`);
} ); //BIG WORK IN PROGRESS

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.author.dmChannel) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'set_time') {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        var UserInput = args.join("");
        var regex = /([0-9]{2})$/;
        if (regex.test(UserInput) || UserInput == 'now') {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.time = UserInput;
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
            message.channel.send('Time has been changed succsesfully');
        }
        else {
            message.channel.send("Invalid time");
        }
        if(log == true){
            console.log('Changed time');
        }
    }   //ok

    if (command == "set_prefix") {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        var regex = /([\.\,\!\"\§\$\%\&\/\=}?}`\´\*\+\~\'\#\-\_\<\>\|\\]{1,2})$/;
        var UserInput = args.join("");
        if (regex.test(UserInput) == true) {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.prefix = UserInput;
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
                message.channel.send('prefix has been changed succsesfully');
            });
        }
        else {
            message.channel.send("Invalid prefix");
        }
        if(log == true){
            console.log('Changed prefix');
        }


    }      //ok

    if (command === 'set_channel') {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        var regex = /([0-9]{10,20})$/;
        var UserInput = args.join("");
        if (regex.test(UserInput) == true) {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.channelID = UserInput;
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
            message.channel.send('ID has been changed succsesfully');
        }
        else {
            message.channel.send("Invalid ID");
        }
        if(log == true){
            console.log('Changed ID');
        }
    }       //ok

    if (command == "set_command") {

        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }

        var UserInput = args.join("");
        fs.readFile("config.json", function (err, data) {
            if (err) throw err;
            var cf = JSON.parse(data);
            cf.command = UserInput;
            var json = JSON.stringify(cf);
            fs.writeFileSync("config.json", json, "utf8");
        });
        if(log == true){
            console.log('Changed command');
        }
        message.channel.send('Command has been changed succsesfully');

    }      //ok

    if (command === "help") {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name)))
            mod = false;

        if (mod == false) {
            const embed = {
                "fields": [
                    {
                        "name": `${config.prefix}${config.command}`,
                        "value": `Adds your Birthday`
                    }
                ]
            };
            message.channel.send({embed});
        }
        else if (mod == true) {
            const embed = {
                "fields": [
                    {
                        "name": `${config.prefix}${config.command}`,
                        "value": `Adds your Birthday`
                    },
                    {
                        "name": `${config.prefix}set_prefix`,
                        "value": `change the prefix for the Birthday commands`
                    },
                    {
                        "name": `${config.prefix}set_channel`,
                        "value": `change the channel for the Birthday output`
                    },
                    {
                        "name": `${config.prefix}set_command`,
                        "value": `change the command for the Birthday commands`
                    },
                    {
                        "name": `${config.prefix}set_time`,
                        "value": `change the time for the Birthday output`
                    },
                    {
                        "name": `${config.prefix}switch_log`,
                        "value": `turn the console loggin on or off`
                    },
                    {
                        "name": `${config.prefix}switch_removemsg`,
                        "value": `turn the message removal for commands on or off`
                    }
                ]
            };
            message.channel.send({embed});
        }
        ;
    }           //ok

    if (command === "switch_removemsg") {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        if (config.log == "on") {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.removemsg = "off";
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
        }
        else if (config.log == "off") {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.removemsg = "on";
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
        }
    }   //ok

    if (command === "switch_log") {
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        if (config.log == "on") {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.log = "off";
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
        }
        else if (config.log == "off") {
            fs.readFile("config.json", function (err, data) {
                if (err) throw err;
                var cf = JSON.parse(data);
                cf.log = "on";
                var json = JSON.stringify(cf);
                fs.writeFileSync("config.json", json, "utf8");
            });
        }
    }       //ok

    if(command === "read_config"){
        if (!message.member.roles.some(r => ["Administrators", "Moderators", "god"].includes(r.name))){
            if(removemsg == true){
                message.delete().catch(O_o => {});
            }
            return;
        }
        const embed = {
            "fields": [
                {
                    "name": `__prefix__`,
                    "value": `${config.prefix}`
                },
                {
                    "name": `__command__`,
                    "value": `${config.command}`
                },
                {
                    "name": `__channelID__`,
                    "value": `${config.channelID}`
                },
                {
                    "name": `__time__`,
                    "value": `${config.time}`
                },
                {
                    "name": `__log__`,
                    "value": `${config.log}`
                },
                {
                    "name": `__removemsg__`,
                    "value": `${config.removemsg}`
                },
                {
                    "name": `__errmsg01__`,
                    "value": `${config.errmsg01}`
                },
                {
                    "name": `__errmsg02__`,
                    "value": `${config.errmsg02}`
                }
                ,{
                    "name": `__errmsg03__`,
                    "value": `${config.errmsg03}`
                },
                {
                    "name": `__errmsg04__`,
                    "value": `${config.errmsg04}`
                },
                {
                    "name": `__donesmg01__`,
                    "value": `${config.donemsg01}`
                }
            ]
        };
        message.channel.send({embed});
    } //change it in the future to make it less hardcoded (see Output birthday)

    if (command === config.command) {
        var a = 0;
        var check = false;
        var ID = message.member.id;
        const UserInput = args.join(" ");
        var regex = /([0-9]{2})(\.)([0-9]{2})(\.)$/;
        var BirthdaySplitDay = UserInput.split('.')[1];
        var BirthdaySplitMonth = UserInput.split('.')[0];
        if(log == true){
            console.log("User: " + message.member.id + " issued the command: " + config.command + " ; Content: " + UserInput);
        }
        data.tab.every(function () {
            if (ID == data.tab[a]) {
                check = true;
                if(log == true){
                    console.log("ID check = already known");
                }
                return false;
            }
            else {
                a++;
                return true;
            }
        });

        if (check == false) {
            if (regex.test(UserInput) == true) {

                if (BirthdaySplitDay > 31 || BirthdaySplitDay <= 0) {
                    if(removemsg == true){
                        message.delete().catch(O_o => {});
                    }
                    if(log = true){
                        console.log("User: " + ID + " did a mistake entering their birthday(DAY)");
                    }
                    message.channel.send(config.errmsg01);
                    return false;
                }

                else if (BirthdaySplitMonth > 12 || BirthdaySplitMonth <= 0) {
                    if(removemsg == true){
                        message.delete().catch(O_o => {});
                    }
                    if(log = true){
                        console.log("User: " + message.member.id + " did a mistake entering their birthday(MONTH)");
                    }
                    message.channel.send(config.errmsg02);
                    return false;
                }

                else if (BirthdaySplitDay > 30 && BirthdaySplitMonth % 2 === 1) {
                    if(removemsg == true){
                        message.delete().catch(O_o => {});
                    }
                    if(log = true){
                        console.log("User: " + message.member.id + " did a mistake entering their birthday(MONTH)");
                    }

                    message.channel.send(config.errmsg02);
                    return false;
                }

                else if (BirthdaySplitDay > 28 && BirthdaySplitMonth === "02") {
                    if(removemsg == true){
                        message.delete().catch(O_o => {});
                    }
                    if(log = true){
                        console.log("User: " + message.member.id + " did a mistake entering their birthday(MONTH)");
                    }
                    message.channel.send(config.errmsg02);
                    return false;
                }

                else {
                    fs.readFile("data.json", function (err, data) {
                        if (err) throw err;
                        var BDData = JSON.parse(data);
                        if (!BDData.hasOwnProperty("tab"))
                            BDData.tab = [];
                        BDData.tab.push(message.member.id, BirthdaySplitMonth, BirthdaySplitDay);
                        var json = JSON.stringify(BDData);
                        fs.writeFileSync("data.json", json, "utf8");
                    });
                    if(removemsg == true){
                        message.delete().catch(O_o => {});
                    }
                    message.channel.send(config.donemsg01);
                    return false;
                }

            }
            else {
                if(log = true){
                    console.log("User: " + message.member.id + " made a typo or smth");
                }
                if(removemsg == true){
                    message.delete().catch(O_o => {});
                }
                message.channel.send(config.errmsg03);
                return false;
            }
        }
        else {
            if(removemsg = true){
                message.delete().catch(O_o => {});
            }
            message.channel.send(config.errmsg04);
        }
    }      //ok

}); //all the commands

client.login(config.token);