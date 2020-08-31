const env = require("dotenv").config({ path: "./.env" });
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
for (const file of fs.readdirSync('./commands').filter(f => f.endsWith('.js'))) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('ready');
});

const prefix = '_';
client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot)
		return;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	
	switch (cmd) {
		case 'mine':
			client.commands.get('mine').execute(msg, args);
			break;
		default:
			break;
	}
});

client.login(process.env.TOKEN);