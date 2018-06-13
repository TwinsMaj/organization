const uuidv4 = require('uuid/v4');

function fetchDuplicateChild(collection, value) {
    var found = collection.filter(function(obj) {
        return obj.name.toLowerCase() === value.toLowerCase()
    })
    return found[0];
}

exports.serialize = function(payload) {

    return (function traverse(res, payload, parent) {

        var row = {}, uuid = '';

        uuid = uuidv4()
        row.id = uuid
        row.name = payload["org_name"]

        var child = fetchDuplicateChild(res.nodes, row.name)

        if(child !== undefined) {
            res.edges.push({org_id: child.id, parent: parent})
        } else {
            res.nodes.push(row);
            res.edges.push({org_id: row.id, parent: parent})
        }

        if(payload.hasOwnProperty('daughters')){
            payload["daughters"].forEach(function(daughter) {
                traverse(res, daughter, uuid)
            })
        }

        return res

    })(res = {nodes: [], edges: []}, payload, parent = 'null')
}


exports.calculateStart = function(page, display) {
    let start = 0;

    if(page !== undefined) {
        start = (page - 1) * display
    }

    return start
}