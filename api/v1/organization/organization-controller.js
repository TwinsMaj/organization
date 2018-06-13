let db                  = require("../db.js"),
    organizationModel   = db.organizationModel,
    parentModel         = db.parentModel,
    _utils              = require("../utils.js"),
    HttpStatus          = require('http-status-codes'),
    paginate            = require("paginate-array");


exports.addOrganizations = function(req, res, next) {

    db.conn.sync({force:true}).then(function() {

        let payload             = req.body,
            serializedPayload   = _utils.serialize(payload),
            nodes               = serializedPayload.nodes,
            edges               = serializedPayload.edges;

        parentModel.bulkCreate(edges).then(function() {
            // nothing to do here...
        }).catch(function(e){
            req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
            next(err)
        })

        organizationModel.bulkCreate(nodes).then(function() {

            return organizationModel.findAll();

        }).then(function(nodes) {
            res.status(HttpStatus.OK).json(nodes);

        }).catch(function(err) {
            req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
            next(err)
        })

    }).catch(function(err) {
        req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
        next(err)
    })
}


exports.getOrganizationRelations = function(req, res, next) {

    let orgName = req.params.orgname,
        page    = req.query.page,
        display = 100;

    //start = _utils.calculateStart(page, display);

    if(page < 1)
        page = 1;

    db.conn.sync({force:false}).then(function() {

        organizationModel.findAll({
          where: db.conn.where(db.conn.fn('lower', db.conn.col('name')), db.conn.fn('lower', orgName)),
          raw: true
        }).then(function(item ) {

            let organizationID = item[0].id;

            db.conn.query(
                `SELECT 'sisters' AS relationship_type, o.name 
                 FROM parents p 
                 LEFT JOIN organizations o ON p.org_id = o.id 
                 WHERE p.parent in 
                 (SELECT parent FROM parents WHERE org_id = '${organizationID}') AND p.org_id <> '${organizationID}'
                 UNION 
                 SELECT 'parent' AS relationship_type, o.name
                 FROM parents p 
                 JOIN parents c ON p.org_id = c.parent
                 LEFT JOIN organizations o ON p.org_id = o.id 
                 WHERE c.org_id='${organizationID}' 
                 UNION 
                 SELECT 'daughters' AS relationship_type, o.name
                 FROM organizations o 
                 JOIN parents p ON o.id = p.org_id
                 WHERE p.parent = '${organizationID}' 
                 GROUP BY o.name
                 ORDER BY o.name ASC`, { type: db.conn.QueryTypes.SELECT }

            ).then(function(graph, metadata) {
                const paginateCollection = paginate(graph, page, display);
                res.status(HttpStatus.OK).json(paginateCollection)

            }).catch(function(err) {
                req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
                next(err)
            });

        }).catch(function(err) {
            req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
            next(err)
        });

    }).catch(function(err) {
        req.errstatus = HttpStatus.INTERNAL_SERVER_ERROR;
        next(err)
    });

}

