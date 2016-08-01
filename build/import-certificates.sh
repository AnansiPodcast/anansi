#!/bin/sh

FOLDER=~/Dropbox/Anansi
KEYCHAIN_PASSWORD=circleci
KEY_CHAIN=ios-build.keychain

security create-keychain -p circle $KEY_CHAIN
security default-keychain -s $KEY_CHAIN

security unlock-keychain -p circle $KEY_CHAIN
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# Add certificates to keychain and allow codesign to access them
security import $FOLDER/mac_app.cer -k $KEY_CHAIN -T /usr/bin/codesign
security import $FOLDER/Certificates.p12 -k $KEY_CHAIN -P circle -T /usr/bin/codesign

echo "Add keychain to keychain-list"
security list-keychains -s ios-build.keychain
