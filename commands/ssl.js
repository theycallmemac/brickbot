var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    sslCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "ssl", "!ssl redbrick.dcu.ie");
            return;
	}
	else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/go-collection",
                body:    "-f ssl -a " + args
            },
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
	}
    }
};
