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
    
    var chatmsg = message.content;
    const serverQueue = queue.get(message.guild.id);

    //=help or =commands
    // if (chatmsg.toLowerCase().startsWith(`${prefix}help`) | chatmsg.startsWith(`${prefix}commands`)) {
    //     message.channel.send
    //     (
    //     ""
    //     );
    // };

    //commands:

    //=invite link
    if (chatmsg.toLowerCase().startsWith(`${prefix}invite`)) {
        message.channel.send("https://discordapp.com/oauth2/authorize?client_id=667197788441804815&scope=bot&permissions=3660864");
    };

    //music-related:
    //=play
    if (chatmsg.toLowerCase().startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
    };

    //=skip
    if (chatmsg.toLowerCase().startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
    };

    //=stop
    if (chatmsg.toLowerCase().startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
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

    //=img
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
                // handle error
                return;
            }
            $ = cheerio.load(responseBody);
            var links = $(".image a.link");
            var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
            console.log(urls);
            if (!urls.length) {
                // Handle no results
                return;
            }
            message.channel.send( urls[0] );
        });
       } 
       else { 
        message.channel.send("Error: no search term provided.  Usage example: =img apples");
       }
    };

    //=echo
    if (chatmsg.toLowerCase().startsWith(`${prefix}echo`)) {
        var echomsg = chatmsg.substring(6).replace('=', '');
        if (echomsg.length > 0) {
            message.channel.send(echomsg);
        } else {
            message.channel.send("Error: nothing to echo.  Usage example: $echo The new Tesla Cybertruck is cool.");
        }
    };

    //=roll
    if (chatmsg.toLowerCase().startsWith(`${prefix}roll`)) {
        var randnum = Math.floor(Math.random() * (100 - 1) + 1);
        message.channel.send("🎲 " + randnum);
    };

    //=chance
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

    //=source
    if (chatmsg.toLowerCase().startsWith(`${prefix}source`) | chatmsg.startsWith(`${prefix}source code`)) {
        message.channel.send("https://github.com/CTM-GOAT/Internet-Explorer-Bot");
    };

    //=owo
    if (chatmsg.toLowerCase().startsWith(`${prefix}owo`)) {
        var echomsg = chatmsg.substring(5).replace(new RegExp('l', 'g'), 'w').replace(new RegExp('r', 'g'), 'w');
        if (echomsg.length > 0) {
            message.channel.send(echomsg.replace(new RegExp('$', 'g'), '') + "  💦");
        } else {
            message.channel.send("Error: nothing to owo-ify.  Usage example: $owo Hit or miss, I guess they never miss, huh?.");
        }
    };

    //ban
    if (chatmsg.toLowerCase().startsWith(`${prefix}ban`)) {
        var echomsg = chatmsg.substring(5);
        if (echomsg.length > 0) {
            message.channel.send(chatmsg.substring(5) + " has been banned! 🔨");
        } else {
            message.channel.send("Error: noone to ban.  Usage example: $ban alex");
        }
    };

    //=hl3
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

    //=xd
    if (chatmsg.toLowerCase().startsWith(`${prefix}xd`)) {
        message.channel.send("X D", {
            tts: true
        })
    };

    //=sadcat
    if (chatmsg.toLowerCase().startsWith(`${prefix}sadcat`)) {
        message.channel.send({
            files: ["https://i.kym-cdn.com/photos/images/original/001/389/465/663.jpg"]
        });
    };

    //reddit-related:
    //=pcmr
    if (chatmsg.toLowerCase().startsWith(`${prefix}pcmr`)) {
        loadPcmrPosts();
    };

    function loadPcmrPosts() {
        fetch('https://www.reddit.com/r/pcmasterrace.json?limit=100&?sort=top&t=all')
          .then(res => res.json())
          .then(json => json.data.children.map(v => v.data.url))
          .then(urls => postPcmrPostRand(urls));
      }
      
      function postPcmrPostRand(urls) {
        const randomURL = urls[Math.floor(Math.random() * urls.length) + 1];
        const embed = new Discord.RichEmbed({
          image: {
            url: randomURL
          }
        });
        message.channel.send(embed);
      }


    //regular chatmsg triggers
    if (chatmsg.toLowerCase().includes(`chrome`)) {
        message.channel.send('We don\'t mention that browser here.');
    };

    if (chatmsg.toLowerCase().includes(`internet explorer`)) {
        message.channel.send('What the hell do you want??');
    };

    if (chatmsg.toLowerCase().includes(`arch`)) {
        message.channel.send('One time I was ordering coffee and suddenly realised the barista didn\'t know I use Arch. Needless to say, I stopped mid-order to inform her that I do indeed use Arch. I must have spoken louder than I intended because the whole café instantly erupted into a prolonged applause. I walked outside with my head held high. I never did finish my order that day, but just knowing that everyone around me was aware that I use Arch was more energising than a simple cup of coffee could ever be.');
    };

});

client.login(token);