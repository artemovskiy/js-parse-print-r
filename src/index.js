const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader('./tg-web-hook.2021-02-17.tail.head.prepend.trimm.txt');
const {parse} = require('./print-r-parse')

lr.on('error', function (err) {
    console.error(err);
    process.exit(1);
});

let message = null;

lr.on('line', function (line) {
    const match = line.match(/(^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}):\sArray/);
    if(match && line.match(/^2021-02-17/)) {
        if(message) {
            try {
                console.log(JSON.stringify({
                    date: message.date,
                    content: parse(message.text)
                }));
            } catch (e) {
                console.error('canNot parse')
                console.error(e)
                console.error(message.text)
                console.log(JSON.stringify({
                    date: message.date,
                    content: message.text,
                }));
            }
        }
        const dateTimeString = match[1];
        message = {
            date: dateTimeString,
            text: 'Array\n',
        }
    } else if (message) {
        message.text = message.text + line + '\n';
    }
});

lr.on('end', function () {
    console.log('end')
    process.exit(0);
});
