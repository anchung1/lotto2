var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');

var MongoClient = require('mongodb').MongoClient;
var mongoDB = undefined;
MongoClient.connect('mongodb://localhost:27017/lotto', function(err, db) {
    mongoDB = db;
});

var cookieResp = {
    signed: true,
    secure: true,
    httpOnly: true
};

/* GET users listing. */
router.get('/greet', function (req, res, next) {
    console.log('greet');
    res.send('greetings Lotto');
});

router.get('/setCookie', function(req, res, next) {
    console.log(req.cookies);
    res.cookie('_id', 'lottoUser', cookieResp);
    res.json({result: 'success'});

});

router.get('/getCookie', function(req, res, next) {
    var id = req.signedCookies._id;
    console.log(id);
    res.json({id: id});
});

router.post('/saveTickets', function(req, res, next) {

    //var data = req.body.toJSON();
    //console.log(data);

    var data = JSON.parse(req.body.data);
    console.log(data);
    mongoDB.collection('lotto').updateOne( {_id: req.signedCookies._id}, {data: data}, {upsert: true},
        function(err, result) {
            console.log(result);
        }
    );
    /*mongoDB.collection('test').insert({data: req.body}, function(error, result) {
        console.log(result);
    });*/
    var id = req.signedCookies._id;
    res.json({id: id});
});

router.get('/saveTickets', function(req, res, next) {

    mongoDB.collection('lotto').find({_id: req.signedCookies._id}).limit(1).next( function(err, result) {
        console.log(result);
        res.json({data: result});
    });
});



module.exports = router;
