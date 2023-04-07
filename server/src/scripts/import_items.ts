var fs = require('fs');
var path = require('path');
const { Client } = require('pg')

var argv = require('minimist')(process.argv.slice(2));

if (!argv.dir) {
    console.error("must set --dir <directory to foundry datapack to import>");
    process.exit(1);
}

const client = new Client()
client.connect().then(() => console.log('connected'))
  .catch((err) => {
      console.error('connection error', err.stack); process.exit(1)})

const output = fs.readdirSync(argv.dir)

var count = 0

output.forEach((dirNext) => {
    count+=1

    let data = JSON.parse(fs.readFileSync(path.join(argv.dir, dirNext)))

    var level = data?.system?.level?.value || 0
    var gp = data?.system?.price?.value?.gp || 0 
    var sp = data?.system?.price?.value?.sp || 0 
    var cp = data?.system?.price?.value?.cp || 0 

    var cost = gp + (sp / 10) + (cp / 100)

    client.query("INSERT into items(id, name, level, cost) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE set name = $2, level = $3, cost = $4;", [
        data._id, data.name, level, cost
    ]).catch((e) => {console.error(e)})
})

console.log(`Added ${count} items`)

client
  .end()
  .then(() => console.log('client has disconnected'))
  .catch((err) => console.error('error during disconnection', err.stack))
