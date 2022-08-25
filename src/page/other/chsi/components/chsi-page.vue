<script setup>
// const userInfo = {
//   date: formatDate(new Date()),
//   // ===
//   name: 'super man',
//   avatar: 'https://assets.fedtop.com/picbed/202208251142290.png',
//   // ===
//   gender: 'male',
//   IDNumber: '350781196403000000',
//   // ===
//   nationality: 'Han nationality',
//   birthday: 'February 1, 1998',
//   // ===
//   school: 'Tsinghua University',
//   level: 'Undergraduate',
//   // ===
//   faculty: '111111111',
//   class: '22222',
//   // ====
//   specialized: 'Computer Science and Technology',
//   studentId: randomNumber(12),
//   // ====
//   form: 'full-time',
//   AdmissionTime: 'February 1, 2021',
//   AcademicSystem: '3 years',
//   // ====
//   type: 'general higher education',
//   graduationTime: 'January 1, 2025',
//   // ========
//   code: randomString(15),
// }

defineProps({
  userInfo: {
    type: Object,
    default: () => {},
  },
})
</script>

<!-- TODO 学信网这写的屎一样的代码 -->
<template>
  <div id="printContainer" class="clearfix">
    <div class="tableTitle">
      Ministry of Education student status online verification report
      <br />
    </div>
    <p style="text-align: center; font-size: 18px">
      Update Date:{{ userInfo.updateDate }}
    </p>
    <div class="div1">
      <div class="div2" style="width: 800px">
        <div class="div3" style="width: 800px">
          <div id="fixedPart">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td width="100" class="title1">Name</td>
                  <td colspan="3">
                    <div style="position: relative">
                      <span style="position: absolute; top: 10px; left: 10px">
                        {{ userInfo.name }}
                      </span>
                      <img
                        class="by_img"
                        src="./bg.png"
                        width="478"
                        height="43"
                      />
                    </div>
                  </td>
                  <td rowspan="3" width="93">
                    <div style="position: relative; width: 93px; height: 131px">
                      <img
                        id="photoPositonBG"
                        src="./photo_cn_lq.jpg"
                        width="93"
                        height="131"
                      />
                      <img
                        id="photoPositon"
                        :src="userInfo.avatar"
                        width="84.0"
                        height="112.0"
                        style="left: 4.5px; top: 3px"
                      />
                    </div>
                    <!-- 头像不存在 -->
                  </td>
                </tr>
                <tr>
                  <td class="title1" width="53">gender</td>
                  <td width="116">
                    <div class="cnt1">{{ userInfo.gender }}</div>
                  </td>
                  <td width="120" class="title1">ID number</td>
                  <td width="277">
                    <div class="cnt1">{{ userInfo.IDNumber }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="title1">nationality</td>
                  <td>
                    <div class="cnt1">{{ userInfo.nationality }}</div>
                  </td>
                  <td class="title1">date of birth</td>
                  <td>
                    <div class="cnt1">{{ userInfo.birthday }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td width="100" class="title1">colleges</td>
                  <td colspan="3">
                    <div class="cnt1">{{ userInfo.school }}</div>
                  </td>
                  <td width="100" class="title1">level</td>
                  <td width="173">
                    <div class="cnt1">
                      {{ userInfo.level }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="title1">Faculty</td>
                  <td colspan="3">
                    <div class="cnt1">{{ userInfo.faculty }}</div>
                  </td>
                  <td class="title1">class</td>
                  <td>
                    <div class="cnt1">{{ userInfo.class }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="title1">specialized</td>
                  <td colspan="3">
                    <div class="cnt1">
                      {{ 'Computer Science and Technology' }}
                    </div>
                  </td>
                  <td class="title1">student ID</td>
                  <td>
                    <div class="cnt1">{{ userInfo.studentId }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="title1">form</td>
                  <td width="116">
                    <div class="cnt1">{{ 'full-time' }}</div>
                  </td>
                  <td width="110" class="title1">Admission time</td>
                  <td width="140">
                    <div class="cnt1">{{ userInfo.AdmissionTime }}</div>
                  </td>
                  <td class="title1">Academic system</td>
                  <td>
                    <div class="cnt1">{{ userInfo.AcademicSystem }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="title1">type</td>
                  <td>
                    <div class="cnt1">
                      {{ userInfo.type }}
                    </div>
                  </td>
                  <td class="title1">student status</td>
                  <td colspan="3">
                    <div class="cnt1">
                      Registered student status
                      <br />
                      (estimated graduation date:
                      {{ userInfo.graduationTime }})
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="erWeiPart">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style=""
            >
              <tbody>
                <tr>
                  <td
                    width="140"
                    class="title1"
                    style="height: 200px; line-height: 20px"
                  >
                    Online verification
                  </td>
                  <td>
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="table_zxyz"
                    >
                      <colgroup>
                        <col width="170" />
                        <col width="250" />
                        <col width="150" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>
                            <div class="vcode-block">
                              <span class="cn_font2 vcode-detail">
                                {{ userInfo.code }}
                              </span>
                              <br />
                              <span class="vcode-title">
                                Online verification
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <img
                                src="./mini-program.jpg"
                                width="130"
                                style="margin: 0 auto"
                              />
                              <span>
                                <img
                                  src="./mini01.png"
                                  style="height: 12px; margin: 0 auto"
                                  title="微信扫一扫，使用小程序"
                                  alt="微信扫一扫，使用小程序"
                                />
                              </span>
                              <span>
                                1. Scan the code to get the "Xuexin Report
                                Online Verification" applet
                              </span>
                            </div>
                          </td>
                          <td>
                            <div class="bg_ewm_div">
                              <span>
                                <img
                                  class="icon-mini"
                                  src="./qrcode.png"
                                  height="12"
                                  title="小程序扫一扫，在线验证"
                                  alt="小程序扫一扫，在线验证"
                                />
                              </span>
                              <span>
                                2. Use the applet to scan the code for
                                verification
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="zysxPart">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td colspan="4">
                    <h2>Precautions：</h2>
                    <div class="zysx">
                      <table
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tbody>
                          <tr>
                            <td width="5%" valign="top">1、</td>
                            <td width="95%" valign="top">
                              The "Student Status Online Verification Report" is
                              the query result of the Ministry of Education's
                              electronic registration and filing of student
                              status.
                            </td>
                          </tr>
                          <tr>
                            <td valign="top">2、</td>
                            <td valign="top">
                              Verification method of report content: ①Click the
                              online verification code in the report (electronic
                              version) to verify online; ②Log in to the "Online
                              Verification System" of the China Higher Education
                              Student Information Network, and enter the online
                              verification code for verification; ③Use the
                              "Xuexin.com report" "Online Verification" WeChat
                              applet to scan the code for verification.
                            </td>
                          </tr>
                          <tr>
                            <td valign="top">3、</td>
                            <td valign="top">
                              If the content of the report is revised, please
                              refer to the latest online verification content.
                            </td>
                          </tr>
                          <tr>
                            <td valign="top">4、</td>
                            <td valign="top">
                              Without the consent of the owner of the student
                              registration information, the report shall not be
                              used against the will of the owner.
                            </td>
                          </tr>
                          <tr>
                            <td valign="top">5、</td>
                            <td valign="top">
                              The validity period of the report online
                              verification is set by the report owner (1~6
                              months), and the validity period of the
                              verification can be extended again before the
                              report verification expires.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="logoBot">
                      <img src="./logo.png" height="30" align="right" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import './style.css';
</style>
