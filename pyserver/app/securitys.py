from flask import g

def hs300(arg):
    bs = getattr(g, 'bsclient', None)
    if not bs:
        return

    res = []
    rs_profit = bs.query_hs300_stocks()

    if rs_profit.error_code == '0' and len(rs_profit.data) > 0:
        for d in rs_profit.data:
            obj = {}
            for idx, col in enumerate(rs_profit.fields):
                obj[col] = d[idx]
            res.append(obj)

    return res