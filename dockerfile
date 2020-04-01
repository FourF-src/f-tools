from mhart/alpine-node:10 
run apk add --no-cache git
run git clone https://github.com/FourF-src/f-tools.git
workdir f-tools
add ./dist dist
add ./server server
run npm install --production
# run npm remove cache
EXPOSE 9000
CMD ["npm","run","start"] 
