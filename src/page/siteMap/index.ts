import cssList from './css.ts'
import JavaScriptList from './JavaScript.ts'
import nodeList from './node.ts'
import materialList from './material.ts'
import blogList from './blog.ts'
import personalBlogList from './personalBlog.ts'
import frontWeeklyList from './frontWeekly.ts'
import docList from './doc.ts'

export default [
  ...blogList,
  ...personalBlogList,
  ...frontWeeklyList,
  ...JavaScriptList,
  ...cssList,
  ...nodeList,
  ...materialList,
  ...docList,
  {
    name: 'Git',
    list: [
      {
        name: 'Git Branching',
        url: 'https://learngitbranching.js.org/?locale=zh_CN',
        img: '123',
        des: '通过一系列刺激的关卡挑战，逐步深入的学习 Git 的强大功能',
      },
    ],
  },
]
