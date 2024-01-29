'use strict';
const http = require('http');
var request = require('request');

const mongoose = require('mongoose')
const { Stock } = require('../db')

const objectId = mongoose.Types.ObjectId
// const request = require('request-promise-native')

const getStockPriceFreecodecamp = (stock) => {
  const options = {
    url: 'http://stock-price-checker-proxy.freecodecamp.rocks',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  options.url = options.url + `/v1/stock/${stock}/quote`
  return new Promise((res, rej) => {
    request(options, (error, response) => {
      if (error) rej(error);
      res(JSON.parse(response.body));
    });    
  })
}

function parseData(data) {
  let i = 0
  let stockData = []
  let likes = []
  for (let index = 0; index < data.length; index++) {
    let stock = { stock: data[index].code, price: data[index].price  }
    likes.push(data[index].likes.length)
    stockData.push(stock)
  }
  if (likes.length > 1) {
    stockData[0].rel_likes = likes[0] - likes[1]
    stockData[1].rel_likes = likes[1] - likes[0]
  } else {
    stockData = stockData[0]
    stockData.likes = likes[0]
  }
  return {stockData}
}

const getOrCreateStockLike = async (stockCode, ip, like) => {
  const { symbol, latestPrice } = await getStockPriceFreecodecamp(stockCode);
  let stock = await Stock.findOne({code: stockCode}).exec();
  if (!stock) {
    stock = await Stock.create({ code: stockCode, likes: like ? [ip]: [] })
   } else {
    if (stock.likes.indexOf(ip) === -1) {
      stock.likes.push(ip)
    }
    await stock.save()
    stock = stock._doc
  }
  return { symbol, price: latestPrice, ...stock }
}

const getStockLike = async (req, res) => {
  if (req.query.stock === undefined || req.query.stock === '') {
    return res.json({ error: 'stock is required' });
  }
  if (!Array.isArray(req.query.stock)) {
    return res.json(parseData([await getOrCreateStockLike(req.query.stock, req.ip, req.query.like)]));
  } else {
    const result = await Promise.all(req.query.stock.map(async stock => {
      return await getOrCreateStockLike(stock, req.ip, req.query.like);
    }))
    return res.json(parseData(result));
  }
}

module.exports = function (app) {
  app.get('/api/testing', (req, res) => {
    res.json({ IP: req.ip })
  })
  app.route('/api/stock-prices')
    .get(getStockLike);
};
