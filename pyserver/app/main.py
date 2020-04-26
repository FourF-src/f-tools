from flask import Flask, request, json, g
import baostock as bs
from profit import profit, operation
from securitys import hs300
services_func = {
    'profit': profit,
    'operation': operation,
    'hs300': hs300
}

app = Flask(__name__)

@app.route('/httprpc/<service>', methods=['GET', 'POST'])
def httprpc(service):
    if request.method == 'POST':
        if 'application/json' not in request.content_type:
            return json.dumps({
                'service':service, 'err': 'should be application/json'
            })

        bsclient = getattr(g, 'bsclient', None)
        
        if not bsclient:
            bsclient = g.bsclient = bs
        
        bs.login()
        arg = json.loads(request.data)
        print('call ', service, arg)
        func = services_func.get(service, None);
        if func:
            return json.dumps({
                'service':service, 'data': func(arg)
            })

        return json.dumps({
            'service':service, 'err': 'no service'
        })
    else:
        return request.path


@app.teardown_appcontext
def before_close(error):
    bsclient = getattr(g, 'bsclient', None)
    if bsclient:
        bsclient.logout()

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
