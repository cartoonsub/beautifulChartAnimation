document.addEventListener("DOMContentLoaded", () => {
    
  let data = document.querySelector('.chart-container').dataset.results;
  data = JSON.parse(data);
  data = JSON.parse(data);
  console.log(data);
  let resultsDiv = document.querySelector('.results');

  Object.entries(data).forEach((entry) => {
    const [key, values] = entry;
    const div = document.createElement('div');
    let html = `<h2>${key}</h2>`;

    Object.values(values).forEach((item) => {
      let date = item['date'];
      let value = item['value'];
      console.log(date + ' ' + value);
      html += `<p>${date}: ${value}</p>`;
    });

    div.innerHTML = html;
    resultsDiv.appendChild(div);
  });
});
