/**
 * Created by fanzhang on 17/1/17.
 */
const cookie = require('../common/store/cookie');
const util = require('../common/util');
require('../common/format/date');

new Vue({
    el: '#mainContainer',
    data() {
        return {
            search: {
                BusinessId:cookie.get('BusinessId'),
                OpenId:'',
                QueryBegin: 0,
                QueryNum: 30,
                dateRange: []
            },
            pageNo: 1,
            tableData: {
                data: [],
                total: 0,
                loading: false
            }
        }
    },
    mounted() {
        this.handleCurrentChange(1);
    },
    methods: {

        handleCurrentChange(val) {
            this.fetch(val, (data) => {
                this.tableData.data = data.List;
                this.tableData.total = data.Total;
            });
        },
        onSearch() {
            this.handleCurrentChange(1);
        },
        //清空参数
        onCancel() {
            this.search.OpenId = '';
            this.search.dateRange = [];
            this.handleCurrentChange(1);
        },
        fetch(pageNo, callback) {

            this.pageNo = pageNo;
            this.search.QueryBegin = (pageNo - 1) * this.search.QueryNum;
            var param = $.extend({}, this.search);

            if (param.dateRange.length && param.dateRange.length === 2) {
                param['StartTime'] = param.dateRange[0] && param.dateRange[0].getTime()/ 1000;
                param['EndTime'] = param.dateRange[1] && param.dateRange[1].getTime() / 1000 + 86399;
            }

            delete param.dateRange;
            this.tableData.loading = true;

            $.ajax({
                url: '/route/index_new/account/querybusinessuserlist',
                data: param,
                dataType: "json",
                success: (resp) => {
                    this.tableData.loading = false;
                    if (resp.RspHeader && resp.RspHeader.ErrNo == 200) {
                        callback && callback(resp.RspJson);
                    } else if (resp.RspHeader.ErrMsg === 'success' && resp.RspHeader.Total === 0){
                        this.tableData.data = [];
                        this.tableData.total = 0;
                    }else{
                        this.$message.error(resp.RspHeader.ErrMsg);
                        this.tableData.data = [];
                        this.tableData.total = 0;
                    }
                },
                error: () => {
                    this.tableData.data = [];
                    this.tableData.total = 0;
                    this.tableData.loading = false;
                    this.$message.error('接口返回异常');
                }
            });
        },
        formateDate(row, column) {
            return util.formateDate(row[column.property]);
        },
        formatDiamond2Money(row,column){
            var money = row[column.property];
            return util.diamond2Money(money);
        }
    }
})

