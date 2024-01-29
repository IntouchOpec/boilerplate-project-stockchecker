const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
// Viewing one stock: GET request to /api/stock-prices/
// Viewing one stock and liking it: GET request to /api/stock-prices/
// Viewing the same stock and liking it again: GET request to /api/stock-prices/
// Viewing two stocks: GET request to /api/stock-prices/
// Viewing two stocks and liking them: GET request to /api/stock-prices/
suite('Functional Tests', function() {
  suite('GET /api/stock-prices => stockData object', function() {
      
    test('1 stock', function(done) {
     chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG'})
      .end(function(err, res){
        
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData')
        assert.property(res.body.stockData, 'stock')
        assert.property(res.body.stockData, 'price')
        assert.property(res.body.stockData, 'likes')
        assert.equal(res.body.stockData.stock, 'GOOG')
        assert.isNumber(res.body.stockData.price)
        assert.isNumber(res.body.stockData.likes)
        
        done()
      })
    })
    
    test('1 stock with like', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: true })
        .end(function(err, res){

          assert.equal(res.status, 200)
          assert.property(res.body, 'stockData')
          assert.property(res.body.stockData, 'stock')
          assert.property(res.body.stockData, 'price')
          assert.property(res.body.stockData, 'likes')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.isNumber(res.body.stockData.price)
          assert.isNumber(res.body.stockData.likes)

          done()
        })
    })
    
    test('1 stock with like again (ensure likes arent double counted)', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: true })
        .end(function(err, res){

          assert.equal(res.status, 200)
          assert.property(res.body, 'stockData')
          assert.property(res.body.stockData, 'stock')
          assert.property(res.body.stockData, 'price')
          assert.property(res.body.stockData, 'likes')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.isNumber(res.body.stockData.price)
          assert.isNumber(res.body.stockData.likes)

          done()
        })
    })
    
    test('2 stocks', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'] })
        .end(function(err, res){

          assert.equal(res.status, 200)
          assert.property(res.body, 'stockData')
          assert.isArray(res.body.stockData)
          assert.property(res.body.stockData[0], 'stock')
          assert.property(res.body.stockData[0], 'price')
          assert.property(res.body.stockData[0], 'rel_likes')
          assert.equal(res.body.stockData[0].stock, 'GOOG')
          assert.isNumber(res.body.stockData[0].price)
          assert.isNumber(res.body.stockData[0].rel_likes)
          
          assert.property(res.body.stockData[1], 'stock')
          assert.property(res.body.stockData[1], 'price')
          assert.property(res.body.stockData[1], 'rel_likes')
          assert.equal(res.body.stockData[1].stock, 'MSFT')
          assert.isNumber(res.body.stockData[1].price)
          assert.isNumber(res.body.stockData[1].rel_likes)

          done()
        })
    })
    
    test('2 stocks with like', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'], like: true })
        .end(function(err, res){

          assert.equal(res.status, 200)
          assert.property(res.body, 'stockData')
          assert.isArray(res.body.stockData)
          assert.property(res.body.stockData[0], 'stock')
          assert.property(res.body.stockData[0], 'price')
          assert.property(res.body.stockData[0], 'rel_likes')
          assert.equal(res.body.stockData[0].stock, 'GOOG')
          assert.isNumber(res.body.stockData[0].price)
          assert.isNumber(res.body.stockData[0].rel_likes)
          
          assert.property(res.body.stockData[1], 'stock')
          assert.property(res.body.stockData[1], 'price')
          assert.property(res.body.stockData[1], 'rel_likes')
          assert.equal(res.body.stockData[1].stock, 'MSFT')
          assert.isNumber(res.body.stockData[1].price)
          assert.isNumber(res.body.stockData[1].rel_likes)

          done()
        })
    })
    
  });
});
