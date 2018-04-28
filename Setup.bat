powershell -Command "Invoke-WebRequest https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi -OutFile node.msi"
cd /d %~dp0
msiexec.exe /i node.msi /qb
call npm install discord.js
call npm install fs
call npm install node-watch