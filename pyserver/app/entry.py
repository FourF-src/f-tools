import zerorpc
import os
from profit import profit, operation
from securitys import hs300
import json
# Set environment variables
addr = getattr(os.environ, 'PYURL', 'tcp://0.0.0.0:4242') 

class HelloRPC(object):
    def profit(self, arg):
        return profit(json.loads(arg))
    def operation(self, arg):
        return operation(json.loads(arg))
    def hs300(self, arg):
        return hs300(json.loads(arg))

s = zerorpc.Server(HelloRPC())
s.bind(addr)
s.run()
