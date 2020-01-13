<template>
    <section>
        <el-row class="user_notice">
            <div class="userHintSwitch">用户须知</div>
            <div class="box">
                <ul class="conl" ref="con1" :class="animate?'amin':''">
                    <li v-for="data in items ">{{data.name}}</li>
                </ul>
            </div>
            <div class="enterpriseCode"><span class="enterpriseCode_label">IC卡<span class="font_weight">企业编码</span> : </span>{{enterpriseCode}}</div>
        </el-row>
        <el-row>
            <div class="tax_header_title">
                <span class="tax_header_image"></span>
                <span class="tax_header_txt">税单信息查询</span>
            </div>
        </el-row>
        <!--查询条件start-->
        <el-row class="meter_style">
            <div class="title">
                <span class="title_image group4"></span>
                <span class="title_txt">税单信息查询</span>
            </div>
            <span class="holp_button" @click="gethelp()"><span class="heop-icon"></span>《电子税单帮助》</span>

            <div class="lineWire"></div>
        </el-row>
        <el-row class="meter_style">
            <el-form class="queryKey" ref="queryForm" :model="queryData" :rules="rules">
                <el-form-item style="padding-top:40px">
                    <el-col :span="5" style="width:132px;">
                        <el-form-item>
                            <el-select class="choose_input" v-model="queryData.value" value-key="queryData.name"
                                       @change="changetext(queryData.value)">
                                <el-option v-for="(item,key,index) in options"
                                           :id="item.name"
                                           :key="item.name"
                                           :value="item.name"
                                           :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width:260px;" v-if="queryData.value  != 'dateSection'">
                        <el-form-item v-if="queryData.value == 'customs'" prop="customs">
                            <el-input @change="valueChange" class="tax_input" id="customs" name="customs"
                                      v-model="queryData.customs" @keyup.enter.native="gettableData('queryForm')"
                                      :placeholder="'请输入报关单号'"></el-input>
                        </el-form-item>

                        <el-form-item v-if="queryData.value == 'taxBill'" prop="taxBill">
                            <el-input @change="valueChange" class="tax_input" id="taxBill" name="taxBill"
                                      v-model="queryData.taxBill" @keyup.enter.native="gettableData('queryForm')"
                                      :placeholder="'请输入税单号'"></el-input>
                        </el-form-item>
                    </el-col>
                    <div v-else>
                        <el-col :span="5">
                            <el-form-item prop="startDate">
                                <el-date-picker class="cursor-point"
                                                style="width: 100%;"
                                                v-model="queryData.startDate"
                                                type="date"
                                                :editable="false"
                                                placeholder="选择开始日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                :picker-options="pickerBeginDateBeAfter"
                                                @change="valueChange"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item prop="endDate">
                                <el-date-picker class="cursor-point"
                                                style="width: 100%;"
                                                v-model="queryData.endDate"
                                                type="date"
                                                :editable="false"
                                                placeholder="选择结束日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd"
                                                :picker-options="pickerBeginDateAfter"
                                                @change="valueChange">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :span="7">
                        <el-button @click="gettableData('queryForm')" class="top_btn" :disabled="queryData.value == ''"
                                   type="success">查询
                        </el-button>

                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>
        <!--查询条件end-->

        <!--列表start-->
        <el-row class="meter_style" style="padding-bottom:20px;">
            <div class="title">
                <span class="title_image group2"></span>
                <span class="title_txt" style="width:116px">税单信息查询结果</span>
            </div>
            <div class="lineWire"></div>
        </el-row>
        <el-row class="meter_style">

            <el-col :span="24">
                <el-table
                        ref="singleTable"
                        :data="tableData"
                        empty-text="没有找到相关结果"
                        stripe
                        max-height="470"
                        style="width: 100%"
                        class="query_result"
                        v-loading="loading"
                        highlight-current-row
                        @select="handleSelectionChanges"
                        @select-all="handleSelectionChanges"
                >
                    <el-table-column
                            type="selection"
                            width="60"
                            :max="1"
                            :min="1"
                            id="select"
                            :selectable="selectStatus">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="taxCode"
                            align="center"
                            label="税单号"
                            width="216">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="entryId"
                            align="center"
                            label="报关单号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            sortable
                            align="center"
                            prop="cDate"
                            label="缴款日期"
                            width="124">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="dutyFlag"
                            align="center"
                            label="税单状态"
                            width="105">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            header-align="center"
                            prop="printNum"
                            label="打印状态"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            header-align="center"
                            label="操作"
                            width="110">
                        <template slot-scope="scope">
                            <el-button @click="printClick(scope.row,scope.$index)" :disabled="!scope.row.isStats.stutas"
                                       type="text" size="small" :class="!scope.row.isStats.stutas? 'disb_color':''">{{scope.row.isStats.title}}
                            </el-button>
                            <!--<el-button @click="printClick(scope.row)" type="text" :disabled="!scope.row.isStats"
                                         :tite="scope.row.isStats?'':'税单暂未生成，请耐心等待'" size="small">打印
                              </el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--列表end-->
        <!--section_footer start-->
        <el-row class="meter_style " style="padding-bottom:30px;">
            <el-col class="table_footer">
                <el-col :span="6">
                    <div class="queryKey" style="padding-top: 5px;" :rules="rules">
                        <!--<el-select class="choose_input" v-model="downFlag">
                            <el-option v-for="o in downFlagDict" :key="o.value" :value="o.value" :label="o.name"></el-option>
                        </el-select>-->
                        <el-button @click="download()" class="download"
                                   :disabled="(selectData.length && !percentageFlag) > 0 ?false:true"
                                   :class="(selectData.length > 0 && !percentageFlag)?  ' ':'disable'">下载
                        </el-button>
                        <el-button @click="exportExcel(selectData)"
                                   :disabled="(tableData && tableData.length > 0 && !percentageFlag )?false :true"
                                   class="exportBox"
                                   :class="(tableData && tableData.length > 0 && !percentageFlag ) ? '':'disable'">导出数据
                        </el-button>
                    </div>
                </el-col>
                <el-col v-if="queryData.value  == 'dateSection'" :span="18" style="text-align: right;">
                    <el-pagination
                            style="padding:5px 16px ;"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="pageLen"
                            :page-size="pageSize"
                            layout="total,sizes, prev, pager, next,jumper"
                            :total="total">
                    </el-pagination>
                </el-col>
                <el-col>
                    <el-progress v-if="percentageFlag" :percentage="percentage"></el-progress>
                </el-col>
            </el-col>
        </el-row>
        <!--section_footer end-->
        <!--调用pdf组件start-->
        <pdf :pdf-data="pdfData" @pdfSwitch="childEvent" v-if="pdfData.pdfSweich"></pdf>
        <!--调用pdf组件end-->
    </section>
</template>

<script>
    import pdf from './pdf.vue'
    import axios from 'axios';
    import Qs from 'qs'
    import ajax from '../../common/js/util';
    import {Base64} from "js-base64";
    import base64 from "js-base64"
    import {
        getDutyform,
        getDutyformaxCode,
        getDutyformCdate,
        getEnterpriseCode,
        downloadFile1,
        exportExcel1,
        gethelpHandBook
    } from "../../common/js/api"
    import api from "../../../config/index";
    //    import ElCol from "element-ui/packages/col/src/col";

    export default {
        data() {
            return {
                //查询出来的返回数据
                tableData: [
                    /*{
                        entryId: "010120151000000189",
                        taxCode: "010120151000000189-L03",
                        cDate: "2018-01-18",
                        dutyFlag: "正常税单",
                        isStats: {
                            stutas:true,
                            title:"查看并打印"
                        },
                        taxId: null,
                        printNum:"0"
                    },{//table模板数据
                        taxCode: '010120151000000190-L04',//企业编码
                        entryId: '010120151000000190',//报关单号
                        cDate: '2018-02-06',//缴款日期
                        dutyFlag: '正常税单',//税单状态
                        isStats: {
                            stutas:false,
                            title:"关区暂未开通"
                        },
                        printNum: "0"
                    },{//table模板数据
                        taxCode: '010120151000000189-L04',//企业编码
                        entryId: '010120151000000189',//报关单号
                        cDate: '2018-02-06',//缴款日期
                        dutyFlag: '正常税单',//税单状态
                        isStats: {
                            stutas:false,
                            title:"未生成税单"
                        },
                        printNum: "0"
                    }*/
                ],
                selectData: [],//选中的数据
                //pdf页面是否显示的开关
                pdfData: {//dpf对象
                    pdfSweich: false,
                    pdfObj: '',
                    printPdf: false,
                    pdfUrl: ''
                },
                //查询方式
                options: [{
                    value: "",
                    label: '报关单号',
                    type: 'text',
                    name: 'customs'
                }, {
                    value: '',
                    label: '税单号',
                    type: 'text',
                    name: 'taxBill'
                }, {
                    value: '',
                    label: '缴款日期区间',
                    type: 'date',
                    name: 'dateSection'
                }],
                //查询出来的数据
                queryData: {
                    value: 'customs',
                    label: '报关单号',
                    type: 'text',
                    name: 'customs',
                    startDate: '',
                    endDate: '',
                    customs: '',
                    taxBill: '',
                },
                //验证规则
                rules: {
                    taxBill: [
                        {required: true, message: '请您输入税单号', trigger: 'blur'},
                        {min: 22, max: 22, message: '长度为22位字符', trigger: 'blur'},
                    ],
                    customs: [
                        {required: true, message: '请您输入报关单号', trigger: 'blur'},
                        {min: 18, max: 18, message: '长度为18位字符', trigger: 'blur'},
                    ],
                    startDate: [
                        {required: true, message: '请您选择开始时间', trigger: 'blur', type: 'date'},
                    ],
                    endDate: [
                        {required: true, message: '请您选择结束时间', trigger: 'blur', type: 'date'},
                    ]
                },
                //时间限制对象
                pickerBeginDateBeAfter: {//点击开始按钮，能选择结束时间之前的三个月
                    disabledDate: (time) => {
                        let beginDateVal = this.queryData.endDate;
                        let threeMonthTime = this.threeMonth(beginDateVal, false);
                        if (beginDateVal) {
                            return time.getTime() < 1514736000000 || time.getTime() > beginDateVal.getTime() || time.getTime() < threeMonthTime.getTime();
                        }
                        return time.getTime() < 1514736000000
                    }
                },
                pickerBeginDateAfter: {//点击结束按钮的时候，能选择开始时间之后的三个月
                    disabledDate: (time) => {
                        let beginDateVal = this.queryData.startDate;
                        let threeMonthTime = this.threeMonth(beginDateVal, true);
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal.getTime() || time.getTime() > threeMonthTime.getTime();
                        }
                    }
                },
                //分页对象
                page: {
                    /*endCnt  : 15//结束条数
                    startCnt :  0//开始条数
                    totalNum :  34*///总条数
                },
                //总数据长度；3
                total: 0,
                //每页显示条数
                pageLen: [5, 10, 20, 50],
                //默认显示那一页
                currentPage: 1,
                //默认显示每页显示多少
                pageSize: 20,
//                totlepage: null,
//                urlStr: localStorage.getItem('ApiUrl'),
                //加载开关
                loading: false,
                //打印提示问题
                showWarm: false,
                //是否查询过状态
                checkStatus: false,
                //用户提示开关
//                user_hint_switch: localStorage.getItem("showHint") == "true" ? true : false,
                /* downFlagDict:[{//打印出来的dict
                    name:"PDF",
                    value:1,
                },{
                    name:"XBRL",
                    value:2,
                },{
                    name:"PDF和XBRL",
                    value:3,
                }],
                downFlag:3*/
                //通告start
                animate: false,
                items: [
                    {"name": "1.必须插入收发货人的IC卡"},
                    {"name": "2.打印请使用A5纸打印"},
                    {"name": "3.推荐使用谷歌浏览器"},
                    {"name": "4.必须电子支付的税单才可下载"}
                ],
                //通告end
                //关区代码字段
                enterpriseCode: "",
                //进度条进度
                percentage: 0,
                percentageFlag: false
            }
        },
        watch: {},
        created() {//页面初始化前
            setInterval(this.scroll, 2000);//设置滚动播放间隔
            getEnterpriseCode().then(res => {//获取IC卡企业编码
                if (res.data.flag == "1") {
                    this.enterpriseCode = res.data.resultData
                }
            }).catch(err => {
                console.log("错误信息:", err)
            })
        },
        computed: {},
        methods: {
            //pdf点击事件单行点击事件
            handleClick(row) {
//                console.log(row)
                if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();//是否能获取到Apiurl,不能获取到就刷新页面
                this.pdfData.pdfSweich = true;
                this.pdfData.pdfObj = row.taxCode;
//                this.pdfData.pdfUrl=localStorage.getItem('ApiUrl')+'/pdfFileDemo/taxFile-1'
                this.pdfData.pdfUrl = localStorage.getItem('ApiUrl') + '/showPDF/taxFile-1'
            },
            printClick(row, index) {
                if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                if (row == undefined) {
                    return this.$message({
                        message: "请选择正确的税单",
                        type: "warning",
                        duration: 2000
                    })
                }
                let arr = [];
                if (row.length >= 1 & row.length != undefined) {
                    for (let i = 0, len = row.length; i < len; i++) {
                        if (row[i].isStats) {
//                          row[i].printNum = "第" + ((parseInt(row[i].printNum.match(/[0-9]+/)) + 1) || 1) + "次打印";
                            arr.push(row[i].taxCode)
                        }
                    }
                } else {
//                  row.printNum = "第" + ((parseInt(row.printNum.match(/[0-9]+/)) + 1) || 1) + "次打印";
                    arr.push(row.taxCode);
                }
                this.pdfData.pdfSweich = true;
                this.pdfData.printPdf = true;
                this.pdfData.pdfObj = arr;
                this.pdfData.index = index;
                this.pdfData.pdfUrl = (localStorage.getItem('ApiUrl') || api.dev.proxyTable["/api"].target ) + '/showPDF/taxFile-1';
            },
            //每页显示多少数据
            handleSizeChange(val) {
                if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                this.pageSize = val;
                if (this.total) {
                    this.loading = true;//显示加载状态
                    let dataObj = {};//创建一个请求参数对象
//                    let urlString = '';
                    let startDate = null;//清空开始时间或创建
                    let endDate = null;
                    this.currentPage = 1;//重置当前页为1;
                    this.selectData = [];//清空选中的行数据

                    if (this.queryData.value === 'dateSection') {//时间区间查询
//                        urlString = localStorage.getItem('ApiUrl') + "/Dutyform/cDate";
                        startDate = this.queryData.startDate;
                        endDate = this.queryData.endDate;
                        dataObj.startCnt = this.pageSize * (this.currentPage - 1) + 1;
                        dataObj.endCnt = this.pageSize * (this.currentPage - 1) + this.pageSize;
                        dataObj.startDate = this.getTime(startDate);
                        dataObj.endDate = this.getTime(endDate);
                        this.post(dataObj)
                    }
                }
            },
            //切换分页函数
            handleCurrentChange(val) {
                if (this.total) {
                    if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                    this.loading = true;
                    let dataObj = {};
//                    let urlString = '';
                    this.currentPage = val;
                    this.selectData = [];
                    if (this.queryData.value === 'dateSection') {//时间区间查询
//                        urlString = localStorage.getItem('ApiUrl') + "/Dutyform/cDate";
                        let startDate = this.queryData.startDate;
                        let endDate = this.queryData.endDate;
                        dataObj.startCnt = this.pageSize * (this.currentPage - 1) + 1;
                        dataObj.endCnt = this.pageSize * (this.currentPage - 1) + this.pageSize;
                        dataObj.startDate = this.getTime(startDate);
                        dataObj.endDate = this.getTime(endDate);
                        this.post(dataObj)
                    }
                }
            },
            //select选择改变事件,清空input框数据
            changetext(value) {
                this.queryData.customs = '';
                this.queryData.taxBill = '';
                this.queryData.startDate = '';
                this.queryData.endDate = '';
                this.queryData.value = value;
                this.tableData = [];
                this.selectData = [];
                this.total = 0;
                this.$refs['queryForm'].resetFields()
            },
            /**
            * 请求分类状态重置,获取
            * */
            gettableData(queryForm) {
                this.tableData = [];//清空之前请求的数据
                this.selectData = [];//清空选中的数据
                this.currentPage = 1;
                this.total = 0;//重置总条数
                this.$refs[queryForm].validate((valid) => {//验证结果
                    if (valid) {
                        if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                        this.loading = true;
                        let dataObj = {};
                        let urlString = '';//没用了
                        if (this.queryData.value === 'customs') {//报关单号data和url
                            dataObj.entryId = this.queryData.customs;
                            getDutyform(dataObj).then((res) => {
                                //console.log(res)
                                let data1 = res.data;
                                if (data1.flag == "1" && data1.resultData.data !== null) {
                                    let ary = data1.resultData;
                                    //console.log(this.tableData)
                                    if (ary.taxCode) {
                                        ary = [ary];
                                    }
                                    for (let i = 0; i < ary.length; i++) {
                                        ary[i].isStats = this.taxStutas(ary[i]);
                                        //ary[i].dutyFlag = ary[i].dutyFlag.indexOf('-') != "-1"?'正常税单':'补税税单';
                                        ary[i].printNum = ary[i].printNum !== 0 ? "第" + ary[i].printNum + '次打印' : '未打印';
                                    }
                                    this.tableData = ary
                                    this.checkStatus = true;


                                } else {
                                }
                                this.loading = false;
                            }).catch((err) => {
                                console.error(err)
                            })
                        }
                        if (this.queryData.value === 'taxBill') {//税单号查询
                            dataObj.taxCode = this.queryData.taxBill;
                            getDutyformaxCode(dataObj).then((res) => {
                                let data1 = res.data;
                                if (data1.flag == "1" && data1.resultData.data !== null) {
                                    let ary = data1.resultData;
                                    if (ary.taxCode) {
                                        ary = [ary];
                                    }
                                    for (let i = 0; i < ary.length; i++) {
                                        ary[i].isStats = this.taxStutas(ary[i]);
                                        //ary[i].dutyFlag = ary[i].dutyFlag.indexOf('-') != "-1"?'正常税单':'补税税单';
                                        ary[i].printNum = ary[i].printNum !== 0 ? "第" + ary[i].printNum + '次打印' : '未打印';
                                    }
                                    this.tableData = ary
                                    this.checkStatus = true;
                                } else {
                                }
                                this.loading = false;
                            }).catch((err) => {
                                console.error(err)
                            })
                        }
                        if (this.queryData.value === 'dateSection') {//时间区间查询
//                            urlString = localStorage.getItem('ApiUrl') + "/Dutyform/cDate";
                            let startDate = this.queryData.startDate;
                            let endDate = this.queryData.endDate;
                            dataObj.startCnt = this.pageSize * (this.currentPage - 1) + 1;
                            dataObj.endCnt = this.pageSize * (this.currentPage - 1) + this.pageSize;
                            dataObj.startDate = this.getTime(startDate);
                            dataObj.endDate = this.getTime(endDate);
                            this.post(dataObj)
                        }
                    } else {
                        this.loading = false;
//                        console.log("验证失败")
                        return false
                    }
                })

            },
            /**
             * 之前的get请求,现在没用到
            * @url : 请求路径
            * @o : 请求参数
            * */
            get(url, o) {
                //.log(url, o)
                for (let v in o) {
                    url = url + "&" + v + "=" + o[v]
                }
                axios({
                    method: 'get',
                    url: url,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                        "isAjax": "true"
                    },
                }).then((response) => {
                    //console.log(response)
                    let data1 = response.data;
                    if (data1.flag == "1" && data1.resultData.data !== null) {
                        let ary = data1.resultData;
                        //console.log(this.tableData)
                        if (ary.taxCode) {
                            ary = [ary];
                        }
                        for (let i = 0; i < ary.length; i++) {
                            ary[i].isStats = ary[i].isStats === '1' ? true : false;
                            //ary[i].dutyFlag = ary[i].dutyFlag.indexOf('-') != "-1"?'正常税单':'补税税单';
                            ary[i].printNum = ary[i].printNum !== 0 ? "第" + ary[i].printNum + '次打印' : '未打印';
                        }
                        this.tableData = ary
                        this.checkStatus = true;


                    } else {
                        /*this.$message({
                            message:"未查询到相关数据",
                            duration:2000
                        })*/
                    }
                    this.loading = false;
                }).catch((error) => {
                    console.error(error);
                    this.loading = false
                    if (error.response == undefined) {//解决重定向问题error.response.status == 0 || error.response.status == 302 ||
                        window.location.href = localStorage.getItem('jumpUrl');
                    } else if (error.response.status == 403) {
                        this.$alert('请用户使用IC卡登录', '消息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                window.location.href = localStorage.getItem('jumpUrl');
                            }
                        })
                    }
                })
            },
            /**
             * 按日期区间查询接口
            * @o : 请求对象,对象值参考api
            * */
            post(o) {
//                let Ob = JSON.stringify(o);
                getDutyformCdate(o).then((res) => {
                    let data1 = res.data;
                    //console.log(data1)
                    if (data1.flag == "1" && data1.resultData.data !== null) {
                        let ary = data1.resultData.data;
                        for (let i = 0; i < ary.length; i++) {
                            ary[i].isStats = this.taxStutas(ary[i]);
                            //ary[i].dutyFlag = ary[i].dutyFlag.indexOf('-') != "-1"?'正常税单':'补税税单';
                            ary[i].printNum = ary[i].printNum !== 0 ? "第" + ary[i].printNum + '次打印' : '未打印';
                        }
                        this.tableData = ary
                        this.total = data1.resultData.page.totalNum;
                        this.page = data1.resultData.page
                        this.loading = false;
                        this.checkStatus = true;
                    } else {
                        /*this.$message({
                            message:"未查询到相关数据",
                            duration:2000
                        })*/
                    }

                    this.loading = false;
                }).catch((err) => {
                    console.error(err)
                })
            },//post请求；
            /**
             * 子组件向副组件回传参数
            * 把子组件用户操作状态同步到父组件,当前行的打印次数,
            * */
            childEvent(data) {
//                console.log(data);
                this.pdfData = data;
                if (data.printStatus) {//这个值是临时造的
                    this.tableData[data.index].printNum = "第" + ((parseInt(this.tableData[data.index].printNum.match(/[0-9]+/)) + 1) || 1) + "次打印";
                    delete this.pdfData.printStatus//清空打印状态以免第二次打印的时候还会增加次数
                }
//                console.log(this.pdfData);
            },
            //时间格式转换;
            getTime(time) {
                if (time != null && time != "" && time != undefined) {
                    let date = time
                    let y = date.getFullYear()
                    let M = date.getMonth() + 1;
                    if (M < 10) {
                        M = "0" + M;
                    }
                    let d = date.getDate()
                    if (d < 10) {
                        d = "0" + d;
                    }
//                console.log(y +'-'+ M +"-"+d);
                    return y + '-' + M + "-" + d;
                }
            },
            //获取selection的选中状态
            handleSelectionChanges(val) {
//                this.selectData = val;
                if (val) {
                    this.selectData = val;
                } else {
                    this.selectData = null;
                }
//                console.log(this.selectData)
            },
            /**
             * 导出函数
            * 和下载相同
            * */
            exportExcel(data) {
                //console.log(this.queryData)
                if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                this.updataProgressBar()
                let sendData = {
                    queryType: (this.queryData.value == "customs" ? "1" : (this.queryData.value == "taxBill" ? "2" : "3" )),
                    startDate: this.getTime(this.queryData.startDate),
                    endDate: this.getTime(this.queryData.endDate),
                    taxCode: this.queryData.taxBill,
                    entryId: this.queryData.customs
                };
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        if (this.checkStatus && this.tableData.length > 0) {
                            exportExcel1(sendData).then(res => {
                                //console.log(res);
                                this.downloadFile(res);
                                this.percentage = 100;
//                                this.percentageFlag = false;
                            }).catch(err => {
                                this.$message.error("导出excel文件失败,原因:" + err)
                                this.hiddenProgressBar()
                            })
                        } else {
//                            this.$message({
//                                message:"未查询到相关数据",
//                                duration:2000
//                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            /**
             * 下载请求
            * */
            download(url) {
                if (!localStorage.getItem('ApiUrl') && localStorage.getItem("ApiUrl") !== "") return window.location.reload();
                this.updataProgressBar()
                let taxCodeAry = this.selectData//获取选中行的数据;
                //console.log(taxCodeAry);
                if (taxCodeAry.length !== 0) {
                    let taxCodes = [];
                    for (let i = 0; i < taxCodeAry.length; i++) {
                        taxCodes.push(taxCodeAry[i].taxCode)//获取选中行的税单号
                    }
                    let sendData = {taxCodes: taxCodes.join(",")};
                    //console.log(sendData)
                    downloadFile1(sendData).then(res => {
                        //console.log(res)
                        this.downloadFile(res);
                        this.percentage = 100;//加载进度值调整为100;
                    }).catch(err => {
                        this.$message.error("下载失败,原因:" + err)
                        this.hiddenProgressBar()
                        //console.error(err)
                    })
                } else {
                    this.$message({
                        message: "请选择要下载的数据",
                        duration: 2000
                    })
                }

            },
            /**
             * 浏览器下载文件
            * @res : 后台返回的文件流
            * 用的是H5 的 blob对象 通过a标签下载,做了兼容
            **/
            downloadFile(res) {
                let url = window.URL.createObjectURL(res.data);
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {//兼容IE浏览器,
                    window.navigator.msSaveOrOpenBlob(res.data, res.headers["filename"])
                } else {
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = url;
                    a.download = decodeURIComponent(res.headers["filename"]);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            },
            /**
             * input框值发生改变的时候,重置查询状态
            * */
            valueChange(val) {
                this.checkStatus = false
            },
            /**
             * 获取当前行的可选状态
            * @row : 当前行的数据
            * */
            selectStatus(row) {
                if (row.isStats.stutas)
                    return true
                else
                    return false
            },
            /**
             * 设置一个月的时间区间
             * @beginDateVal : 获取的时间戳;
             * @flag : true为选择开始时间,设置结束时间;
             * */
            threeMonth(beginDateVal, flag) {
                if (beginDateVal) {
                    let three = new Date(beginDateVal.getTime());
                    if (flag) {
                        three.setMonth(three.getMonth() + 1);
                    } else {
                        three.setMonth(three.getMonth() - 1);
                    }
                    return three
                }
            },
            /**
             * 通知轮播条
             * */
            scroll() {
                this.animate = true;
                setTimeout(() => {
                    this.items.push(this.items[0]);
                    this.items.shift();
                    this.animate = false
                }, 1000)
            },
            /**
             * 进度条模拟增加
             * */
            updataProgressBar() {
                this.percentageFlag = true;
                this.percentage = 0;
                clearTimeout(percentage)
                let percentage = setInterval(() => {
                    if (this.percentage >= 100) {//进度条大于100的时候清除定时器,并隐藏
                        clearTimeout(percentage)
                        return this.hiddenProgressBar()
                    }
                    this.percentage++
                }, 1800)
            },
            /**
             * 隐藏进度条
             */
            hiddenProgressBar() {
                setTimeout(() => {
                    this.percentageFlag = false;
                }, 1000)
            },
            /**
             * 判断税单状态
            * @data : 当前行的值
            * */
            taxStutas(data) {
                let returnData = {
                    stutas: true,
                    title: '查看并打印'
                };
                for (let key in data) {
                    switch (key) {
                        case "openFlag" :
                            if (data.openFlag === "0") {
                                returnData.stutas = false;
                                returnData.title = "关区暂未开通"
                                break
                            }

                        case "payTypeFlag" :
                            if (data.payTypeFlag === "0") {
                                returnData.stutas = false;
                                returnData.title = "非电子支付"
                                break

                            }
                        case "isStats" :
                            if (data.isStats === "0") {
                                returnData.stutas = false;
                                returnData.title = "税单暂未生成"
                                break
                            }
                        default :
                            break
                    }
                }
                return returnData
            },
            /**下载帮助文档
            * */
            gethelp(){
                gethelpHandBook().then(res=>{
//                    console.log(res);
                    if(res.data.type ==="application/pdf"){
                        res.headers["filename"] = "互联网+海关电子税单系统操作手册.pdf";
                        this.downloadFile(res)
                    }
                }).catch(err=>{
                    console.error(err)
                })
            }
        },
        components: {
//            ElCol,
            pdf
        },
        filters: {}
    }
</script>

