const env = require("dotenv").config({ path: "./.env" });
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
client.once('ready', () => {
	console.log('client ready');
});

const Mongoose = require('mongoose');
const uri = `mongodb+srv://discord-bot:${process.env.DB_PASS}@cluster0.rlus3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
(async() => {
	await Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log("db connected");
})()

const userSchema = new Mongoose.Schema({
	userId: String,
	diamonds: Number
});
const Account = Mongoose.model('Account', userSchema);

const getDiamonds = async(userID) => {
	let n = 0;
	await Account.find({userId: userID})
	.then(entries => {
		if (entries[0])
			n = entries[0].diamonds;
	})
	.catch(err => {})
	return n;
}

const setDiamonds = async(userID, n, newAcc=false) => {
	if (newAcc)		
		new Account({
			userId: userID,
			diamonds: n
		}).save(err => {});
	else
		Account.updateOne({userId: userID}, {
			diamonds: n
		}, (err, numberAffected, rawResponse) => {});
};

const mine = async(msg) => {
	const isDiamond = Math.random() * 20 < 1;
	if (isDiamond) {
		const cnt = await getDiamonds(msg.author.id);
		setDiamonds(msg.author.id, cnt + 1, !cnt)
	}
	const mineral = isDiamond ? 'a diamond 💎' : 'stone 🗿';
	msg.channel.send(`${msg.author.username}, you mined ${mineral}`);
};

const profile = async(msg) => {
	const cnt = await getDiamonds(msg.author.id);
	msg.channel.send(`${msg.author.username}, you have mined a total of ${await getDiamonds(msg.author.id)} diamonds 💎`);
}

const prefix = '_';
client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot)
		return;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	
	switch (cmd) {
		case 'mine':
			mine(msg);
			break;
		case 'profile':
			profile(msg);
			break;
		default:
			break;
	}
});

client.login(process.env.TOKEN);