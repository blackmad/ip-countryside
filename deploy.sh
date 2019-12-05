#!/bin/sh


curl -O /tmp/ip2country.zip https://github.com/Markus-Go/ip-countryside/blob/downloads/ip2country.zip?raw=true
unzip /tmp/ip2country.zip

npm version patch
