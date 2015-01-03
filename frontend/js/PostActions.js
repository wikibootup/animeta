var Dispatcher = require('./Dispatcher');

var _pendingPostID = 0;

function fetchRecordPosts(recordID) {
    return $.get('/api/v2/records/' + recordID + '/posts').then(result => {
        Dispatcher.dispatch({
            type: 'loadRecordPosts',
            recordID: recordID,
            posts: result.posts
        });
    });
}

function createPost(recordID, post, publishOptions) {
    var context = _pendingPostID++;
    Dispatcher.dispatch({
        type: 'createPendingPost',
        recordID, post, context
    });
    // TODO: handle failure case
    return $.post('/api/v2/records/' + recordID + '/posts', {
        ...post,
        publish_twitter: publishOptions.twitter ? 'on' : 'off'
    }).then(result => {
        Dispatcher.dispatch({
            type: 'resolvePendingPost',
            updatedRecord: result.record,
            post: result.post
        });
    });
}

module.exports = {
    fetchRecordPosts,
    createPost
};
