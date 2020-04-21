from flask import g

def basic(arg, op):
    bs = getattr(g, 'bsclient', None)
    if not bs:
        return

    code = arg['code']
    start = arg['start']
    end = arg['end']
    res = []
    func = getattr(bs, op, None)
    if not func:
        return res
    for year in range(start, end):
        for quarter in range(1, 5):

            rs_profit = func(code=code, year=year, quarter=quarter)
            if rs_profit.error_code == '0' and len(rs_profit.data) > 0:
                obj = {}
                for idx, col in enumerate(rs_profit.fields):
                    obj[col] = rs_profit.data[0][idx]
                res.append(obj)
    return res


def profit(arg):
    return basic(arg, 'query_profit_data')

def operation(arg):
    return basic(arg, 'query_operation_data')
