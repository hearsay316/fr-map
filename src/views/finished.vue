<template>
    <div class="finished">
        <div class="home-record-item-operation-btn A cursor">设备组删除</div>
        <div class="home-record-item-operation-btn B cursor">查看作战组</div>
    </div>
</template>

<script>
export default {
    name: 'Finished'
};
</script>

<style lang="scss" scoped>
.home-record-item-operation-btn {
    text-align: center;
    border: 2px solid #7dedff;
    border-radius: 15px;
    padding: 3px 0;
}
.finished {
    .A {
        border-color: #7dedff;
        background-color: rgba(125, 237, 255, 0.2);
    }
    .B {
        border-color: #2489cd;
        background-color: rgba(36, 137, 205, 0.2);
    }
    .C {
        border-color: #68859f;
        background-color: rgba(104, 133, 159, 0.2);
    }
    .D {
        border-color: #62a2cd;
        background-color: rgba(98, 162, 205, 0.2);
    }
}
</style>
