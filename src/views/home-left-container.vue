<template>
    <div class="home-left-container">
        <div class="home-left-container-time">
            <img class="home-left-container-icon" src="../assets/page/home-left-time.png" alt="" />
            <div class="home-left-container-weather-desc">
                <span class="_clock_time">{{ when }}</span>
                <span class="_clock_time-bold">{{ time }}</span>
            </div>
        </div>
        <div class="home-left-container-weather">
            <div class="home-left-container-weather-icon">
                <i class="home-left-container-icon time" :class="{ [wetherIcon]: true }"></i>
            </div>
            <div class="home-left-container-weather-desc">
                <span class="_clock_time-bold"
                    >{{ weather?.realtime?.temperature }}&#8451;{{ weather?.realtime?.info }}</span
                >
                <span class="_clock_time"
                    >{{ weather?.realtime?.direct }} {{ weather?.realtime?.power }}</span
                >
            </div>
        </div>
        <div class="home-left-container-desc">
            <div class="home-left-container-desc-head"></div>
            <span class="home-left-container-desc-name">{{ userData?.roleName }}</span>
            <span class="home-left-container-desc-name">{{ userData?.userPhone ?? '无' }}</span>
            <span class="home-left-container-desc-name">{{ userData?.userName }}</span>
        </div>
        <div class="sign-out" @click="sign_out">退出登录</div>
    </div>
</template>

<script>
import { cookie, getWid, parseTime } from '../utils/common';
import { queryWeather } from '../api/login';
import { mapState } from 'vuex';
import { ElMessageBox } from 'element-plus';

export default {
    name: 'HomeLeftContainer',
    data() {
        return {
            time: '', // 时间
            when: '', //  时间
            date: '', // 星期几,
            weather: null
        };
    },
    methods: {
        sign_out() {
            // 登录到期
            ElMessageBox.confirm('确定退出', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    cookie('remove', 'token');
                    localStorage.clear();
                    location.reload();
                })
                .catch(() => {
                    // cookie("remove", "token");
                    // localStorage.clear()
                    // location.reload();
                });
        },
        getTime() {
            this.timer = setInterval(() => {
                this.time = parseTime(new Date(), '{h}:{i}:{s}');
                this.when = parseTime(new Date(), '{y}-{m}-{d}');
                this.date = parseTime(new Date(), '星期{a}');
            }, 1000);
        },
        getQueryWeather() {
            queryWeather({
                cityName: '南京'
            }).then((res) => {
                console.log(res);
                this.weather = res;
            });
        }
    },
    computed: {
        wetherIcon() {
            if (!this.weather || !this.weather.realtime) return '';
            return getWid(this.weather.realtime.wid);
        },
        ...mapState({
            userData: (state) => state.user.userData
        })
    },
    created() {
        console.log(this.userData);
        this.getTime();
        this.getQueryWeather();
    }
};
</script>

<style lang="scss" scoped>
.home-left-container {
    color: #ffffff;
}

.home-left-container-time {
    display: flex;
    margin: column-width(100) auto;
    justify-content: center;
    width: column-width(258);
    height: column-width(78);
}

.home-left-container-weather {
    display: flex;
    margin: column-width(100) auto;
    justify-content: center;
    width: column-width(258);
    height: column-width(80);
}

.home-left-container-icon {
    display: inline-block;
    width: column-width(78);
    height: column-width(78);
    margin-right: column-width(20);
    background-size: 100% 100%;
}

.home-left-container-weather-desc {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    vertical-align: text-top;
    margin-top: -5px;
}

._clock_time {
    display: inline-block;
    line-height: 20px;
    font-size: 12px;
    width: 100%;
    color: #ffffff;
}

._clock_time-bold {
    display: inline-block;
    line-height: 20px;
    font-size: 16px;
    width: 100%;
    color: #ffffff;
}

.home-left-container-weather-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-left-container-desc {
    margin-top: column-width(185);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .home-left-container-desc-head {
        width: column-width(200);
        height: column-width(200);
        background: url('../assets/page/home-left-head.png');
        background-size: 100% 100%;
        margin-bottom: column-width(55);
    }

    .home-left-container-desc-name {
        width: 100%;
        text-align: center;
        margin-bottom: column-width(25);
    }
}
.sign-out {
    width: column-width(280);
    height: column-width(80);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: column-width(140) auto 0 auto;
    border: 1px solid #ffffff;
    border-radius: 5px;
    background: #152435;
    box-shadow: 0 0 column-width(40) #62a2cd inset;
    letter-spacing: 2px;
    //280*80按钮
}
</style>
