<!-- 年度库存总账 -->
<template>
    <div>
        <Row :gutter="16">
            <Col span="10"><Form inline :label-width="80">
                <FormItem label="选择仓库:">
                    <WhCodeSelector v-model="whCode" />  
                </FormItem>
            </Form>
            </Col>
            <Col span="4">
                <Button type="primary" icon="icon-refresh" v-on:click="fetchData()">刷新</Button>
            </Col>
            <Col span="4">
                <Dropdown trigger="click" @on-click="handleDrpodown">
                    <a href="javascript:void(0)">更多操作<Icon type="arrow-down-b"></Icon></a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="createAccount"><Icon type="android-create"/>生成全年库存总账</DropdownItem>
                        <DropdownItem><a :href="exportCsvLink" divided><Icon type="ios-download"/>导出 CSV 文件 ...</a></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
      </Row>
    <Table :loading="loading" :columns="columns" :data="data" ref="table"></Table>
    <Page @on-change="handleCurrentChange" :current-page="page.page" :page-size="page.pageSize" :total="page.total"></Page>
  </div>
</template>

<script>
//import { Table,Button,Dialog } from "element-ui";
import WhCodeSelector from '@/components/WhCodeSelector';
import api from '@/api/TotalAccountApi';

export default {
    data() {
        return {
            whCode: 'ZCK',
            accMonth:'',
            page: api.pageOptions, //{ page: 1, pageSize: 20 },
            loading: true,
            columns:[
                { key:'whCode' ,title:'仓库代码' },
                { key:'invCode' ,title:'存货代码'},
                { key:'summary' ,title:'说明' },
                { key:'beginQuantity' ,title:'期初数量' },
                { key:'incomeQuantity' ,title:'入库数量' },
                { key:'sentOutQuantity' ,title:'出库数量' },
                { key:'balanceQuantity' ,title:'结存数量' }
            ],
            data: []
        };
    },
    props:{
        /**
         * 账套年度
         */
        year:Number
    },
    computed:{
        month (){
            if(!this.accMonth){
                return 1;    
            }
            return this.accMonth.getMonth();
        },
        exportCsvLink(){
            return api.getExportCsvLink(this.whCode,this.year);
        }
    },
    methods: {
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.page = val;
            this.fetchData();
        },
        handleDrpodown(item){
            if(item === 'createAccount'){
                this.createFullYearAccount();
            }
        },
        /**
         * 创建全年库存总账
         */
        createFullYearAccount(){
            if(this.data.length>0){
                return;
            }
            this.loading = true;
            api.createFullYear(this.whCode,this.year)
                .then(res=>{
                    this.fetchData();
                    this.loading = false;
                });
        },
        /**
         * 导出数据
         */
        exportData(){
            this.$refs.table.exportCsv({
                filename: `${this.whCode}${this.year} 年度库存总账`,
                original: false
            });
        },
        /**
         * 加载 工件 数据
         */
        fetchData: function() {
            this.loading = true;
            api.getFullYear(
                this.whCode,
                this.year,
                this.page
            )
                .then(res => {
                    let data = res.data;
                    this.data = data.values;
                    this.page = data.page;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.$Notice.warning({
                        title: '提示',
                        desc: `数据加载失败,${err.message}`
                    });
                });
        }
    },
    components: {
        WhCodeSelector
    },
    created() {
        this.accMonth = new Date(this.year,1,1);
        this.fetchData();
    }
};
</script>

<style>
</style>
