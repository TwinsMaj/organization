const uuidv4 = require('uuid/v4');

function fetchDuplicateChild(collection, value) {
    var found = collection.filter(function(obj) {
        return obj.name.toLowerCase() === value.toLowerCase()
    })
    return found[0];
}

exports.serialize = function(payload) {

    return (function traverse(res, payload, parent) {

        var row = {}, parentID = '';

        row.id = uuidv4()
        row.name = payload["org_name"]

        var child = fetchDuplicateChild(res.nodes, row.name)

        if(child !== undefined) {
            res.edges.push({org_id: child.id, parent: parent})
            parentID = child.id
        } else {
            res.nodes.push(row);
            res.edges.push({org_id: row.id, parent: parent})
            parentID = row.id
        }

        if(payload.hasOwnProperty('daughters')){
            payload["daughters"].forEach(function(daughter) {
                //id = (child !== undefined) ? child.id : row.id
                traverse(res, daughter, parentID)
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