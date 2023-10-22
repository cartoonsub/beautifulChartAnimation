document.addEventListener("DOMContentLoaded", () => {

    let charts = {};

    let data = document.querySelector('.chart-container').dataset.results;
    data = JSON.parse(data);
    data = JSON.parse(data);
    
    let resultsDiv = document.querySelector('.results');

    Object.entries(data).forEach((entry) => {
        
        let dates = [];
        let numbers = [];

        const [key, values] = entry;
        const div = document.createElement('div');
        let html = `<h2>${key}</h2>`;

        chart = null;// todo
        Object.values(values).forEach((item) => {
            let date = item['date'];
            let value = item['value'];
            html += `<p>${date}: ${value}</p>`;
            dates.push(date);
            numbers.push(value);
        });
        charts[key] = {
            dates: dates,
            values: numbers
        };

        div.innerHTML = html;
        resultsDiv.appendChild(div);
    });

    console.log(charts);
    const ctx = document.getElementById('myChart');

    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / charts['1Y'].values.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
          type: 'number',
          easing: 'linear',
          duration: delayBetweenPoints,
          from: NaN, // the point is initially skipped
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          }
        },
        y: {
          type: 'number',
          easing: 'linear',
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          }
        }
    };
    new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: charts['1Y'].dates,
            datasets: [{
                label: '# 1Y fucking stuf',
                // data: [12, 29, 3, 5, 2, 3],
                data: charts['1Y'].values,
                borderWidth: 1,
                fill: false,
                // borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: '# 3Y fucking stuf',
                data: charts['3Y'].values,
                borderWidth: 1,
                fill: false,
                // borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: '# 5Y fucking stuf',
                data: charts['5Y'].values,
                borderWidth: 1,
                fill: false,
                // borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: '# 10Y fucking stuf',
                data: charts['10Y'].values,
                borderWidth: 1,
                fill: false,
                // borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: '# 30Y fucking stuf',
                data: charts['30Y'].values,
                borderWidth: 1,
                fill: false,
                // borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            ]
        },
        options: {
            animation,
            scales: {
                y: {
                beginAtZero: false
                }
            }
        }
    });







    var video = document.querySelector("video");
    var videoStream = ctx.captureStream(30);
    var mediaRecorder = new MediaRecorder(videoStream);

    var chunks = [];
    mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
    };

    mediaRecorder.onstop = function(e) {
    var blob = new Blob(chunks, { 'type' : 'video/mp4' });
    chunks = [];
    var videoURL = URL.createObjectURL(blob);
    video.src = videoURL;
    };
    mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
    };

    mediaRecorder.start();
    setTimeout(function (){ mediaRecorder.stop(); }, 16000);
});
