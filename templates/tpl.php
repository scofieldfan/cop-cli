<!DOCTYPE html>
<body>
<head>
    <!--   公共样式  -->
    <?php $this->load->view('pub/header-new.php'); ?>
    <link rel="stylesheet" href="../../static/css/pages/{{=it.controller}}_{{=it.method}}.less"/>
</head>
<!--   左侧菜单和顶导  -->
<?php $this->load->view('pub/pub-new.php'); ?>
<div class="wrapper">
    <div id="mainContainer" class="{{=it.controller}}-{{=it.method}}-container" v-cloak="v-cloak">

        <div class="nav-box">
            <div class="nav">
                <div class="ks-breadcrumb">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/{{=it.controller}}/{{=it.method}}' }">一级菜单
                        </el-breadcrumb-item>
                        <el-breadcrumb-item>列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>

        <el-form ref="search" label-position="right" :model="search" label-width="100px" class="search-form" style="">

            <div class="left">
                <el-form-item label="用户ID">
                    <el-input v-model="search.OpenId" :clearable=true>
                    </el-input>
                </el-form-item>
            </div>
            <div class="left">
                <el-form-item label="创建时间">
                    <el-date-picker v-model="search.dateRange" type="daterange" placeholder="选择日期范围" :clearable=true
                                    style="min-width: 220px;width:100%;">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div>
                <div class="right">
                    <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
                    <el-button type="primary" icon="" @click="onCancel">取消</el-button>
                </div>
            </div>
        </el-form>

        <div class="table-box">
            <el-table v-loading="tableData.loading" element-loading-text="拼命加载中" :data="tableData.data" border
                      style="min-height:400px;width: 100%">

                <el-table-column prop="OpenId" label="用户ID" min-width="90" align="center"></el-table-column>

            </el-table>
            <div class="page-bar">
                <el-pagination layout="prev, pager, next" :current-page="pageNo" @current-change="handleCurrentChange"
                               :page-size="search.QueryNumber" :total="tableData.total"></el-pagination>
            </div>
        </div>

    </div>
</div>
<script>
    require('../../static/js/pages/{{=it.controller}}_{{=it.method}}.js');
</script>
</body>
</html>