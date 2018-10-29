
//FloMat = require('flo-mat');
//FloMat = require('../../node/index.js');
let { findMats } = require('../../node/index.js');

const http = require('http')
const port = 3000

let bezierLoops = [
    [
        [[50.000, 95.000],[92.797, 63.905]], 
        [[92.797, 63.905],[76.450, 13.594]],
        [[76.450, 13.594],[23.549, 13.594]],
        [[23.549, 13.594],[7.202,  63.90]],
        [[7.202,  63.900],[50.000, 95.000]]
    ]
];

const requestHandler = (request, response) => {
     //console.log(FloMat);
    //let result = FloMat.findMats(bezierLoops);
    let result = findMats(bezierLoops);
    //console.log(result);

  response.end(result.toString());
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})