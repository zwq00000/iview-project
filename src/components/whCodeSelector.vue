<template>
    <Select v-model="whCode" @on-change="handleChange" filterable>
        <Option v-for="item in whCodes" :value="item.whCode" :key="item.whCode" :placeholder="label">
            <span>{{item.whName}}</span>
            <span class="itemDesc">{{item.whCode}}</span>
        </Option>
    </Select>
</template>

<script>
import api from '@/api/WarehouseApi';
export default {
    data(){
        return{
            loading:true,
            whCode:this.value,
            whCodes:[]
        };
    },
    props: {
        value: String,
        label: {type: String, default: '选择仓库'}
    },
    methods:{
        fetchData(){
            this.loading = true;
            api.GetWhCodes()
                .then(res=>{
                    let data = res.data;
                    this.whCodes = data;
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false;
                    this.$Notice.warning({
                        title:'数据加载异常',
                        desc:`数据加载失败,${err.message}`
                    });
                });
        },
        handleChange (value) {
            this.$emit('input', value);
            this.$emit('change', value);
        }
    },
    created: function(){
        this.fetchData();
    }
};
</script>

<style scope>
.itemDesc {
    float:right;color:#ccc
}
</style>
