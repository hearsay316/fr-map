<template>
  <div class="home-left-container">
    <div class="home-left-container-time">
      <img class="home-left-container-icon" src="../assets/page/home-left-time.png" alt="">
      <div class="home-left-container-weather-desc">
        <span class="_clock_time">{{ when }}</span>
        <span class="_clock_time-bold">{{ time }}</span>
      </div>
    </div>
    <div class="home-left-container-weather">
      <div class="home-left-container-weather-icon">
        <img class="home-left-container-icon" src="../assets/page/home-left-time.png" alt="">
      </div>
      <div class="home-left-container-weather-desc">
        <span class="_clock_time-bold">25℃晴</span>
        <span class=" _clock_time">西风 2级</span>
      </div>
    </div>
    <div class="home-left-container-desc">
        <div class="home-left-container-desc-head"></div>
      <span class="home-left-container-desc-name">张立群</span>
      <span class="home-left-container-desc-name">15655219250</span>
      <span class="home-left-container-desc-name">张立群</span>
    </div>
  </div>
</template>

<script>
import {parseTime} from "../utils/common";
import {queryWeather} from "../api/login";

export default {
  name: "home-left-container",
  data() {
    return {
      time: "", // 时间
      when: "", //  时间
      date: "", // 星期几
    }
  },
  methods: {
    getTime() {
      this.timer = setInterval(() => {
        this.time = parseTime(new Date(), "{h}:{i}:{s}");
        this.when = parseTime(new Date(), "{y}-{m}-{d}");
        this.date = parseTime(new Date(), "星期{a}");
      }, 1000);
    },
    getQueryWeather() {
      queryWeather({
        cityName: "南京"
      }).then(res => {
        console.log(res);
        this.weather = res;
      });
    },
  },
  created() {
    this.getTime()
    this.getQueryWeather()
  }
}
</script>

<style lang="scss" scoped>
.home-left-container {
  color: #ffffff;
}

.home-left-container-time {
  display: flex;
  margin:column-width(100) auto;
  justify-content: center;
  width: column-width(258);
  height: column-width(78);
}
.home-left-container-weather{
  display: flex;
  margin:column-width(100) auto;
  justify-content: center;
  width: column-width(258);
  height: column-width(80);
}
.home-left-container-icon {
  display: inline-block;
  width: column-width(78);
  height: column-width(78);
  margin-right: column-width(20);
}
.home-left-container-weather-desc{
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
._clock_time-bold{
  display: inline-block;
  line-height: 20px;
  font-size: 16px;
  width: 100%;
  color: #ffffff;
}
.home-left-container-weather-icon{
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-left-container-desc{
  margin-top: column-width(185);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .home-left-container-desc-head{
    width: column-width(200);
    height: column-width(200);
    background: url("../assets/page/home-left-head.png");
    background-size: 100% 100%;
    margin-bottom: column-width(55);
  }
  .home-left-container-desc-name{
    width: 100%;
    text-align: center;
    margin-bottom: column-width(25);
  }
}
</style>
