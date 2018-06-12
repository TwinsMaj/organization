let db                  = require("../db.js"),
    organizationModel   = db.organizationModel,
    parentModel         = db.parentModel,
    _utils              = require("../utils.js");


exports.addOrganization = function(req, res, next) {

    db.conn.sync({force:false}).then(function() {

        let payload             = req.body,
            serializedPayload   = _utils.serialize(payload),
            nodes               = serializedPayload.nodes,
            edges               = serializedPayload.edges;

        organizationModel.bulkCreate(nodes).then(function() {

            // nothing to do here...

        }).then(function(nodes) {

            res.status(200).json(nodes);

        }).catch((function(err) {
            req.errstatus = 500;
            next(err)
        })

    }).catch(function(err) {
        req.errstatus = 500;
        next(err)
    })
}

