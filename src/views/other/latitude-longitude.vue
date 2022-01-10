<template>
    <div class="page-container">
        <p>当前经度: {{ position.longitude }}</p>
        <p>当前纬度: {{ position.latitude }}</p>
        <p>高德转换坐标系结果: {{ position.transform }}</p>
    </div>
</template>
<!-- 当我用手机的时候，位置还是十分准确的。都快精确到小区了。所以你白天说的那个问题，一定是要硬件支持才行，我这里用了和你说的一样的gcoord.js来做转换，所以应该不是他们库的问题，其实我不转换的时候（精确到了小数点后7位），也挺准。转换后精确到了小数点后14位了。
手机我试了下,我手机拿的挺准的,pc的误差较大, -->
<script>
/* eslint-disable */
import gcoord from "gcoord";
export default {
    components: {},
    props: {},
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getPosition();
        // this.useScript({
        //     src: "https://api.map.baidu.com/getscript?v=3.0&ak=OaBvYmKX3pjF7YFUFeeBCeGdy9Zp7xB2&services=&t=20210201100830&s=1",
        // });
    },
    data() {
        return {
            PI: 3.14159265358979324,
            x_pi: (3.14159265358979324 * 3000.0) / 180.0,
            position: {
                longitude: "",
                latitude: "",
                transform: "",
            },
        };
    },
    methods: {
        getPosition() {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.position.transform = gcoord.transform(
                        [position.coords.longitude, position.coords.latitude], // 经纬度坐标
                        gcoord.WGS84, // 当前坐标系
                        gcoord.BD09 // 目标坐标系
                    );
                    console.log("高德转换坐标系结果:", this.position.transform);
                    this.position.latitude = position.coords.latitude;
                    this.position.longitude = position.coords.longitude;
                    console.log(position.coords.longitude, "😀longitude😀");
                    console.log(position.coords.latitude, "😀latitude😀");
                },
                () => {},
                {
                    // 指示浏览器获取高精度的位置，默认为false
                    enableHighAccuracy: true,
                    // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                    timeout: 5000,
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                    maximumAge: 3000,
                }
            );
            //获取当前位置，并继续返回用户移动时更新的位置信息。注：需要具有GPS的设备测试。
            window.navigator.geolocation.watchPosition(
                (position) => {
                    console.log(position.coords.longitude, "😀longitude😀");
                    console.log(position.coords.latitude, "😀latitude😀");
                },
                () => {}
            );
        },
        useScript(opts) {
            new Promise((resolve, reject) => {
                let script = document.createElement("script");
                script.type = "text/javascript";

                script.onload = function () {
                    console.log(123);
                    resolve("");
                };
                script.onerror = function (err) {
                    console.log(456);
                    reject(err);
                };

                script.src = opts.src;
                document.head.appendChild(script);
            });
        },
        delta(lat, lon) {
            // Krasovsky 1940
            //
            // a = 6378245.0, 1/f = 298.3
            // b = a * (1 - f)
            // ee = (a^2 - b^2) / a^2
            const a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
            const ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
            let dLat = this.transformLat(lon - 105.0, lat - 35.0);
            let dLon = this.transformLon(lon - 105.0, lat - 35.0);
            const radLat = (lat / 180.0) * this.PI;
            let magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            const sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
            dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
            return { lat: dLat, lon: dLon };
        },
        // WGS-84 to GCJ-02
        gcj_encrypt(wgsLat, wgsLon) {
            if (this.outOfChina(wgsLat, wgsLon)) {
                return { lat: wgsLat, lon: wgsLon };
            }
            const d = this.delta(wgsLat, wgsLon);
            return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
        },
        // GCJ-02 to WGS-84
        gcj_decrypt(gcjLat, gcjLon) {
            if (this.outOfChina(gcjLat, gcjLon)) {
                return { lat: gcjLat, lon: gcjLon };
            }
            const d = this.delta(gcjLat, gcjLon);
            return { lat: gcjLat - d.lat, lon: gcjLon - d.lon };
        },
        // GCJ-02 to WGS-84 exactly
        gcj_decrypt_exact(gcjLat, gcjLon) {
            const initDelta = 0.01;
            const threshold = 0.000000001;
            let dLat = initDelta;
            let dLon = initDelta;
            let mLat = gcjLat - dLat;
            let mLon = gcjLon - dLon;
            let pLat = gcjLat + dLat;
            let pLon = gcjLon + dLon;
            let wgsLat;
            let wgsLon;
            let i = 0;
            while (1) {
                wgsLat = (mLat + pLat) / 2;
                wgsLon = (mLon + pLon) / 2;
                const tmp = this.gcj_encrypt(wgsLat, wgsLon);
                dLat = tmp.lat - gcjLat;
                dLon = tmp.lon - gcjLon;
                if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) {
                    break;
                }

                if (dLat > 0) {
                    pLat = wgsLat;
                } else {
                    mLat = wgsLat;
                }
                if (dLon > 0) {
                    pLon = wgsLon;
                } else {
                    mLon = wgsLon;
                }
                if (++i > 10000) {
                    break;
                }
            }
            // console.log(i)
            return { lat: wgsLat, lon: wgsLon };
        },
        // GCJ-02 to BD-09
        bd_encrypt(gcjLat, gcjLon) {
            const x = gcjLon;
            const y = gcjLat;
            const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
            const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
            const bdLon = z * Math.cos(theta) + 0.0065;
            const bdLat = z * Math.sin(theta) + 0.006;
            return { lat: bdLat, lon: bdLon };
        },
        // BD-09 to GCJ-02
        bd_decrypt(bdLat, bdLon) {
            const x = bdLon - 0.0065;
            const y = bdLat - 0.006;
            const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
            const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
            const gcjLon = z * Math.cos(theta);
            const gcjLat = z * Math.sin(theta);
            return { lat: gcjLat, lon: gcjLon };
        },
        // WGS-84 to Web mercator
        // mercatorLat -> y mercatorLon -> x
        mercator_encrypt(wgsLat, wgsLon) {
            const x = (wgsLon * 20037508.34) / 180.0;
            let y = Math.log(Math.tan(((90.0 + wgsLat) * this.PI) / 360.0)) / (this.PI / 180.0);
            y = (y * 20037508.34) / 180.0;
            return { lat: y, lon: x };
            /*
            if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
            return null
            var x = 6378137.0 * wgsLon * 0.017453292519943295
            var a = wgsLat * 0.017453292519943295
            var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
            return {'lat' : y, 'lon' : x}
        */
        },
        // Web mercator to WGS-84
        // mercatorLat -> y mercatorLon -> x
        mercator_decrypt(mercatorLat, mercatorLon) {
            const x = (mercatorLon / 20037508.34) * 180.0;
            let y = (mercatorLat / 20037508.34) * 180.0;
            y = (180 / this.PI) * (2 * Math.atan(Math.exp((y * this.PI) / 180.0)) - this.PI / 2);
            return { lat: y, lon: x };
            /*
        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
        return null
        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
        return null
        var a = mercatorLon / 6378137.0 * 57.295779513082323
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0)
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323
        return {'lat' : y, 'lon' : x}
         //*/
        },
        // two point's distance
        distance(latA, lonA, latB, lonB) {
            const earthR = 6371000.0;
            const x =
                Math.cos((latA * this.PI) / 180.0) *
                Math.cos((latB * this.PI) / 180.0) *
                Math.cos(((lonA - lonB) * this.PI) / 180);
            const y = Math.sin((latA * this.PI) / 180.0) * Math.sin((latB * this.PI) / 180.0);
            let s = x + y;
            if (s > 1) {
                s = 1;
            }
            if (s < -1) {
                s = -1;
            }
            const alpha = Math.acos(s);
            const distance = alpha * earthR;
            return distance;
        },
        outOfChina(lat, lon) {
            if (lon < 72.004 || lon > 137.8347) {
                return true;
            }
            if (lat < 0.8293 || lat > 55.8271) {
                return true;
            }
            return false;
        },
        transformLat(x, y) {
            let ret =
                -100.0 +
                2.0 * x +
                3.0 * y +
                0.2 * y * y +
                0.1 * x * y +
                0.2 * Math.sqrt(Math.abs(x));
            ret +=
                ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) /
                3.0;
            ret +=
                ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) * 2.0) / 3.0;
            ret +=
                ((160.0 * Math.sin((y / 12.0) * this.PI) + 320 * Math.sin((y * this.PI) / 30.0)) *
                    2.0) /
                3.0;
            return ret;
        },
        transformLon(x, y) {
            let ret =
                300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret +=
                ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) /
                3.0;
            ret +=
                ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) * 2.0) / 3.0;
            ret +=
                ((150.0 * Math.sin((x / 12.0) * this.PI) + 300.0 * Math.sin((x / 30.0) * this.PI)) *
                    2.0) /
                3.0;
            return ret;
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
}
</style>
