from mhart/alpine-node:10 
run mkdir qtrade
workdir qtrade
copy dist server package.json ./
run npm install --production
# run npm remove cache
EXPOSE 9000
CMD ["npm","run","start"] 
