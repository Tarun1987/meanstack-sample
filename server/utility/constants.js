const _messages = {
        "EMAIL_NOT_FOUND": "Mail not found.",
        "USER_NOT_FOUND": "User not found.",
        "URL_DELETED": "Url deleted successfully!",
        "NO_FILE_UPLOADED": "No files were uploaded.",
        "LINKS_UPLOADED_SUCCESS": "Links uploaded successfully!!",
        "URL_ALREADY_EXISTS": "URL already exists!!",
        "INVALID_OR_EXPIRED_TOKEN": "Token expired or Invalid token !!",
        "PASSWORD_UPDATED_SUCCESS": "Password updated successfully!",
        "EMAIL_VERIFICATION_SUCCESS": "You email has been verified successfully!!",
        "NO_USER_REGISTERED_WITH_THIS_EMAIL": "No user registered with this email.",
        "PASSWORD_RESET_LINK_SENT": "Password reset link sent on your registered email",
        "USER_DEACTIVATED_SUCCESS": "User deactivated successfully!!",
        "USER_DELETED_SUCCESS": "User deleted successfully!",
        "USER_UPDATE_SUCCESS": "User updated successfully!",
        "USERINFO_UPDATE_SUCCESS": "User information updated successfully!",
        "USER_CREATE_SUCCESS": "User created successfully!",
        "EMAIL_ALREADY_EXISTS": "Email already exists in system!",
        "INVALID_USERNAME": "Incorrect username.",
        "INVALID_PASSWORD": "Incorrect password.",
        "PLEASE_VERIFY_YOUR_EMAIL": "Please verify your email address.",
        "ACCOUNT_DELETED_CONTACT_ADMIN": "Your account has been deleted. Please contact admin",
        "PAYMENT_CREATED_SUCCESSFULLY": "Payment created successfully!!",
        "SETTING_CREATE_SUCCESS": "Setting saved successfully!!",
        "PAYMENT_UPDATED_SUCCESS": "Payment updated successfully!!",
        "SETTING_DEACTIVATION_SUCCESS": "Setting deactivated successfully!!",
        "NEWSLETTER_NOT_FOUND": "Newsletter not found!!",
        "MAIL_BODY_NOT_FOUND": "Email body not found in db!!",
        "ACCOUNT_VERIFICATION_SUBJECT": "Congratulations on joining!!",
        "REFERRAL_SUBJECT": "Invitation to join Shawn web links!!",
        "PASSWORD_RESET_EMAIL_SUBJECT": "Password reset request!!",
        "NEWS_LETTER_SUBJECT": "Hello All!!",
        "NO_ACTIVE_USERS_FOUND": "Active users not found!!",
        "NEWSLETTER_SENT": "Newsletter sent to all active users",
        "URL_NOT_FOUND": "URl not found!!",
        "URL_ALREADY_EXISTS": "URl already exists!!",
        "URL_CREATED_SUCCESS": "URl created successfully!!",
        "LINK_ASSIGNING_STARTED": "Job started to assign links to all active users",
        "QUERY_SUBMITTED_SUCCESS": "Query submitted successfully!!"
};

const _roleTypes = {
        Admin: "admin"
};

const _statusTypes = {
        "Accepted": "Accepted",
        "Pending": "Pending",
        "Completed": "Completed",
        "Failed": "Failed",
};

const _imageTypes = {
        PROFILE: "PROFILE",
        ADHAR: "ADHAR",
        PAN_CARD: "PAN_CARD",
        CANCELLED_CHEQUE: "CHEQUE",
};

const _emailverificationCodes = {
        ACCOUNT_VERIFICATION: "ACCOUNT_VERIFICATION",
        FORGOT_PASSWORD: "FORGOT_PASSWORD",
        REFERRAL_MAIL: "REFERRAL_MAIL"
}

const _payULogType = {
        RESPONSE: "RESPONSE",
        REQUEST: "REQUEST"
};

const _paymentMethod = {
        Online: "Online",
        Cheque: "Cheque",
        Cash: "Cash"
};

const _signUpTypes = {
        "Facebook": "facebook",
        "Website": "website"
};

const _responseTypes = {
        NOT_FOUND: function (message) { return { status: 404, message: message }; },
        SUCCESS: function (message) { return { success: true, message: message }; },
        SUCCESS_DATA: function (obj) {
                if ("success" in obj) {
                }
                else {
                        obj.success = true;
                }
                return obj;
        }
}

const _notificationTypes = {
        ImageUploaded: "IMAGE_UPLOADED",
        ReferralAdded: "REFERRAL_ADDED"
}

function _getNameToSave(req) {

        var _name = req.user.firstName;
        if (req.user.lastName) {
                _name += " " + req.user.lastName;
        }

        return _name;
}

module.exports = {
        messages: _messages,
        RoleTypes: _roleTypes,
        StatusTypes: _statusTypes,
        ImageTypes: _imageTypes,
        EmailSendingCodes: _emailverificationCodes,
        PayULogType: _payULogType,
        PaymentModes: _paymentMethod,
        SignUpType: _signUpTypes,
        ResponseTypes: _responseTypes,
        NotificationTypes: _notificationTypes,
        GetNameToSave: _getNameToSave
}