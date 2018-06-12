var db = require("../db.js"),
orgModel = db.organizationModel;
parentModel = db.parentModel;


db.conn.sync({force:false}).then(function() {

    /*var input={"org_name":"paradise island","daughters":[{"org_name":"banana tree","daughters":[{"org_name":"Yellow Banana"},{"org_name":"Brown Banana"}]},{"org_name":"big banana tree","daughters":[{"org_name":"green banana"},{"org_name":"yellow banana"},{"org_name":"Black banana","daughters":[{"org_name":"red spider"}]}]}]}
    var d = serialize(input)

    orgModel.bulkCreate(d.nodes).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
      //return orgModel.findAll();
    }).then(users => {
      console.log(users) // ... in order to get the array of user objects
    })

    parentModel.bulkCreate(d.edges).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
      //return parentModel.findAll();
    }).then(users => {
      console.log(users) // ... in order to get the array of user objects
    })*/

    orgModel.findAll({
      where: db.conn.where(db.conn.fn('lower', db.conn.col('name')), db.conn.fn('lower', 'banana tree')),
      raw: true
    }).then(item => {
        db.conn.query(`SELECT o.name, 'sisters' AS relationship_type 
                       FROM parents p 
                       LEFT JOIN organizations o ON p.org_id = o.id 
                       WHERE p.parent in 
                       (SELECT parent FROM parents WHERE org_id = '${item[0].id}') AND p.org_id <> '${item[0].id}'
                       UNION 
                       SELECT o.name, 'parent' AS relationship_type 
                       FROM parents p 
                       JOIN parents c ON p.org_id = c.parent
                       LEFT JOIN organizations o ON p.org_id = o.id 
                       WHERE c.org_id='${item[0].id}' 
                       UNION 
                       SELECT o.name, 'daughters' AS relationship_type 
                       FROM organizations o 
                       JOIN parents p ON o.id = p.org_id
                       WHERE p.parent = '${item[0].id}' 
                       GROUP BY o.name
                       ORDER BY o.name ASC;`, { type: db.conn.QueryTypes.SELECT, limit: 1, offset: 0})
          .then(graph => {
            console.log(graph)
            // We don't need spread here, since only the results will be returned for select queries
          })
    });

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

function fetchDuplicateChild(collection, value) {
    var found = collection.filter(function(obj) {
        return obj.name.toLowerCase() === value.toLowerCase()
    })
    return found[0];
}