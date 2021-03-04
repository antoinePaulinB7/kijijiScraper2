const fs = require('fs');

const scrapeIt = require('scrape-it');

const url = (pageNumber) => `https://www.kijiji.ca/b-appartement-condo/ville-de-montreal/4+1+2__4+1+2+et+coin+detente__5+1+2/page-${pageNumber}/c37l1700281a27949001?radius=2.0&price=__1220&address=Montreal%2C+QC+H2G&ll=45.541015,-73.593276&meuble=0`;

let page = 1;

let results = {
  table: []
};

const lookup = () => {
  return scrapeIt(url(page)).then(callback);
};

const callback = ({data, $, body, response}) => {
  $('.search-item').each((index, element) => {
    let $element = $(element);

    let title = $element.find('a.title').text().trim();
    let link = 'https://www.kijiji.ca' + $element.find('a.title').prop('href');
    let price = $element.find('.price').text().trim();
    let postDate = $element.find('.date-posted').text().trim();
    let description = $element.find('.description').text().trim();
    let intersection = $element.find('.intersection').text().trim();
    let bedrooms = $element.find('.bedrooms').text().trim();

    let result = {
      title: title,
      link: link,
      price: price,
      postDate: postDate,
      description: description,
      intersection: intersection,
      bedrooms: bedrooms
    }

    results.table.push(result);
  });

  if ($('.pagination a[title="Suivante"]').length) {
    page += 1;

    return lookup(page);
  }
};

lookup().then(() => {
  console.log(results);

  fs.writeFile('results.json', JSON.stringify(results, null, 2), () => console.log('done'));
});
