from mhart/alpine-node:10 
run mkdir qtrade
workdir qtrade
add ./dist dist
add ./server server
add package.json package.json
run npm install --production
# run npm remove cache
EXPOSE 9000
CMD ["npm","run","start"] 
