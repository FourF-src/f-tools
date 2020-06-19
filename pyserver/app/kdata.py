import baostock as bs


def kdata(arg):
    bs.login()

    code = arg['code']
    start = arg['start']
    end = arg['end']
    select = "date,code,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST"

    res = []

    rs = bs.query_history_k_data_plus(code,
        select,
        start_date=start, end_date=end,
        frequency="d", adjustflag="3")
    count = 0
    tmp = []
    while (rs.error_code == '0') & rs.next():
        # 获取一条记录，将记录合并在一起
        tmp.append(rs.get_row_data())
        count += 1
    for item in tmp:
        obj = {}
        for idx, col in enumerate(rs.fields):
            obj[col] = item[idx]
        res.append(obj)
    bs.logout()

    return res
