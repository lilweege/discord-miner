module.exports = {
	name: 'mine',
	description: 'mine',
	execute(msg, args) {
		const mineral = Math.random() * 20 < 1 ? 'a diamond 💎' : 'stone 🗿';
		msg.channel.send(`${msg.author.username}, you mined ${mineral}`);
	}
}