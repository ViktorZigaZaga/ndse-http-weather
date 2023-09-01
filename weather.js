const http = require('http');
const readline = require("readline");
const config = require('./config')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const myAPIKey = config.myAPIKey;
let url = '';
rl.question("Введите город: ", (city) => {
    url = `http://api.weatherstack.com/current?access_key=${myAPIKey}&query=${city}`;

    http
        .get(url,
            (res) => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    console.log('statusCode: ' + statusCode);
                    return;
                }
                res.setEncoding('utf-8');
                let rowData = '';
                res.on('data', (chunk) => rowData += chunk);
                res.on('end', () => {
                    let apiResponse = JSON.parse(rowData);
                    console.log(apiResponse);
                    if (apiResponse.error) {
                        console.log(apiResponse.error.info);
                    } else {
                        console.log(
                        `Сегодня погода в городе ${apiResponse.location.name}:\n
                        -температура: ${apiResponse.current.temperature}℃\n
                        -ощущается как: ${apiResponse.current.feelslike}℃\n
                        -вероятность дождя: ${apiResponse.current.precip}%\n`
                        );
                    }
                    rl.close();
                });
            }
        )
        .on('error', (error) => {
            console.error(error);
        });
});

