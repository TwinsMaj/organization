var db = require("../db.js"),
orgModel = db.organizationModel;


db.conn.sync({}).then(function() {

    var input={"org_name":"paradise island","daughters":[{"org_name":"banana tree","daughters":[{"org_name":"Yellow Banana"},{"org_name":"Brown Banana"}]},{"org_name":"big banana tree","daughters":[{"org_name":"green banana"},{"org_name":"yellow banana"},{"org_name":"Black banana","daughters":[{"org_name":"red spider"}]}]}]}
    var d = serialize(input)

    orgModel.bulkCreate(d.nodes).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
      return orgModel.findAll();
    }).then(users => {
      console.log(users) // ... in order to get the array of user objects
    })

}).catch(e => {
    console.log(e)
})

const uuidv4 = require('uuid/v4');

function serialize(payload) {

    return (function traverse(res, payload, parent) {

        var row = {}, uuid = '';

        uuid = uuidv4()
        row.id = uuid
        row.name = payload["org_name"]

        var child = fetchDuplicateChild(res.nodes, row.name)

        if(child !== undefined) {
            res.edges.push({id: child.id, parent: parent})
        } else {
            res.nodes.push(row);
            res.edges.push({id: row.id, parent: parent})
        }

        if(payload.hasOwnProperty('daughters')){
            payload["daughters"].forEach(function(daughter) {
                traverse(res, daughter, uuid)
            })
        }

        return res

    })(res = {nodes: [], edges: []}, payload, parent = 'null')
}

function fetchDuplicateChild(collection, value) {
    var found = collection.filter(function(obj) {
        return obj.name.toLowerCase() === value.toLowerCase()
    })
    return found[0];
}