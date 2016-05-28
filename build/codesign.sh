#!/bin/sh

FOLDER=$(pwd)
KEYCHAIN_PASSWORD=circleci
KEY_CHAIN=ios-build.keychain

security create-keychain -p circle $KEY_CHAIN
# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN
# Unlock the keychain
security unlock-keychain -p circle $KEY_CHAIN
# Set keychain locking timeout to 3600 seconds
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# Add certificates to keychain and allow codesign to access them
security import $FOLDER/fixtures/mac_development.cer -k $KEY_CHAIN -T /usr/bin/codesign
security import $FOLDER/fixtures/Certificates.p12 -k $KEY_CHAIN -P circle -T /usr/bin/codesign

echo "Add keychain to keychain-list"
security list-keychains -s ios-build.keychain
