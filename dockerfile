from node:12.16.3-buster

run apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip


run mkdir qtrade
workdir qtrade
add dist dist 
add server server
add package.json package.json
run npm install --production

add pyserver/app pyserver/app
add pyserver/requirements.txt pyserver/requirements.txt 
workdir pyserver
run pip install --no-cache-dir -r requirements.txt

EXPOSE 9000
CMD ["npm","run","start"] 
