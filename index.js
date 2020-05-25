const Discord = require('discord.js');
const {
    prefix,
    token
} = require('./config.json');
var cheerio = require("cheerio"); 
var request = require("request"); 
var fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const queue = new Map();
const client = new Discord.Client();

client.once('ready', () => {
    client.user.setActivity('the world burn.', {type: 'WATCHING'});
    console.log('I.E. will never die.');
});

client.on('message', async message => {
    
    var chatmsg = message.content.toLowerCase();
    const serverQueue = queue.get(message.guild.id);

    try { 

        if (chatmsg.startsWith(`${prefix}help`) | chatmsg.startsWith(`${prefix}commands`)) {
            message.channel.send("To view the complete list of commands, visit the Github page!\n<https://github.com/CTM-GOAT/Internet-Explorer-Bot/blob/master/README.md>");
        };

        if (chatmsg.startsWith(`${prefix}invite`)) {
            message.channel.send("https://discordapp.com/oauth2/authorize?client_id=667197788441804815&scope=bot&permissions=3660864");
        };

        if (chatmsg.startsWith(`${prefix}play`)) {
            var TextInMsg = chatmsg.substring(5);
            if (TextInMsg.length > 0)  {
                execute(message, serverQueue);
            }
        };

        if (chatmsg.startsWith(`${prefix}skip`)) {
            skip(message, serverQueue);
        };

        if (chatmsg.startsWith(`${prefix}stop`)) {
            stop(message, serverQueue);
        };
        
        if (chatmsg.toLowerCase().startsWith(`${prefix}img`)) {
            var search = chatmsg.substring(5);
           if (search.length > 0) { 
            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=" + search,
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            };
            request(options, function(error, response, responseBody) {
                if (error) {
                    return;
                }
                $ = cheerio.load(responseBody);
                var links = $(".image a.link");
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
                console.log(urls);
                if (!urls.length) {
                    return;
                }
                message.channel.send( urls[0] );
            });
           } 
           else { 
            message.channel.send("Error: no search term provided.  Usage example: =img apples");
           }
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}echo`)) {
            var echomsg = chatmsg.substring(6).replace('=', '');
            if (echomsg.length > 0) {
                message.channel.send(echomsg);
            } else {
                message.channel.send("Error: nothing to echo.  Usage example: $echo The new Tesla Cybertruck is cool.");
            }
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}roll`)) {
            var randnum = Math.floor(Math.random() * (6 - 1) + 1);
            var randnum2 = Math.floor(Math.random() * (6 - 1) + 1);
            message.channel.send("Die 1: 🎲 " + randnum);
            message.channel.send("Die 2: 🎲 " + randnum2);
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}chance`)) {
            var randnum = Math.floor(Math.random() * (100 - 1) + 1);
            var isLikely = "not likely";
            var isLikelyEmoji = "🙅‍♀️";
            if (randnum > 50) {
                isLikely = "likely";
                isLikelyEmoji = "👌";
            }
            message.channel.send(randnum + "% chance, its " + isLikely + ". " + isLikelyEmoji);
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}source`) | chatmsg.startsWith(`${prefix}source code`)) {
            message.channel.send("https://github.com/CTM-GOAT/Internet-Explorer-Bot");
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}owo`)) {
            var echomsg = chatmsg.substring(5).replace(new RegExp('l', 'g'), 'w').replace(new RegExp('r', 'g'), 'w');
            if (echomsg.length > 0) {
                message.channel.send(echomsg.replace(new RegExp('$', 'g'), '') + "  💦");
            } else {
                message.channel.send("Error: nothing to owo-ify.  Usage example: $owo Hit or miss, I guess they never miss, huh?.");
            }
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}ban`)) {
            var echomsg = chatmsg.substring(5);
            if (echomsg.length > 0) {
                message.channel.send(chatmsg.substring(5) + " has been banned! 🔨");
            } else {
                message.channel.send("Error: noone to ban.  Usage example: $ban alex");
            }
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}hl3`)) {
            message.channel.send("\n.             " +
                "           ⢀⣀⣠⣤⣤⣴⣦⣤⣤⣄⣀\n" +
                "⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⠿⠿⠿⠿⣿⣿⣿⣿⣶⣤⡀\n" +
                "⠀⠀⠀⠀⣠⣾⣿⣿⡿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣶⡀\n" +
                "⠀⠀⠀⣴⣿⣿⠟⠁⠀⠀⠀⣶⣶⣶⣶⡆⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣦\n" +
                "⠀⠀⣼⣿⣿⠋⠀⠀⠀⠀⠀⠛⠛⢻⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣧\n" +
                "⠀⢸⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⡇\n" +
                "⠀⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿\n" +
                "⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡟⢹⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⣹⣿⣿\n" +
                "⠀⣿⣿⣷⠀⠀⠀⠀⠀⠀⣰⣿⣿⠏⠀⠀⢻⣿⣿⡄⠀⠀⠀⠀⠀⠀⣿⣿⡿\n" +
                "⠀⢸⣿⣿⡆⠀⠀⠀⠀⣴⣿⡿⠃⠀⠀⠀⠈⢿⣿⣷⣤⣤⡆⠀⠀⣰⣿⣿⠇\n" +
                "⠀⠀⢻⣿⣿⣄⠀⠀⠾⠿⠿⠁⠀⠀⠀⠀⠀⠘⣿⣿⡿⠿⠛⠀⣰⣿⣿⡟\n" +
                "⠀⠀⠀⠻⣿⣿⣧⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⠏\n" +
                "⠀⠀⠀⠀⠈⠻⣿⣿⣷⣤⣄⡀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⠟⠁\n" +
                "⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⠿⠋⠁\n" +
                "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠛⠛⠛⠛⠉⠉\n"
            );
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}xd`)) {
            message.channel.send("X D", {
                tts: true
            })
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}sadcat`)) {
            message.channel.send({
                files: ["https://i.kym-cdn.com/photos/images/original/001/389/465/663.jpg"]
            });
        };

        if (chatmsg.toLowerCase().startsWith(`${prefix}pcmr`)) {
            loadPcmrPosts();
        };

        if (chatmsg.toLowerCase().includes(`chrome`)) {
            message.channel.send('We don\'t mention that browser here...');
        };

        if (chatmsg.toLowerCase().includes(`internet explorer`)) {
            message.channel.send('What the hell do you want from me??');
        };

        if (chatmsg.toLowerCase().includes(`microsoft edge`)) {
            message.channel.send('I CAN KICK MS EDGE\'S ASSSSS DONT FUUUUCK WITH ME');
        };

        if (chatmsg.toLowerCase().includes(`arch`)) {
            message.channel.send('One time I was ordering coffee and suddenly realised the barista didn\'t know I use A r c h. Needless to say, I stopped mid-order to inform her that I do indeed use A r c h. I must have spoken louder than I intended because the whole café instantly erupted into a prolonged applause. I walked outside with my head held high. I never did finish my order that day, but just knowing that everyone around me was aware that I use A r c h was more energising than a simple cup of coffee could ever be.');
        };

        if (chatmsg.includes("69")) {
            message.channel.send("Nice.");
        };

        if (chatmsg.includes("420")) {
            message.channel.send("heh heh siiiiiiick four twenteeeeeeeeeee");
        };

        if (chatmsg.toLowerCase().includes("spam")) {
            message.channel.send("Did");
            message.channel.send("someone");
            message.channel.send("say");
            message.channel.send("s p a m ?");
        };

        if (chatmsg.toLowerCase().includes("nudes")) {
            message.channel.send({
                files: ["./Internet_Explorer_7.png"]
            });
            message.channel.send("***Do you like what you see?***");
        };

        if (chatmsg.toLowerCase().includes("gamer")) {
            message.channel.send("You think you're a real g a m e r, but you won't rise at 330am to get those extra hours of grinding in. I have pre packaged meals on-go for any situation. I've got weed to bury the pain of my carpel tunnel. I've gone through about 17 different logitech and corsair keyboards. 23 mice, and 5 monitors later I feel like I can take on anybody and anything. I only sleep once my quests have been fulfilled, and my E-girlfriend has been supporting me along the way, even if I've never heard her voice before I know she wants the best for me. All it takes is one little assumption about me for me to completely obliterate any chance of you beating me. I can use black magic to reverse your energy, completely polarising your ability to use hand eye coordination. Dont fuck with me, boomer.");
        }

        if (chatmsg.toLowerCase().includes("lit mobile")) {
            message.channel.send("So Lit🔥 Mobile🔥 just sent me 📩 this wireless battery pack 🔋📱, I'm excited let's see what's inside😲😲😲. I really like the build 👌, it's got hand grips on the side ✋🏿, it's shockproof 🔌, and water resistant. The power bank has 20,000 milliamps⚡, which can fully charge your phone up to 8 times 😲🤭🤭! It's also got a convenient loop for carabiners. On the back of the device📱, we have a bunch of solar panels ⚡ which can charge the battery bank in about 60 minutes⌚⌚. On the top of the device, there are 3 USB ports🔌 and 2 of them are fast-chargers🚗🚗🚗. If you hit the power button two times, the LED 💡light💡 comes on. If you hit the power button once, the LED lights will tell you how much battery you have🔋🔋. There's a microUSB port on the side for fast charging. My 👏🏿favorite👏🏿 part of this device is that it charges my phone wirelessly📶. There's a red🔴 light indactor at the top to let you know that your phone is charging 🥵🥵🥵");
        };

        async function execute(message, serverQueue) {
            const args = message.content.split(' ');
        
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('I need the permissions to join and speak in your voice channel!');
            }
        
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };
        
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
        
                queue.set(message.guild.id, queueContruct);
        
                queueContruct.songs.push(song);
        
                try {
                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    play(message.guild, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return message.channel.send(`${song.title} has been added to the queue!`);
            }
        
        }
        
        function skip(message, serverQueue) {
            if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
            if (!serverQueue) return message.channel.send('There is no song that I could skip!');
            serverQueue.connection.dispatcher.end();
        }
        
        function stop(message, serverQueue) {
            if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        
        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
        
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
        
            const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
                .on('end', () => {
                    console.log('Music ended!');
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on('error', error => {
                    console.error(error);
                });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        }
    
        function loadPcmrPosts() {
            fetch('https://www.reddit.com/r/pcmasterrace.json?limit=100&?sort=top&t=all')
              .then(res => res.json())
              .then(json => json.data.children.map(v => v.data.url))
              .then(urls => postPcmrPostRand(urls));
        };
          
        function postPcmrPostRand(urls) {
        const randomURL = urls[Math.floor(Math.random() * urls.length) + 1];
        const embed = new Discord.RichEmbed({
            image: {
            url: randomURL
            }
        });
        message.channel.send(embed);
        };

    }
    catch (err) { 
        message.channel.send('***Oops, got an error:  \n***`' + err + '`');
    }

});

client.login(token);