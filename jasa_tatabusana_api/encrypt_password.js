'use strict';
var crypto = require('crypto');

var genRandomString = function(length) {
    return crypto.randomBytes(Math.ceil(length/2)) 
        .toString('hex')
        .slice(0, length);
    };

    var sha512 = function(password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var value = hash.digest('base64');
        return {
            salt:salt,
            passwordHash:value
        };
    };

    exports.saltHashPassword = function(userpassword) {
        try {
            var salt = genRandomString(16);
            var passwordData = sha512(userpassword, salt);
            // console.log('UserPassword = '+userpassword);
            // console.log('Passwordhash= '+passwordData.passwordHash);
            // console.log('nSalt = '+passwordData.salt);
            passwordData = passwordData.passwordHash + "$" + passwordData.salt
            return passwordData;
        } catch (e) {
            return "";
        }
    }

    exports.compareHashPassword = function(userpassword, hashsaltpassword) {
        try {
            var pass = hashsaltpassword.split("$");
            let salt = pass[1];
            let hash = crypto.createHmac('sha512', salt).update(userpassword).digest("base64");
            if(hash === pass[0]) {
                //console.log('Password cocok');
                return true;
            } else {
                // console.log('Password tidak cocok!');
                return false;
            }
        } catch (e) {
            return false;
        }
    }