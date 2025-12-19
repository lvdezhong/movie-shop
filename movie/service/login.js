
// 实现与MySQL交互
let db = require("../DBDao/db");



module.exports = {
    list:async function (req, res) {
        let param = req.query || req.params;  
        let beginTime = param.beginTime
        let endTime = param.endTime
        let pageNo = param.pageNo
        let pageSize = param.pageSize
        let userName = param.userName
        let operationType = param.operationType

        let listSql = `select date_format(otr.opDatetime, '%Y-%m-%d %H:%i:%s') opDatetime,otr.lineID,otr.userName,otr.opMachineName,otr.opMachineIP,otr.opType,otr.remark,otr.resultType from operate_data_trunk.TbOperationRecord otr where 1=1 `;
        let listCountSql = "select count(*) total from operate_data_trunk.TbOperationRecord otr where 1=1 "
        let listArgs = []
        let countArgs = []

        if(beginTime!=undefined&&beginTime!=""){
            listSql += "and otr.opDatetime>=? "
            listCountSql += "and otr.opDatetime>=? "
            listArgs.push(beginTime)
            countArgs.push(beginTime)
        }

        if(endTime!=undefined&&endTime!=""){
            listSql += "and otr.opDatetime<=? "
            listCountSql += "and otr.opDatetime<=? "
            listArgs.push(endTime)
            countArgs.push(endTime)
        }

        if(operationType!=undefined&&operationType!=""){
            listSql += "and otr.opType=? "
            listCountSql += "and otr.opType=? "
            listArgs.push(operationType)
            countArgs.push(operationType)
        }

        if(userName!=undefined&&userName!=""){
            listSql += "and otr.userName=? "
            listCountSql += "and otr.userName=? "
            listArgs.push(userName)
            countArgs.push(userName)
        }

        listSql += "order by otr.opDatetime desc limit ?,?"
        listArgs.push((pageNo-1)*pageSize)
        listArgs.push(pageSize * 1)
        
        let resResult = {'code':200,'reason':'成功',"result": {}};
        if(pageNo==undefined||pageSize==undefined){
            resResult.code=201
            resResult.reason="参数有误，请检查"
            res.json(resResult)
            return
        }

        try {
            let result = await db.execQuery(listSql, listArgs)
            let countResult = await db.execQuery(listCountSql, countArgs)
            var countResultSet = await countResult[0];
            resResult.result.dataList = result
            resResult.result.total=countResultSet['total']
        } catch (e) {
            logger.error(loggerPre)
            logger.error(e)
            resResult.code = 201
            resResult.reason = "服务器内部错误"
        }
        res.json(resResult)
    }
};
