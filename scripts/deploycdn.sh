# Install blobxfer
curl -L -o ~/blobxfer https://github.com/Azure/blobxfer/releases/download/1.2.1/blobxfer-1.2.1-linux-x86_64
chmod +x ~/blobxfer

PACKAGE_NAME=$(node -p require\(\'$TRAVIS_BUILD_DIR/packages/bundle/package.json\'\).name)
PACKAGE_VERSION=$(node -p require\(\'$TRAVIS_BUILD_DIR/packages/bundle/package.json\'\).version)
echo Will publish to CDN at $PACKAGE_NAME/$PACKAGE_VERSION/*

# Upload to based on version from package.json
~/blobxfer upload --local-path $TRAVIS_BUILD_DIR/packages/bundle/dist --remote-path $PACKAGE_NAME/$PACKAGE_VERSION --storage-account $CDN_BLOB_ACCOUNT --storage-account-key $CDN_BLOB_KEY

# If TRAVIS_TAG is present, it means this is going PRODUCTION
if [ -n "$TRAVIS_TAG" ]
then
# Upload to /latest/
~/blobxfer upload --local-path $TRAVIS_BUILD_DIR/dist --remote-path $PACKAGE_NAME/latest --storage-account $CDN_BLOB_ACCOUNT --storage-account-key $CDN_BLOB_KEY
fi

# If on "v4" branch, deploy to "v4" tag too
if [ "$TRAVIS_BRANCH" = "master" ]
then
# Upload to /v4/
~/blobxfer upload --local-path $TRAVIS_BUILD_DIR/dist --remote-path $PACKAGE_NAME/v4 --storage-account $CDN_BLOB_ACCOUNT --storage-account-key $CDN_BLOB_KEY
fi