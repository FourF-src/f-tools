import baostock as bs

def basic(arg, op):
    bs.login()

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
    bs.logout()
    return res


def profit(arg):
    return basic(arg, 'query_profit_data')

def operation(arg):
    return basic(arg, 'query_operation_data')
