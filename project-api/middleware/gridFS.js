// gridfs.js
const { GridFSBucket } = require('mongodb');

let gfs;

function initGridFS(conn) {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'highlights',
  });
  console.log('🎥 GridFS initialized');
}

function getGFS() {
  if (!gfs) throw new Error('GridFS not initialized');
  return gfs;
}

module.exports = { initGridFS, getGFS };
