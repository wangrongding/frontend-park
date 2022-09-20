<script setup lang="ts">
/* eslint-disable */
// @ts-nocheck
class Tree {
  constructor(qs) {
    this.C = document.querySelector(qs)
    this.c = this.C?.getContext('2d')
    this.S = window.devicePixelRatio
    this.W = 800
    this.H = 800
    this.branches = []
    this.darkTheme = false
    this.debug = false
    this.decaying = false
    this.floorY = 685
    this.fruit = []
    this.gravity = 0.098
    this.loopDelay = 500
    this.loopEnd = Utils.dateValue
    this.maxGenerations = 10

    if (this.C) this.init()
  }
  get allBranchesComplete() {
    const { branches, maxGenerations } = this

    return (
      branches.filter((b) => {
        const isLastGen = b.generation === maxGenerations
        return b.progress >= 1 && isLastGen
      }).length > 0
    )
  }
  get allFruitComplete() {
    return !!this.fruit.length && this.fruit.every((f) => f.progress === 1)
  }
  get allFruitFalling() {
    return !!this.fruit.length && this.fruit.every((f) => f.timeUntilFall <= 0)
  }
  get debugInfo() {
    return [
      { item: 'Pixel Ratio', value: this.S },
      { item: 'Branches', value: this.branches.length },
      { item: 'Branches Complete', value: this.allBranchesComplete },
      { item: 'Decaying', value: this.decaying },
      { item: 'Fruit', value: this.fruit.length },
      { item: 'Fruit Complete', value: this.allFruitComplete },
    ]
  }
  get lastGeneration() {
    const genIntegers = this.branches.map((b) => b.generation)
    return [...new Set(genIntegers)].pop()
  }
  get trunk() {
    return {
      angle: 0,
      angleInc: 20,
      decaySpeed: 0.0625,
      diameter: 10,
      distance: 120,
      distanceFade: 0.2,
      generation: 1,
      growthSpeed: 0.04,
      hadBranches: false,
      progress: 0,
      x1: 400,
      y1: 680,
      x2: 400,
      y2: 560,
    }
  }
  detectTheme(mq) {
    this.darkTheme = mq.matches
  }
  draw() {
    const { c, W, H, debug, branches, fruit } = this

    c.clearRect(0, 0, W, H)

    const lightness = this.darkTheme ? 90 : 10
    const foreground = `hsl(223,10%,${lightness}%)`
    c.fillStyle = foreground
    c.strokeStyle = foreground

    // debug info
    if (debug === true) {
      const textX = 24

      this.debugInfo.forEach((d, i) => {
        c.fillText(`${d.item}: ${d.value}`, textX, 24 * (i + 1))
      })
    }

    // branches
    branches.forEach((b) => {
      c.lineWidth = b.diameter
      c.beginPath()
      c.moveTo(b.x1, b.y1)
      c.lineTo(
        b.x1 + (b.x2 - b.x1) * b.progress,
        b.y1 + (b.y2 - b.y1) * b.progress,
      )
      c.stroke()
      c.closePath()
    })

    // fruit
    fruit.forEach((f) => {
      c.globalAlpha =
        f.decayTime < f.decayFrames ? f.decayTime / f.decayFrames : 1
      c.beginPath()
      c.arc(f.x, f.y, f.r * f.progress, 0, 2 * Math.PI)
      c.fill()
      c.closePath()
      c.globalAlpha = 1
    })
  }
  grow() {
    // start with the trunk
    if (
      !this.branches.length &&
      Utils.dateValue - this.loopEnd > this.loopDelay
    ) {
      this.branches.push(this.trunk)
    }

    if (!this.allBranchesComplete) {
      this.branches.forEach((b) => {
        if (b.progress < 1) {
          // branch growth
          b.progress += b.growthSpeed

          if (b.progress > 1) {
            b.progress = 1

            // grow fruit if the generation is the last
            if (b.generation === this.maxGenerations) {
              this.fruit.push({
                decayFrames: 18,
                decayTime: 150,
                progress: 0,
                speed: 0.04,
                timeUntilFall: Utils.randomInt(0, 300),
                x: b.x2,
                y: b.y2,
                r: Utils.randomInt(4, 6),
                restitution: 0.2 * (1 - b.y2 / this.floorY),
                yVelocity: 0,
              })
            }
          }
        } else if (!b.hadBranches && b.generation < this.maxGenerations) {
          b.hadBranches = true
          // create two new branches
          const lean = 5
          const angleLeft =
            b.angle - (b.angleInc + Utils.randomInt(-lean, lean))
          const angleRight =
            b.angle + (b.angleInc + Utils.randomInt(-lean, lean))
          const distance = b.distance * (1 - b.distanceFade)
          const generation = b.generation + 1

          const leftBranch = {
            angle: angleLeft,
            angleInc: b.angleInc,
            decaySpeed: b.decaySpeed,
            diameter: Math.floor(b.diameter * 0.9),
            distance,
            distanceFade: b.distanceFade,
            generation,
            growthSpeed: b.growthSpeed,
            hadBranches: false,
            progress: 0,
            x1: b.x2,
            y1: b.y2,
            x2: b.x2 + Utils.endPointX(angleLeft, distance),
            y2: b.y2 - Utils.endPointY(angleLeft, distance),
          }

          const rightBranch = { ...leftBranch }
          rightBranch.angle = angleRight
          rightBranch.x2 = b.x2 + Utils.endPointX(angleRight, distance)
          rightBranch.y2 = b.y2 - Utils.endPointY(angleRight, distance)

          this.branches.push(leftBranch, rightBranch)
        }
      })
    }
    if (!this.allFruitComplete) {
      this.fruit.forEach((f) => {
        if (f.progress < 1) {
          f.progress += f.speed

          if (f.progress > 1) f.progress = 1
        }
      })
    }

    if (this.allBranchesComplete && this.allFruitComplete) this.decaying = true
  }
  decay() {
    if (this.fruit.length) {
      // fruit fall
      this.fruit = this.fruit.filter((f) => f.decayTime > 0)

      this.fruit.forEach((f) => {
        if (f.timeUntilFall <= 0) {
          f.y += f.yVelocity
          f.yVelocity += this.gravity

          const bottom = this.floorY - f.r

          if (f.y >= bottom) {
            f.y = bottom
            f.yVelocity *= -f.restitution
          }

          --f.decayTime
        } else if (!f.decaying) {
          --f.timeUntilFall
        }
      })
    }
    if (this.allFruitFalling || !this.fruit.length) {
      // branch decay
      this.branches = this.branches.filter((b) => b.progress > 0)

      this.branches.forEach((b) => {
        if (b.generation === this.lastGeneration) b.progress -= b.decaySpeed
      })
    }
    if (!this.branches.length && !this.fruit.length) {
      // back to the trunk
      this.decaying = false
      this.loopEnd = Utils.dateValue
    }
  }
  init() {
    this.setupCanvas()
    this.setupThemeDetection()
    this.run()
  }
  run() {
    this.draw()

    if (this.decaying) this.decay()
    else this.grow()

    requestAnimationFrame(this.run.bind(this))
  }
  setupCanvas() {
    const { C, c, W, H, S } = this

    // properly scale the canvas based on the pixel ratio
    C.width = W * S
    C.height = H * S
    C.style.width = 'auto'
    C.style.height = '100%'
    c.scale(S, S)

    // set unchanging styles
    c.font = '16px sans-serif'
    c.lineCap = 'round'
    c.lineJoin = 'round'
  }
  setupThemeDetection() {
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      this.detectTheme(mq)
      mq.addListener(this.detectTheme.bind(this))
    }
  }
}

class Utils {
  static get dateValue() {
    return +new Date()
  }
  static endPointX(angleInDeg, distance) {
    return Math.sin((angleInDeg * Math.PI) / 180) * distance
  }
  static endPointY(angleInDeg, distance) {
    return Math.cos((angleInDeg * Math.PI) / 180) * distance
  }
  static randomInt(min, max) {
    return min + Math.round(Math.random() * (max - min))
  }
}

onMounted(() => {
  const tree = new Tree('canvas')
})
// window.addEventListener('DOMContentLoaded', () => {
//   const t = new Tree('canvas')
// })
</script>
<template>
  <div class="page-container">
    <canvas
      role="img"
      aria-label="A tree growing until it bears fruit, dropping its fruit, shrinking, and repeating the cycle"
    ></canvas>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  background: hsl(223deg 10% 90%);
  display: flex;
  height: 100vh;

  * {
    border: 0;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  canvas {
    display: block;
    margin: auto;
    object-fit: contain;
    max-width: 100vw;
    max-height: 100vh;
  }

  // /* Dark theme */
  // @media (prefers-color-scheme: dark) {
  //   body {
  //     background: hsl(223deg 10% 10%);
  //   }
  // }
}
</style>
