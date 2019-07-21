const Discord = require('discord.js')
const request = require('request');
const fs = require("fs");

const bot = new Discord.Client();

bot.on('message', (receivedMessage) => {
    if (receivedMessage.author == bot.user) { 
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function codify(contents) {
	return "```" + contents + "```"
}


function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "coinflip") {
        coinflipCommand(arguments, receivedMessage)
    } else if (primaryCommand == "isitup") {
        isItUpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "nslookup") {
        nslookupCommand(arguments, receivedMessage)
    } else if (primaryCommand == "pwgen") {
        pwgenCommand(arguments, receivedMessage)
    } else if (primaryCommand == "pwned") {
        pwnedCommand(arguments, receivedMessage)
    } else if (primaryCommand == "ssl") {
        sslCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help [command]`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 1) {
        receivedMessage.channel.send("Please specify one single command. Try `!help [command]`")
    } else if (arguments.length == 1) {
	    if (arguments == "coinflip") {
	    	receivedMessage.channel.send(codify("coinflip - toss a coin.\n\nExample: '!coinflip'"))
	    } else if (arguments == "isitup") {
	    	receivedMessage.channel.send(codify("isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"))
            } else if (arguments == "nslookup") {
	    	receivedMessage.channel.send(codify("nslookup - uses nslookup to return any IP address info on domains.\n\nExample: '!nslookup redbrick.dcu.ie'"))
	    } else if (arguments == "pwgen") {
	    	receivedMessage.channel.send(codify("pwgen - uses pwgen to generate a password and privately send it to you.\n\nExample: '!pwgen'`"))
	    } else if (arguments == "pwned") {
	    	receivedMessage.channel.send(codify("pwned - check if an email has been pwned.\n\nExample: '!pwned bertie@redbrick.dcu.ie'"))
            } else if (arguments == "ssl") {
                receivedMessage.channel.send(codify("ssl - check the certificate info of a website.\n\nExample: '!ssl redbrick.dcu.ie'"))
            }
    } else {
        receivedMessage.channel.send(codify("Here is the list of brickbot commands:\n • coinflip\n • isitup\n • nslookup\n • pwgen\n • pwned\n • ssl\n • help"))
    }
}

function coinflipCommand(arguments, receivedMessage) {
    request.get({
        url:     'https://faas.jamesmcdermott.ie/function/coinflip',
    }, function(error, response, body) {
        receivedMessage.channel.send(codify("Came up " + body))
    }); 
}

function isItUpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!isitup redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
	request.post({
	    url:     'https://faas.jamesmcdermott.ie/function/isitup',
  	    body:    arguments
        }, function(error, response, body) {
	    receivedMessage.channel.send(codify(body))
        }); 
    }
}

function nslookupCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!nslookup redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/nslookup',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(codify(body))
        });
    }
}

function pwgenCommand(arguments, receivedMessage) {
    request.get({
        url:     'https://faas.jamesmcdermott.ie/function/pwgen',
    }, function(error, response, body) {
        receivedMessage.author.send(codify("Generated Password: " + body))
    });
}

function pwnedCommand(arguments, receivedMessage) {
    email = arguments
    if (arguments.length == 0) {
	receivedMessage.channel.send("No email supplied. Try `!pwned bertie@redbrick.dcu.ie`")
        return
    } else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/haveibeenpwned',
            body:    arguments
        }, function(error, response, body) {
		n = JSON.parse(body).found
		if (n == 0) { 
                	receivedMessage.channel.send(codify(email + " has not been pwned"))
            	} else {
                	receivedMessage.channel.send(codify(email + " has been pwned"))
            	}
        });
    } 
}

function sslCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!ssl redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/certinfo',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(codify(body))
        });
    }
}

bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, '')
bot.login(bot_secret_token)
