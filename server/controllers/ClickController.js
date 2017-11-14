var _paymentInfoService = require('../core/dal/PaymentInfoService'),
    _clickService = require('../core/dal/ClickService'),
    _userInfoService = require('../core/dal/UserInfoService'),
    _packageService = require('../core/dal/PackageService'),
    _urlDetailService = require('../core/dal/UrlDetailService'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    ASQ = require("asynquence"),
    _helpers = require('../utility/responseHelper'),
    FailureResponse = require('../core/dto/FailureResponse'),
    mongodb = require('mongodb'),
    __array = require('lodash/array'),
    __collection = require('lodash/collection');



// Assign clicks to users
exports.assignClicks = function (req, res) {
    var globalObj = {};
    ASQ()
        // Step 1 : Get all those customers which have an active payment
        .then(_paymentInfoService.getActivePaymentUsers)
        .then(function (done, paymentInfos) {
            if (paymentInfos.length <= 0) {

                done.fail(new FailureResponse(404, "Active users not found"));

            } else {

                var activePaymentUsers = [];
                paymentInfos.forEach(function (pi) {
                    if (activePaymentUsers.indexOf(pi.userId) < 0) {
                        activePaymentUsers.push(pi.userId);
                    }
                });

                // Assign values to global object so that it can be used in further THEN calls
                globalObj.paymentInfoList = paymentInfos;
                globalObj.activePaymentUsers = activePaymentUsers;
                done(globalObj);
            }
        })
        // Step 2 : For customers found in [Step 1] check how many have uploaded all documents from [UserInfo] Table
        .then(_userInfoService.getAllWithAllImages)
        .then(function (done, list) {
            if (list.length <= 0) {
                done.fail(new FailureResponse(404, "Active users not found"));
            } else {
                globalObj.activeUserInfos = list;
                done(globalObj);
            }
        })
        // Step 3 : GET all the links and packages available in database.
        .gate(_urlDetailService.getAll, _packageService.getAll)
        .then(function (done, links, packages) {
            if (links.length <= 0) {
                done.fail(new FailureResponse(404, "Links not available in database"));
            }
            else if (packages.length <= 0) {
                done.fail(new FailureResponse(404, "Packages not available in database"));
            }
            else {

                var idsOfAllLinks = [];
                __collection.forEach(links, function (l) {
                    idsOfAllLinks.push(l._id);
                });

                globalObj.idsOfAllAvailableLinks = idsOfAllLinks;
                globalObj.allAvailableLinks = links;
                globalObj.packages = packages;

                // Step 4 : Now LOOP through all the customers found in [Step 2].
                globalObj.activeUserInfos.forEach(function (ui) {
                    _assignLink(ui.userId, globalObj);
                });
                done(globalObj);
            }
        })
        .then(function (_, data) {
            return _helpers.responseType.Success(res, _constants.messages.LINK_ASSIGNING_STARTED);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}

// Get all clicks assigned to me.
exports.getClicksForToday = function (req, res) {
    var filters = {
        userId: req.query.id,
        isClicked: false
    }
    ASQ(filters)
        .then(_clickService.getAll)
        .then(function (_, list) {
            res.send(list);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}

exports.updateLinkVisit = function (req, res) {
    var _availableClickId = req.body.id;
    ASQ(_availableClickId)
        .then(_clickService.setLinkVisited)
        .then(function (_, result) {
            return _helpers.responseType.Success(res);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}


// Assign Links to user
function _assignLink(userId, obj) {

    var globalObj = obj;
    globalObj.userId = userId;

    // Step 5 : GET payments which users has made [Can be taken from STEP 1] record.
    var myPayments = __collection.filter(globalObj.paymentInfoList, { 'userId': userId });

    // Step 6 : Select package which is used while making payment and number of clicks to assign
    var numberOfClicksToAssign = 0;

    ASQ(globalObj.userId)
        // Step 7 : Now for each customers GET all the links which were assigned earlier from [AvailableClicks] table.
        .then(_clickService.getAllByUserId)
        .then(function (done, linksAssignedToMe) {

            var clicksToForMe = [];
            __collection.forEach(myPayments, function (_pi) {
                var package = __collection.find(globalObj.packages, { '_id': new mongodb.ObjectId(_pi.packageId) });
                numberOfClicksToAssign += package.clicks;

                // Check if I have task assigned for this month
                // Then don't add tasks
                var _clicksAlreadyAdded = __collection.some(linksAssignedToMe, { 'paymentInfoId': _pi._id.toString() });
                if (!_clicksAlreadyAdded) {

                    // Get Ids of links assigned to me
                    var idsOfLinksAssignedToMe = [];
                    __collection.forEach(linksAssignedToMe, function (_link) {
                        idsOfLinksAssignedToMe.push(_link.url.id);
                    });

                    var _linkDifferece = __array.difference(globalObj.idsOfAllAvailableLinks, idsOfLinksAssignedToMe)
                    var linksToAddForThisPackage = __array.take(_linkDifferece, numberOfClicksToAssign);

                    __collection.forEach(linksToAddForThisPackage, function (_link) {
                        var _urlDetail = __collection.find(globalObj.allAvailableLinks, { '_id': _link });
                        if (_urlDetail) {
                            clicksToForMe.push({
                                assignedTo: globalObj.userId,
                                paymentInfoId: _pi._id,
                                endDate: _pi.endDate,
                                url: {
                                    id: _urlDetail._id,
                                    link: _urlDetail.link
                                }
                            });
                        }
                    })
                }
            });

            // Step 8 : Now assign links to user from record got from [Step 3] which are not present in record from [Step 6]
            __collection.forEach(clicksToForMe, function (_availableClick) {
                _clickService.create(done, _availableClick);
            });


            done(true);

        });

}
