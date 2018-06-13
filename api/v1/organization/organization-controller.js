let db                  = require("../db.js"),
    organizationModel   = db.organizationModel,
    parentModel         = db.parentModel,
    _utils              = require("../utils.js");


exports.addOrganizations = function(req, res, next) {

    db.conn.sync({force:false}).then(function() {

        let payload             = req.body,
            serializedPayload   = _utils.serialize(payload),
            nodes               = serializedPayload.nodes,
            edges               = serializedPayload.edges;

        parentModel.bulkCreate(edges).then(function() {
            // nothing to do here...
        }).catch(function(e){
            req.errstatus = 500;
            next(err)
        })

        organizationModel.bulkCreate(nodes).then(function() {

            return organizationModel.findAll();

        }).then(function(nodes) {
            res.status(200).json(nodes);

        }).catch(function(err) {
            req.errstatus = 500;
            next(err)
        })

    }).catch(function(err) {
        req.errstatus = 500;
        next(err)
    })
}


exports.getOrganizationRelations = function(req, res, next) {

    let orgName = req.params.orgname,
        page    = req.query.page,
        display = 2,
        start;

    start = _utils.calculateStart(page, display);

    db.conn.sync({force:false}).then(function() {

        organizationModel.findAll({
          where: db.conn.where(db.conn.fn('lower', db.conn.col('name')), db.conn.fn('lower', orgName)),
          raw: true
        }).then(function(item ) {

            let organizationID = item[0].id;

            db.conn.query(
                `SELECT o.name, 'sisters' AS relationship_type 
                 FROM parents p 
                 LEFT JOIN organizations o ON p.org_id = o.id 
                 WHERE p.parent in 
                 (SELECT parent FROM parents WHERE org_id = '${organizationID}') AND p.org_id <> '${organizationID}'
                 UNION 
                 SELECT o.name, 'parent' AS relationship_type 
                 FROM parents p 
                 JOIN parents c ON p.org_id = c.parent
                 LEFT JOIN organizations o ON p.org_id = o.id 
                 WHERE c.org_id='${organizationID}' 
                 UNION 
                 SELECT o.name, 'daughters' AS relationship_type 
                 FROM organizations o 
                 JOIN parents p ON o.id = p.org_id
                 WHERE p.parent = '${organizationID}' 
                 GROUP BY o.name
                 ORDER BY o.name ASC
                 LIMIT ${start}, ${display};`, { type: db.conn.QueryTypes.SELECT }

            ).then(function(graph) {
                console.log(tap)
                let pagination = {
                    total: graph.length,
                    pages: Math.ceil(graph.length / display),
                    currentPage: (page === undefined) ? 1 : page
                }

                graph.push(pagination);
                res.status(200).json(graph)

            }).catch(function(err) {
                req.errstatus = 500;
                next(err)
            });

        }).catch(function(err) {
            req.errstatus = 500;
            next(err)
        });

    }).catch(function(err) {
        req.errstatus = 500;
        next(err)
    });

}

