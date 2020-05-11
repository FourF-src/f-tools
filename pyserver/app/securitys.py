import baostock as bs

def hs300(arg):
    bs.login()
    res = []
    rs_profit = bs.query_hs300_stocks()

    if rs_profit.error_code == '0' and len(rs_profit.data) > 0:
        for d in rs_profit.data:
            obj = {}
            for idx, col in enumerate(rs_profit.fields):
                obj[col] = d[idx]
            res.append(obj)
    bs.logout()
    return res