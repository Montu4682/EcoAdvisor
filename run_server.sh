#!/bin/bash
cd /home/runner/workspace
export MAVEN_OPTS="-Xmx512m -Djava.awt.headless=true"
mvn jetty:run -Djetty.port=5000 -Djetty.host=0.0.0.0 -Djetty.stopKey=stop -Djetty.stopPort=9999