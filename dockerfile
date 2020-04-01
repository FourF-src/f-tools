from mhart/alpine-node:10 
run apk add --no-cache git
run git clone https://github.com/FourF-src/f-tools.git
workdir f-tools
run npm i && npm run build 
run rm -fr node_modules
run npm i --production
CMD ["npm","run","api"] 