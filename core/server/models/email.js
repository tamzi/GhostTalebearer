const uuid = require('uuid');
const ghostBookshelf = require('./base');

const Email = ghostBookshelf.Model.extend({
    tableName: 'emails',

    defaults: function defaults() {
        return {
            uuid: uuid.v4(),
            status: 'pending',
            recipient_filter: 'paid',
            track_opens: false,
            delivered_count: 0,
            opened_count: 0,
            failed_count: 0
        };
    },

    post() {
        return this.belongsTo('Post', 'post_id');
    },
    emailBatches() {
        return this.hasMany('EmailBatch', 'email_id');
    },
    recipients() {
        return this.hasMany('EmailRecipient', 'email_id');
    },

    emitChange: function emitChange(event, options) {
        const eventToTrigger = 'email' + '.' + event;
        ghostBookshelf.Model.prototype.emitChange.bind(this)(this, eventToTrigger, options);
    },

    onCreated: function onCreated(model, attrs, options) {
        ghostBookshelf.Model.prototype.onCreated.apply(this, arguments);

        model.emitChange('added', options);
    },

    onUpdated: function onUpdated(model, attrs, options) {
        ghostBookshelf.Model.prototype.onUpdated.apply(this, arguments);

        model.emitChange('edited', options);
    },

    onDestroyed: function onDestroyed(model, options) {
        ghostBookshelf.Model.prototype.onDestroyed.apply(this, arguments);

        model.emitChange('deleted', options);
    }
}, {
    post() {
        return this.belongsTo('Post');
    }
});

const Emails = ghostBookshelf.Collection.extend({
    model: Email
});

module.exports = {
    Email: ghostBookshelf.model('Email', Email),
    Emails: ghostBookshelf.collection('Emails', Emails)
};
