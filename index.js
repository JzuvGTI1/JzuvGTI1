
const { WAConnection, MessageType } = require("@adiwajshing/baileys");
const fs = require("fs");
const ms = require("parse-ms");
const db = require("quick.db");
const join = JSON.parse(fs.readFileSync("./database/register.json"));
const config = require("./database/config.json");
function waktu(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;

}
const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

prefix = config.prefix;
async function start() {
  const client = new WAConnection();
  client.version = [2, 2144, 10];
  client.on("qr", () => {
    console.log("Now you can scan qr code");
  });
  fs.existsSync("./LoadData.json") && client.loadAuthInfo("./LoadData.json");//untuk load nya
  client.on("connecting", () => {
    console.log("Connecting...");
  });
  client.on("open", () => {
    fs.writeFileSync(
      "./LoadData.json",
      JSON.stringify(client.base64EncodedAuthInfo(), null, "\t")
    );
    console.log("Connected!");
  });
  await client.connect();

  client.on("chat-update", async (sen) => {
    try {
      if (!sen.hasNewMessage) return;
      sen = sen.messages.all()[0];
      global.prefix;
      if (!sen.message) return;
      if (sen.key && sen.key.remoteJid == "status@broadcast") return;
      if (sen.key.fromMe) return;
      const type = Object.keys(sen.message)[0];
      const from = sen.key.remoteJid;
      const { text, extendedText } = MessageType;
      body =
        type === "conversation" && sen.message.conversation.startsWith(prefix)
          ? sen.message.conversation
          : type == "imageMessage" &&
            sen.message.imageMessage.caption.startsWith(prefix)
          ? sen.message.imageMessage.caption
          : type == "videoMessage" &&
            sen.message.videoMessage.caption.startsWith(prefix)
          ? sen.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            sen.message.extendedTextMessage.text.startsWith(prefix)
          ? sen.message.extendedTextMessage.text
          : "";
          
      const isGroup = from.endsWith("@g.us");
      const sender = isGroup ? sen.participant : sen.key.remoteJid;
      const isOwner = config.ownerNumber.includes(sender);
      const isJoin = join.includes(sender);
      const conts = sen.key.fromMe
        ? client.user.jid
        : client.contacts[sender] || {
            notify: client.user.jid.replace(/@.+/, ""),
          };
      const botnumber = client.user.jid
      const groupMetadata = isGroup ? await client.groupMetadata(from) : "";
      const groupMembers = isGroup ? groupMetadata.participants : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
      const isGroupAdmins = groupAdmins.includes(sender) || false
      const isBotGroupAdmins = groupAdmins.includes(botnumber) || false
      const username = sen.key.fromMe
        ? client.user.name
        : conts.notify || conts.vname || conts.name || "-";
      const isCmd = body.startsWith(prefix);
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      //kick
const mentionByTag = type == "extendedTextMessage" && sen.message.extendedTextMessage.contextInfo != null ? sen.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByreply = type == "extendedTextMessage" && sen.message.extendedTextMessage.contextInfo != null ? sen.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByreply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []
      //group chatlog
      if (isCmd && isGroup) {
        console.log(
          `[Group-Chat] From: ${username}, No: ${
            sender.split("@")[0]
          }, Group: ${groupName}, Text: ${command}`
        );
      }
      //private chat
      if (isCmd && !isGroup) {
        console.log(
          `[Private-Chat] From: ${username}, No: ${
            sender.split("@")[0]
          }, Text: ${command}`
        );
      }
      switch (command) {
        case "helpjsjs":
        case "menjsjsjsu":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let suse2 = await db.fetch(`use_${sender}`);
          let stimeout2 = 60000;
          if (suse2 !== null && stimeout2 - (Date.now() - suse2) > 0) {
            let stime = ms(stimeout2 - (Date.now() - suse2));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${stime.minutes} menit, ${stime.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
           // let usword = db.fetch(`sword_b_${sender}`);
           if (args[0] === "jzbot") {
            listhelpgt = `*🔱JzBot Casino🔱*
*========================*
*Prefix: ${prefix}*
*Made By: JzuvGTI👑*
*========================*
*📲Command Member📲*
_${prefix}register_
_${prefix}profile_
_${prefix}daily_
_${prefix}work_
_${prefix}balance/bal_
_${prefix}leaderboard/lb_
_${prefix}pay [tag] [jumlah]_
_${prefix}deposit/dep [all/jumlah]_
_${prefix}withdraw/wd [all/jumlah]_
_${prefix}short/st [jumlah]_
_${prefix}qq [jumlah]_
_${prefix}shop_
_${prefix}buy [item name]_
*========================*
*👑Owner Bot Command👑*
_${prefix}add [jumlah] (untuk tambah gems player/self)_
*========================*
*⌨Other Command⌨*
_${prefix}uptime_
*========================*`;
            client.sendMessage(
              from, listhelpgt, text,
              {
                quoted: sen,
              }
            );
           }
          }
          break;

        case "menu":
        case "help":
          listhelp = `*┌❏🔱JzBot Casino🔱*
*│─Prefix: ${prefix}*
*│─Made By: JzuvGTI👑*
*└❏─❏─❏─❏─❏─❏─❏─❏*
*┌❏📲Command Member📲*
*│─${prefix}register*
*│─${prefix}profile*
*│─${prefix}daily*
*│─${prefix}kerja*
*│─${prefix}rankshop*
*│─${prefix}balance/bal*
*│─${prefix}leaderboard/lb*
*│─${prefix}pay [tag] [jumlah]*
*│─${prefix}use [name sword]*
*│─${prefix}deposit/dep [all/jumlah]*
*│─${prefix}withdraw/wd [all/jumlah]*
*│─${prefix}gamble/gb [jumlah]*
*│─${prefix}qq [jumlah]*
*│─${prefix}shop*
*│─${prefix}buy [item name]*
*└❏─❏─❏─❏─❏─❏─❏*
*┌❏👑Owner Bot Command👑*
*│─${prefix}add*
*│─${prefix}addmoney*
*└❏─❏─❏─❏*
*┌❏ ⌨Other Command⌨*
*│─${prefix}uptime*
*└❏─❏─❏─❏*`;
          client.sendMessage(from, listhelp, text, {
            quoted: sen,
          });
          break;
        case "register":
          if (isJoin)
            return client.sendMessage(from, "*Maaf kamu sebelum nya sudah register!*", text, {
              quoted: sen,
            });
          join.push(sender);
          fs.writeFileSync("./database/register.json", JSON.stringify(join));
          client.sendMessage(from, "*Akun mu sudah tersimpan di database!*", text, {
            quoted: sen,
          });
          break;
          case "uptime":
            if(!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted:sen,
              }
            );
            runtime = process.uptime()
            return client.sendMessage(
              from,
              `Bot Up Time: ${waktu(runtime)}`,
              text,
              {
                quoted: sen,
              }
            );
        case "daily":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
      
          let dailytimeout = 600000;
          let dailyamount = 2000;

          let daily = await db.fetch(`daily_${sender}`);

          if (daily !== null && dailytimeout - (Date.now() - daily) > 0) {
            let dailytime = ms(dailytimeout - (Date.now() - daily));

            client.sendMessage(
              from,
              `Tunggu Cooldown ${dailytime.hours} jam ${dailytime.minutes} menit, ${dailytime.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            client.sendMessage(
              from,
              `Kamu memggunakan harian dan mendapatkan ${dailyamount} uang!`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`uang_${sender}`, dailyamount);
            db.set(`daily_${sender}`, Date.now());
          }
          break;

        case "kerja":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let orang = await db.fetch(`kerja_${sender}`);
          let timeout = 5000;
          if (orang !== null && timeout - (Date.now() - orang) > 0) {
            let time = ms(timeout - (Date.now() - orang));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${time.minutes} menit, ${time.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let pekerjaan = [
              "Ngul🛠",
              "Foto Grafer📸",
              "Pilot✈",
              "FotoCopy🖨",
              "Peternak🐂",
              "Polisi�",
              "Dokter�",
            ]; //bisa di add lagi
            let result = Math.floor(Math.random() * pekerjaan.length);
            let gaji = Math.floor(Math.random() * 2000);
            let swordp = db.fetch(`sword_b_${sender}`);
            let zeusp = db.fetch(`zeus_b_${sender}`);
            let uang = db.fetch(`uang_${sender}`);
            if (swordp === 1) swordp = "✅";
            if (swordp === null) swordp = "❌";
            if (zeusp === 1) zeusp = "✅";
            if (zeusp === null) zeusp = "❌";
            client.sendMessage(
              from,
              `      *Pekerja JzBot*
*=================*
*Nama: ${username}*
*Sword: ${swordp}*
*Zeus: ${zeusp}*
*=================*
*Kerjaan: ${pekerjaan[result]}*
*Penghasilan: $${gaji}*
*Uang Saat ini: $${uang}*`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`uang_${sender}`, gaji);
            db.set(`kerja_${sender}`, Date.now());
          }
          break;

        case "bal":
        case "balance":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let selfbal = db.fetch(`uang_${sender}`);
          let selfbank = db.fetch(`bank_${sender}`);
          if (selfbal === null) selfbal = 0;
          if (selfbank === null) selfbank = 0;
          if (
            sen.message.extendedTextMessage === undefined ||
            sen.message.extendedTextMessage === null
          ) {
            client.sendMessage(
              from,
              `Nama: ${username}\nUang: *${selfbal.toLocaleString()}*\nBank: *${selfbank.toLocaleString()}*`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let mentioned1 =
              sen.message.extendedTextMessage.contextInfo.mentionedJid[0];
            if (!mentioned1)
              return client.sendMessage(
                from,
                `Nama: ${username}\nUang: *${selfbal.toLocaleString()}*\nBank: *${selfbank.toLocaleString()}*`,
                text,
                {
                  quoted: sen,
                }
              );
            let bankmen = groupMembers.find((x) => x.jid === mentioned1);
            let notselfbal = db.fetch(`uang_${bankmen.jid}`);
            let notselfbank = db.fetch(`bank_${bankmen.jid}`);
            if (notselfbal === null) notselfbal = 0;
            if (notselfbank === null) notselfbank = 0;
            client.sendMessage(
              from,
              `Nama: @${
                bankmen.id.split("@")[0]
              }\nUang: *${notselfbal.toLocaleString()}*\nBank: *${notselfbank.toLocaleString()}*`,
              extendedText,
              {
                quoted: sen,
                contextInfo: {
                  mentionedJid: [bankmen.jid],
                },
              }
            );
          }
          break;

        case "pay":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let payuang = db.fetch(`uang_${sender}`);
          let payamount = args[1];
          if (
            sen.message.extendedTextMessage === undefined ||
            sen.message.extendedTextMessage === null
          )
            return client.sendMessage(
              from,
              "Tag seseorang yang ingin kamu pay",
              text
            );
          let mentionedpay =
            sen.message.extendedTextMessage.contextInfo.mentionedJid[0];
          if (!payamount)
            return client.sendMessage(from, "Masukan jumlah uangnya!", text, {
              quoted: sen,
            });
          if (isNaN(payamount))
            return client.sendMessage(from, "Harus berupa angka!", text, {
              quoted: sen,
            });
          if (body.includes("-") || body.includes("+"))
            return client.sendMessage(from, "Terdapat simbol negatif!", text, {
              quoted: sen,
            });
          if (payuang == 0)
            return client.sendMessage(from, "Uang kamu tidak ada!", text, {
              quoted: sen,
            });
          if (payuang < payamount) {
            return client.sendMessage(from, "Uang kamu tidak cukup!", text, {
              quoted: sen,
            });
          }
          let paymen = groupMembers.find((x) => x.jid === mentionedpay);

          if (!join.includes(paymen.jid)) {
            client.sendMessage(
              from,
              "Username tidak ada dalam daftar register!",
              text,
              {
                quoted: sen,
              }
            );
          } else {
            client.sendMessage(
              from,
              `Kamu Berhasil Memberikan @${
                paymen.jid.split("@")[0]
              } ${payamount} Uang!`,
              extendedText,
              {
                quoted: sen,
                contextInfo: {
                  mentionedJid: [paymen.jid],
                },
              }
            );
          }
          db.add(`uang_${paymen.jid}`, payamount);
          db.subtract(`uang_${sender}`, payamount);
          break;
        case "rankshop":
          if (isJoin)
          return client.sendMessage(
            from, 
            ` *🤴JzBot Rank Shop👸*
===========================
Command: ${prefix}buyrank (rank name)
ex: ${prefix}buyrank ngabers
===========================
1. ngabers🏍

Benefits:
kamu bisa mendapatkan $10.000 - 25.000
dengan mengetik /ngab
Harga: $2.000.000

2. Comming Soon!`,
          text,
          {
            quoted: sen,
          }
          );
          break;
        case "deposit":
        case "dep":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          if (body.includes("-") || body.includes("+"))
            return client.sendMessage(from, "Terdapat simbol negatif!", text, {
              quoted: sen,
            });
          if (args[0] === "all") {
            let uangdepo = await db.fetch(`uang_${sender}`);
            if (uangdepo === 0)
              return client.sendMessage(from, "Kamu tidak ada uang!", text, {
                quoted: sen,
              });

            client.sendMessage(
              from,
              "Kamu berhasil mendeposit semua uang ke bank!",
              text,
              {
                quoted: sen,
              }
            );
            db.add(`bank_${sender}`, uangdepo);
            db.subtract(`uang_${sender}`, uangdepo);
          } else {
            if (!args[0])
              return client.sendMessage(from, "Masukan jumlahnya!", text, {
                quoted: sen,
              });
            if (isNaN(args[0]))
              return client.sendMessage(from, "Harus berupa angka!", text, {
                quoted: sen,
              });
            let uangdepo1 = db.fetch(`uang_${sender}`);
            if (uangdepo1 < args[0])
              return client.sendMessage(from, "Uang kamu tidak cukup!", text, {
                quoted: sen,
              });

            client.sendMessage(
              from,
              `Kamu berhasil mendeposit uang ke bank senilai ${args[0]}!`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`bank_${sender}`, args[0]);
            db.subtract(`uang_${sender}`, args[0]);
          }
          break;
        case "guhih9k0k0k0k0k0k0k00kk00k0k0k0k0k0k0kk00k0k0kk00":
          if (!isGroup) return client.sendMessage(from, "hanya dapat dilakukan di grup!", text, {
            quoted: sen,
          });
			if (!isGroupAdmins) return client.sendMessage(from, "Kamu bukan admin group!", text, {
        quoted: sen,
      });
			if (!isBotGroupAdmins) return client.sendMessage(from, "Jadikan bot admin untuk menggunakan command tersebut!", text, {
        quoted: sen,
      });
			
			kick = sen.message.extendedTextMessage.contextInfo.participant
		    client.groupRemove(from, [kick])
        break;



        case "wd":
        case "withdraw":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          if (body.includes("-") || body.includes("+"))
            return client.sendMessage(from, "Terdapat simbol negatif!", text, {
              quoted: sen,
            });
          if (args[0] === "all") {
            let uangwith = db.fetch(`bank_${sender}`);

            if (uangwith === 0)
              return client.sendMessage(
                from,
                "Kamu tidak ada uang di bank!",
                text,
                {
                  quoted: sen,
                }
              );

            client.sendMessage(
              from,
              "Kamu berhasil mengambil semua uang dari bank!",
              text,
              {
                quoted: sen,
              }
            );
            db.add(`uang_${sender}`, uangwith);
            db.subtract(`bank_${sender}`, uangwith);
          } else {
            if (!args[0])
              return client.sendMessage(from, "Masukan jumlahnya!", text, {
                quoted: sen,
              });
            if (isNaN(args[0]))
              return client.sendMessage(from, "Harus berupa angka!", text, {
                quoted: sen,
              });
            let uangwith1 = db.fetch(`bank_${sender}`);
            if (uangwith1 < args[0])
              return client.sendMessage(
                from,
                "Uang kamu di bank tidak cukup!",
                text,
                {
                  quoted: sen,
                }
              );

            client.sendMessage(
              from,
              `Kamu berhasil mengambil uang dari bank senilai ${args[0]}!`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`uang_${sender}`, args[0]);
            db.subtract(`bank_${sender}`, args[0]);
          }
          break;

        case "lb":
        case "leaderboard":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          var lbno = 1;
          let lbuser2 = [];
          let lblast = [];
          let lbmax = 10;
          let lbpe = 0;
          for (let i = 0; i < join.length; i++) {
            let lbuang = db.fetch(`uang_${join[i]}`);
            lbuser2.push({
              name: join[i],
              money: lbuang,
            });
          }
          lbuser2.sort((a, b) => b.money - a.money);
          for (let i = 0; i < lbuser2.length; i++) {
            lbpe++;
            if (lbpe >= lbmax) continue;
            if (lbuser2[i].money == null) lbuser2[i].money = 0;
            if (lbuser2[i].money < 100000) continue;

            lblast.push(
              `${lbno++}. @${lbuser2[i].name.split("@")[0]} - *${lbuser2[
                i
              ].money.toLocaleString()} Uang*`
            );
          }
          client.sendMessage(
            from,
            `*📊JzBot Top Player Rich📊*\n*===================*\n${lblast.join(
              "\n"
            )}\n*===================*\nJika uang player dibawah\n$100.000maka tidak di hitung!`,
            extendedText,
            {
              quoted: sen,
              contextInfo: {
                mentionedJid: join,
              },
            }
          );
          break;

        case "shortbetas":
        case "stbetas":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let gamorang = await db.fetch(`gamble_${sender}`);
          let gamtimeout = 10000;
          if (gamorang !== null && gamtimeout - (Date.now() - gamorang) > 0) {
            let gamtime = ms(gamtimeout - (Date.now() - gamorang));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${gamtime.minutes} menit, ${gamtime.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let gamuang = db.fetch(`uang_${sender}`);
            var gamnum = parseInt(args[0]);
            let gamrand = Math.floor(Math.random() * 50);
            if (!gamnum)
              return client.sendMessage(
                from,
                `Tolong masukan jumlah uangnya!`,
                text,
                {
                  quoted: sen,
                }
              );
            if (body.includes("-") || body.includes("+"))
              return client.sendMessage(
                from,
                "Terdapat simbol negatif!",
                text,
                {
                  quoted: sen,
                }
              );
            if (gamnum > 50000)
              return client.sendMessage(
                from,
                `Maksimal hanya 50000 uang!`,
                text,
                {
                  quoted: sen,
                }
              );
            if (gamuang < gamnum)
              return client.sendMessage(from, `Kamu tidak ada uang!`, text, {
                quoted: sen,
              });
            if (gamrand < gamrand) {
              client.sendMessage(
                from,
                `*┌YOU WINNER:O*
*│─You Get: ${gamrand}*
*│─Bot Get: ${gamrand + 1}*
*└─────────────*
*┌─────────────*
*│─Kamu mendapatkan uang sebesar $${gamnum * 2}*
*|─Uangmu Sekarang: $${gamuang + gamnum * 2}
*└─────────────*`,
                text,
                {
                  quoted: sen,
                }
              );
              db.add(`uang_${sender}`, gamnum * 2);
              db.set(`gamble_${sender}`, Date.now());
            } else {
              client.sendMessage(
                from,
                `*┌YOU LOSE:(*
*│─You Get: ${gamrand + 1}*
*│─Bot Get: ${gamrand}*
*└─────────────*
*┌─────────────*
*│─Kamu lose uang sebesar $${gamnum}*
*|─Uangmu Sekarang: $${gamuang - gamnum}*
*└─────────────*`,
                text,
                {
                  quoted: sen,
                }
              );
              db.subtract(`uang_${sender}`, gamnum);
              db.set(`gamble_${sender}`, Date.now());
            }
          }
          break;

        case "csn":
          case "casino":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let csnccd = await db.fetch(`csn_${sender}`);
          let csncd = 10000;
          if (csnccd !== null && csncd - (Date.now() - csnccd) > 0) {
            let csncccd = ms(csncd - (Date.now() - csnccd));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${csncccd.minutes} menit, ${csncccd.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let csntext = "";
            let csnuang = db.fetch(`uang_${sender}`);
            var csnnum = parseInt(args[0]);
            let csnrand = Math.floor(Math.random() * 37);
            let csnbot = Math.floor(Math.random() * 37);
            let csnrand2 = csnrand % 15;
            let csnbot2 = csnbot % 15;
            if (!csnnum)
              return client.sendMessage(
                from,
                `Tolong masukan jumlah uangnya!`,
                text,
                {
                  quoted: sen,
                }
              );
            if (body.includes("-") || body.includes("+"))
              return client.sendMessage(
                from,
                "Terdapat simbol negatif!",
                text,
                {
                  quoted: sen,
                }
              );
            if (csnuang < csnnum)
              return client.sendMessage(from, `Kamu tidak ada uang!`, text, {
                quoted: sen,
              });

            if (csnrand2 === 0) {
              csntext = `Jackpot!, Kamu menang dan mendapatkan *${(
                csnnum * 2
              ).toLocaleString()}* uang!`;
              db.add(`uang_${sender}`, csnnum * 2);
            } else if (csnbot2 === 0) {
              csntext = `Bot Jackpot!, Kamu kalah dan kehilangan *${csnnum.toLocaleString()}* uang...`;
              db.subtract(`uang_${sender}`, csnnum);
            } else if (csnrand2 === csnbot2) {
              csntext = "Hasil seri, tidak ada yang menang...";
            } else if (csnrand2 > csnbot2) {
              csntext = `Kamu menang dan mendapatkan *${(
                csnnum * 2
              ).toLocaleString()}* uang!`;
              db.add(`uang_${sender}`, csnnum * 2);
            } else if (csnrand2 < csnbot2) {
              csntext = `Kamu kalah dan kehilangan *${csnnum.toLocaleString()}* uang...`;
              db.subtract(`uang_${sender}`, csnnum);
            }
            client.sendMessage(
              from,
              `Bot spin the wheel and get *${csnbot}* 
You spin the wheel and get *${csnrand}* 

${csntext}`,
              text,
              {
                quoted: sen,
              }
            );
            db.set(`csn_${sender}`, Date.now());
          }
          break;
          case "qq":
            case "quiqui":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let qqccd = await db.fetch(`qq_${sender}`);
          let qqcd = 10000;
          if (qqccd !== null && qqcd - (Date.now() - qqccd) > 0) {
            let qqcccd = ms(qqcd - (Date.now() - qqccd));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${qqcccd.minutes} menit, ${qqcccd.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let qqtext = "";
            let qquang = db.fetch(`uang_${sender}`);
            var qqnum = parseInt(args[0]);
            let qqrand = Math.floor(Math.random() * 12);
            let qqbot = Math.floor(Math.random() * 12);
            let qqrand2 = qqrand % 10;
            let qqbot2 = qqbot % 10;
            if (!qqnum)
              return client.sendMessage(
                from,
                `Tolong masukan jumlah uangnya!`,
                text,
                {
                  quoted: sen,
                }
              );
            if (body.includes("-") || body.includes("+"))
              return client.sendMessage(
                from,
                "Terdapat simbol negatif!",
                text,
                {
                  quoted: sen,
                }
              );
            if (qquang < qqnum)
              return client.sendMessage(from, `Kamu tidak ada uang!`, text, {
                quoted: sen,
              });

            if (qqrand2 === 0) {
              qqtext = `Jackpot!, Kamu menang dan mendapatkan *${(
                qqnum * 2
              ).toLocaleString()}* uang!`;
              db.add(`uang_${sender}`, qqnum * 2);
            } else if (qqbot2 === 0) {
              qqtext = `Bot Jackpot!, Kamu kalah dan kehilangan *${qqnum.toLocaleString()}* uang...`;
              db.subtract(`uang_${sender}`, qqnum);
            } else if (qqrand2 === qqbot2) {
              qqtext = "Hasil seri, tidak ada yang menang...";
            } else if (qqrand2 > qqbot2) {
              qqtext = `Kamu menang dan mendapatkan *${(
                qqnum * 2
              ).toLocaleString()}* uang!`;
              db.add(`uang_${sender}`, qqnum * 2);
            } else if (qqrand2 < qqbot2) {
              qqtext = `Kamu kalah dan kehilangan *${qqnum.toLocaleString()}* uang...`;
              db.subtract(`uang_${sender}`, qqnum);
            }
            client.sendMessage(
              from,
              `Bot spin the wheel and get *${qqbot}* 
You spin the wheel and get *${qqrand}* 

${qqtext}`,
              text,
              {
                quoted: sen,
              }
            );
            db.set(`qq_${sender}`, Date.now());
          }
          break;
        case "add":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          if (!isOwner)
            return client.sendMessage(from, "Kamu bukan owner bot!", text, {
              quoted: sen,
            });
          let amountadd = args[0];
          if (!amountadd)
            return client.sendMessage(from, `Masukan jumlah uangnya!`, text, {
              quoted: sen,
            });
          client.sendMessage(
            from,
            `Berhasil menambahkan ${amountadd} uang!`,
            text,
            {
              quoted: sen,
            }
          );
          db.add(`uang_${sender}`, amountadd);
          break;

        case "addmoney":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          if (!isOwner)
            return client.sendMessage(from, "Kamu bukan owner bot!", text, {
              quoted: sen,
            });
          let addmarg = args[1];
          if (
            sen.message.extendedTextMessage === undefined ||
            sen.message.extendedTextMessage === null
          )
            return client.sendMessage(
              from,
              "Tag seseorang yang ingin kamu berikan uang!",
              text
            );
          if (!addmarg)
            return client.sendMessage(
              from,
              "Tolong masukan jumlah uangnya!",
              text,
              {
                quoted: sen,
              }
            );
          if (isNaN(addmarg))
            return client.sendMessage(from, "Harus berupa angka!", text, {
              quoted: sen,
            });
          if (body.includes("-") || body.includes("+"))
            return client.sendMessage(from, "Terdapat simbol negatif!", text, {
              quoted: sen,
            });
          if (!addmarg)
            return client.sendMessage(from, "Masukan jumlah uang nya!", text, {
              quoted: sen,
            });
          let mentioned2 =
            sen.message.extendedTextMessage.contextInfo.mentionedJid[0];

          let adm = groupMembers.find((y) => y.jid === mentioned2);
          if (!join.includes(adm.jid)) {
            client.sendMessage(
              from,
              "Username tidak ada dalam daftar register!",
              text,
              {
                quoted: sen,
              }
            );
          } else {
            client.sendMessage(
              from,
              `Berhasil Memberikan @${adm.jid.split("@")[0]} ${addmarg} Uang`,
              extendedText,
              {
                quoted: sen,
                contextInfo: {
                  mentionedJid: [adm.jid],
                },
              }
            );
            db.add(`uang_${adm.jid}`, addmarg);
          }
          break;
          
        case "shop":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          client.sendMessage(
            from,
            `🔱 *Welcome To JzBot Shop* 🔱
*Command:*
_${prefix}buy <item>_

*List Item What You Can Buy:*

_1. sword_

*Sword Benefit:*
*Cooldown: 1 menit*
*Desc: You can get more money than $3.000*
*Price: $500.000*

_2. zeus_

*Zeus Benefit:*
*Cooldown: 1 menit*
*Desc: Kamu Bisa Mendapatkan Lebih Hari $7.000*
*Harga: $1.000.000*
`,
            text,
            {
              quoted: sen,
            }
          );
          break;

        case "buy":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          if (!args[0])
            return client.sendMessage(from, "Masukan nama item nya!", text, {
              quoted: sen,
            });

          if (args[0] === "sword") {
            let sword = db.fetch(`sword_b_${sender}`);
            let suang = db.fetch(`uang_${sender}`);
            if (suang < 500000)
              return client.sendMessage(from, "Uang kamu tidak cukup!", text, {
                quoted: sen,
              });
            if (sword)
              return client.sendMessage(
                from,
                "Kamu sudah membeli item sword!",
                text,
                {
                  quoted: sen,
                }
              );
            client.sendMessage(
              from,
              `Kamu membeli sword seharga 500.000 uang!\ncara pakai: ${prefix}use sword`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`sword_b_${sender}`, 1);
            db.subtract(`uang_${sender}`, 500000);
          }
          if (args[0] === "zeus") {
            let zeus = db.fetch(`zeus_b_${sender}`);
            let suang2 = db.fetch(`uang_${sender}`);
            if (suang2 < 1000000)
              return client.sendMessage(from, "Uang kamu tidak cukup!", text, {
                quoted: sen,
              });
            if (zeus)
              return client.sendMessage(
                from,
                "Kamu sudah membeli item zeus!",
                text,
                {
                  quoted: sen,
                }
              );
            client.sendMessage(
              from,
              `Kamu membeli sword seharga 1.00.000 uang!\ncara pakai: ${prefix}use zeus`,
              text,
              {
                quoted: sen,
              }
            );
            db.add(`zeus_b_${sender}`, 1);
            db.subtract(`uang_${sender}`, 1000000);
          }
          break;

        case "use":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let sresult = Math.floor(Math.random() * 5000) + 3000;
          let sresult2 = Math.floor(Math.random() * 7000) + 8000;
          let suse = await db.fetch(`use_${sender}`);
          let stimeout = 60000;
          if (suse !== null && stimeout - (Date.now() - suse) > 0) {
            let stime = ms(stimeout - (Date.now() - suse));
            client.sendMessage(
              from,
              `Tunggu Cooldown ${stime.minutes} menit, ${stime.seconds} detik`,
              text,
              {
                quoted: sen,
              }
            );
          } else {
            let usword = db.fetch(`sword_b_${sender}`);
            if (args[0] === "sword") {
              if (usword === null) {
                return client.sendMessage(from, "Kamu tidak ada sword!", text, {
                  quoted: sen, 
                });
              } 
              
            if (usword === 1) {
              client.sendMessage(
                from,
                `Kamu menggunakan sword dan mendapatkan ${sresult} uang!`,
                text,
                {
                  quoted: sen,
                }
              );
              db.add(`uang_${sender}`, sresult);
              db.subtract(`sword_b_${sender}`, 0);
              db.set(`use_${sender}`, Date.now());
              }
          }
          let zeus = db.fetch(`zeus_b_${sender}`);
            if (args[0] === "zeus") {
              if (zeus === null)  {
                return client.sendMessage(from, "Kamu tidak ada zeus!", text, {
                  quoted: sen,
                });
               
              }
              if (zeus === 1) {
              client.sendMessage(
                from,
                `Kamu menggunakan zeus dan mendapatkan ${sresult2} uang!`,
                text,
                {
                  quoted: sen,
                }
              );
              db.add(`uang_${sender}`, sresult2);
              db.subtract(`zeus_b_${sender}`, 0);
              db.set(`use_${sender}`, Date.now());
            }
          
          }
        }
          break;

        case "profile":
          if (!isJoin)
            return client.sendMessage(
              from,
              `Kamu belum register! ketik ${prefix}register`,
              text,
              {
                quoted: sen,
              }
            );
          let swordp = db.fetch(`sword_b_${sender}`);
          let zeusp = db.fetch(`zeus_b_${sender}`);
          let uang = db.fetch(`uang_${sender}`);
          if (swordp === 1) swordp = "✅";
          if (swordp === null) swordp = "-";
          if (zeusp === 1) zeusp = "✅";
          if (zeusp === null) zeusp = "-";
          client.sendMessage(
            from,
            `*🤴Profile Player ${username}👸*
*===============*
*Nama: ${username}*
*Sword: ${swordp}*
*Zeus: ${zeusp}*
*Uang: $${uang}*
*===============*`,
            text,
            {
              quoted: sen,
            }
          );
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });
}
start();
