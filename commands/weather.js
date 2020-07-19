var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    command: function(bot, args, receivedMessage) {
	if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "location", "!weather Glasnevin");
            return;
	} else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/bash-collection",
                body:    "-f weather.sh -a " + args
            },
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
        } 
    }
};
