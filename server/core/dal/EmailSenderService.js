var _mailBodyService = require('./MailBodyService'),
    _constants = require('../../utility/constants');
    _siteHelpers = require('../../utility/siteHelpers'),
    nodemailer = require('nodemailer'),
    ASQ = require("asynquence"),
    FailureResponse = require('../dto/FailureResponse');

var smtpTransport = nodemailer.createTransport("SMTP", {
    host: process.env.SMTP_HOST, // hostname
    port: process.env.SMTP_PORT, // port for secure SMTP
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// All functions which are being exported from this function
module.exports = {
    sendAccountVerificationEmail : _sendAccountVerificationEmail,
    sendPasswordResetLinkEmail   : _sendPasswordResetLinkEmail,
    sendNewsLetter               : _sendNewsLetter,
    sendReferralEmail            : _sendReferralEmail
}

// Email to user to verify account details
function _sendAccountVerificationEmail(user) {
    var globalObj = {  user: user };
    ASQ(_constants.EmailSendingCodes.ACCOUNT_VERIFICATION)
            .then(_mailBodyService.getByCode)
            .then(function (done, result) {
                if(!result.mailBody) {
                    done.fail(_constants.messages.MAIL_BODY_NOT_FOUND);
                } else {

                    var _keysToReplace = [  { "USER"  : globalObj.user.firstName + ' ' + globalObj.user.lastName },
                                            { "EMAIL" : globalObj.user.username },
                                            { "LINK"  :  _siteHelpers.getBaseURL() + 'verifyemail/' + globalObj.user.password }
                                        ];

                    var _mailOptions = {
                            to: globalObj.user.username,
                            subject: _constants.messages.ACCOUNT_VERIFICATION_SUBJECT,
                            html: _replaceKeyValues(result.mailBody.detail, _keysToReplace)
                        };

                   done(_mailOptions);
                }
            })
            .then(_sendEmail)
            .then(function (_, result) {
                console.log('Email send to - ' + result);
            })
            .or(function (err) {
                console.log(err);
            });

}

//  Send password reset link to forgot password user.
function _sendPasswordResetLinkEmail(user, link) {
    var globalObj = { user: user, link: link };
    ASQ(_constants.EmailSendingCodes.FORGOT_PASSWORD)
            .then(_mailBodyService.getByCode)
            .then(function (done, result) {
                if(!result.mailBody) {
                    done.fail(_constants.messages.MAIL_BODY_NOT_FOUND);
                } else {

                    var _keysToReplace = [  { "USER"  : globalObj.user.firstName + ' ' + globalObj.user.lastName },
                                            { "LINK"  :  globalObj.link }
                                         ];

                    var _mailOptions = {
                            to: globalObj.user.username,
                            subject: _constants.messages.PASSWORD_RESET_EMAIL_SUBJECT,
                            html: _replaceKeyValues(result.mailBody.detail, _keysToReplace)
                        };

                   done(_mailOptions);
                }
            })
            .then(_sendEmail)
            .then(function (_, result) {
                console.log('Email send to - ' + result);
            })
            .onerror(function (err) {
                console.log(err);
            });
}


// Send News letter email
function _sendNewsLetter(user, mailBodyId) {
    var globalObj = {
        user : user
    }

    ASQ(mailBodyId)
        .then(_mailBodyService.getById)
        .then(function (done, result) {
            if(!result.mailBody) {
                done.fail(_constants.messages.MAIL_BODY_NOT_FOUND);
            } else {

                var _keysToReplace = [  
                                        { "USER"  : globalObj.user.firstName + ' ' + globalObj.user.lastName }
                                     ];

                var _mailOptions = {
                        to: globalObj.user.username,
                        subject: _constants.messages.NEWS_LETTER_SUBJECT,
                        html: _replaceKeyValues(result.mailBody.detail, _keysToReplace)
                    };

               done(_mailOptions);
            }
        })
        .then(_sendEmail)
        .then(function(_, result){

        })
        .onerror(function (err) {
            console.log(err);
        });
}

function _sendReferralEmail(user, password) {
    var globalObj = {  user: user };
    ASQ(_constants.EmailSendingCodes.REFERRAL_MAIL)
            .then(_mailBodyService.getByCode)
            .then(function (done, result) {
                if(!result.mailBody) {
                    done.fail(_constants.messages.MAIL_BODY_NOT_FOUND);
                } else {

                    var _keysToReplace = [  { "USER"  : globalObj.user.firstName + ' ' + globalObj.user.lastName },
                                            { "EMAIL" : globalObj.user.username },
                                            { "PASSWORD" : password },
                                            { "LINK"  :  crypto.getBaseURL() + 'verifyemail/' + globalObj.user.password }
                                        ];

                    var _mailOptions = {
                            to: globalObj.user.username,
                            subject: _constants.messages.REFERRAL_SUBJECT,
                            html: _replaceKeyValues(result.mailBody.detail, _keysToReplace)
                        };

                   done(_mailOptions);
                }
            })
            .then(_sendEmail)
            .then(function (_, result) {
                console.log('Email send to - ' + result);
            })
            .or(function (err) {
                console.log(err);
            });
}



// ------------------------------------------------------------
// Email sending code here
// -------------------------------------------------------------
function _sendEmail(done, mailOptions) {
    var _keysToReplace = [  
                            { "COPYRIGHT"  : '2017 ShawnWl Inc' },
                            { "CONTACT_EMAIL" : 'contact@shawnwl.net' },
                            { "CONTACT_US"  :  'contact@shawnwl.net' },
                            { "SUBJECT"  :  mailOptions.subject },
                            { "LOGO_URL"  :  _siteHelpers.getBaseURL() + '/website/images/logo.png' },
                            { "LOGIN_URL"  :  _siteHelpers.getLoginURL() }
                        ];
    // replace all default keys and values.
    var _html = _replaceKeyValues(mailOptions.html, _keysToReplace);

    var _mo = {
        from: "Shawn weblinks ✔ <no-reply@shawnwl.in>", // sender address
        to: mailOptions.to, // list of receivers
        subject: mailOptions.subject + " ✔", // Subject line
        html: _html // html body
    }

    // Sending Email Without SMTP
    nodemailer.mail(_mo);
    done("Email has been sent successfully");
}


function _replaceKeyValues(htmlString, listOfKeyValuePair) {
    if(htmlString && listOfKeyValuePair && listOfKeyValuePair.length > 0) {
        for (var i = 0; i < listOfKeyValuePair.length; i++) {
            var obj = listOfKeyValuePair[i];
            for(var _key in obj) {
                htmlString = htmlString.replace(new RegExp('\\['+ _key +'\\]', 'g'), obj[_key]);
             }
        }

        
    }
    return htmlString;
}