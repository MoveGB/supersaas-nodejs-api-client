(function() {
  var validation  = require("./validation");
  var User = require("../models/User");

  module.exports = (function() {
    function Users(client) {
      this.client = client;
    }
    Users.ROLES = [3, 4, -1];

    Users.prototype.list = function(form, limit, offset, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath();
      var query = {
        form: form && form !== callback ? true : null,
        limit: limit && limit !== callback ? validation.validateNumber(limit) : null,
        offset: offset && offset !== callback ? validation.validateNumber(offset) : null
      }
      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          var res = data.map (function(attributes) { return new User(attributes); });
          callback(null, res);
        }
      } : null);
    }

    Users.prototype.get = function(userId, sendAlphaNumeric, callback) {
      var path = sendAlphaNumeric ? '/users' : this._userPath(userId);
      query = { id: sendAlphaNumeric && sendAlphaNumeric !== callback ? userId : null };

      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new User(data));
        }
      } : null);
    }

    Users.prototype.create = function(attributes, userId, webhook, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath(userId);
      var query = {webhook: webhook && webhook !== callback ? 'true' : null};
      var params = {
        name: validation.validatePresent(attributes['name']),
        email: attributes['email'],
        password: attributes['password'],
        full_name: attributes['full_name'] || attributes['fullName'],
        address: attributes['address'],
        mobile: attributes['mobile'],
        phone: attributes['phone'],
        country: attributes['country'],
        field_1: attributes['field_1'],
        field_2: attributes['field_2'],
        super_field: attributes['super_field'],
        credit: attributes['credit'] ? validation.validateNumber(attributes['credit']) : null,
        role: attributes['role'] ? validation.validateOptions(attributes['role'], Users.ROLES) : null
      }
      return this.client.post(path, params, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new User(params.user));
        }
      } : null);
    }

    Users.prototype.update = function(userId, attributes, webhook, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath(userId);
      var query = {webhook: webhook && webhook !== callback ? 'true' : null};
      var params = {
        name: validation.validatePresent(attributes['name']),
        email: attributes['email'],
        password: attributes['password'],
        full_name: attributes['full_name'] || attributes['fullName'],
        address: attributes['address'],
        mobile: attributes['mobile'],
        phone: attributes['phone'],
        country: attributes['country'],
        field_1: attributes['field_1'],
        field_2: attributes['field_2'],
        super_field: attributes['super_field'],
        credit: attributes['credit'] ? validation.validateNumber(attributes['credit']) : null,
        role: attributes['role'] ? validation.validateOptions(attributes['role'], Users.ROLES) : null
      }
      return this.client.put(path, params, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new User(params.user));
        }
      } : null);
    }

    Users.prototype.delete = function(userId, callback) {
      var path = this._userPath(userId);
      return this.client.delete(path, null, null, callback);
    }

    Users.prototype._userPath = function(userId, callback) {
      if (!userId || userId === '') {
        return "/users";
      } else {
        return "/users/" + userId;
      }
    }

    return Users;
  })();

}).call(this);