#!/bin/sh

rm -rf tmp
mkdir tmp
curl -L -o tmp/ip2country.zip https://github.com/Markus-Go/ip-countryside/blob/downloads/ip2country.zip?raw=true
cd tmp
unzip ip2country.zip
cd ..

if (cmp tmp/ip2country.db lib/ip2country.db >/dev/null 2>&1)
then
  echo '**** NO DIFF ****'
  rm -rf tmp
  exit 0
fi

echo "updated data, deploying"
mv tmp/ip2country.db lib/ip2country.db

npm run build || { echo 'BUILD FAILED' ; exit 1; }
npm run test || { echo 'TEST FAILED' ; exit 1; }

rm -rf tmp
npm version patch
git commit -m "updated data"
git push
npm publish

