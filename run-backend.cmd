@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0api"
mvn.cmd spring-boot:run
