(window["webpackJsonp_frontend-park"]=window["webpackJsonp_frontend-park"]||[]).push([["chunk-2d212b8a"],{aa2f:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},a=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-container"},[n("div",{attrs:{id:"webgl-output"}})])}],o=n("5a89"),r={components:{},props:{},data:function(){return{}},computed:{},watch:{},created:function(){},mounted:function(){this.init()},methods:{init:function(){var e=new o["l"],t=new o["j"](45,window.innerWidth/(window.innerHeight-60),.1,1e3);this.createAxes(e),this.createPlane(e),this.createCube(e),this.createSphere(e),this.createLight(e),this.createRenderer(e,t)},createRenderer:function(e,t){var n=new o["o"];n.setClearColor(new o["d"](0)),n.setSize(window.innerWidth,window.innerHeight-60),t.position.set(-50,50,50),t.lookAt(e.position),n.shadowMapEnabled=!0,document.getElementById("webgl-output").appendChild(n.domElement),n.render(e,t)},createLight:function(e){var t=new o["n"](16777215);t.position.set(10,40,40),t.castShadow=!0,e.add(t)},createAxes:function(e){var t=new o["a"](20);e.add(t)},createPlane:function(e){var t=new o["k"](100,100),n=new o["i"]({color:11184810}),i=new o["g"](t,n);i.rotation.x=-.5*Math.PI,i.position.set(0,0,0),i.receiveShadow=!0,e.add(i)},createCube:function(e){var t=new o["b"](4,4,4),n=new o["i"]({color:16711680}),i=new o["g"](t,n);i.position.set(5,5,5),i.castShadow=!0,e.add(i)},createSphere:function(e){var t=new o["m"](4,20,20),n=new o["i"]({color:7829503}),i=new o["g"](t,n);i.position.set(-15,5,10),i.castShadow=!0,e.add(i)}}},c=r,d=n("2877"),s=Object(d["a"])(c,i,a,!1,null,"1ac849fe",null);t["default"]=s.exports}}]);
//# sourceMappingURL=chunk-2d212b8a.4f356af4.js.map