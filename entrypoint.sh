#!/bin/sh -l

hemttPath='hemtt'

$hemttPath --version

$hemttPath build --release --force

$hemttPath zip

# set outputs
zipName=`$hemttPath template {{name}}_{{version}}`
zipPath="releases/$zipName.zip"
echo ::set-output name=zip_name::$zipName
echo ::set-output name=zip_path::$zipPath
