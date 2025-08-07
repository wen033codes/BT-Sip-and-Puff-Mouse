/**
 * 吸氣判定
 */
/**
 * 長吹判定
 */
/**
 * 吐氣時的次數計算
 */
/**
 * 吸氣時的次數計算
 */
/**
 * 開始時間
 */
/**
 * 紀錄時間
 */
/**
 * 壓力數值
 */
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    Sound = 5
    showSound()
})
function resetStatus2 () {
    fornum2 = 0
    PressH = false
    Scroll = 0
    Btm = 0
    BtmP = false
    inhaleTag = false
    music.stopAllSounds()
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    clear(showtime)
})
function showSound () {
    music.setVolume(Sound * 28)
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
    basic.showIcon(IconNames.EighthNote)
    basic.showNumber(Sound)
    clear(1)
}
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    clear(showtime)
})
input.onButtonPressed(Button.A, function () {
    if (Speed < 9) {
        Speed += 1
    } else {
        Speed = 1
    }
    SpeedMem = Speed
    basic.showIcon(IconNames.SmallDiamond)
    basic.showIcon(IconNames.Diamond)
    basic.showNumber(Speed)
    clear(1)
})
function showScroll () {
    basic.showLeds(`
        . . # . .
        . # # # .
        . . # . .
        . # # # .
        . . # . .
        `)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (Sound > 1) {
        Sound += -1
    } else {
        Sound = 9
    }
    showSound()
})
function clear (num: number) {
    basic.pause(num * 100)
    basic.clearScreen()
}
input.onButtonPressed(Button.AB, function () {
    Speed = 2
    SpeedMem = Speed
    delay = 1
    basic.showIcon(IconNames.SmallDiamond)
    basic.showIcon(IconNames.Diamond)
    basic.showNumber(Speed)
    clear(1)
    showScroll()
    basic.showNumber(Scroll)
    clear(1)
})
input.onButtonPressed(Button.B, function () {
    if (delay < 9) {
        delay += 1
    } else {
        delay = 1
    }
    showScroll()
    basic.showNumber(delay)
    clear(1)
})
function scrollFall () {
    if (Scroll != 0 || PressH) {
        if (PressH) {
            PressH = false
        } else {
            Scroll = 0
        }
    } else {
        Speed = 0
        // 修正開機時位於原點上按下click導致後續使用Mouse Scroll無法作用問題
        if (defaultMove) {
            mouse.click()
        }
    }
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
    basic.clearScreen()
}
function resetStatus () {
    fornum = 0
    Speed = 0
    isLongTag = false
    PressH = false
    music.stopAllSounds()
}
let MoveY = 0
let MoveX = 0
let DirY = 0
let DirX = 0
let Cur = 0
let CurP = false
let saveTime = 0
let PaValue = 0
let nowTime = 0
let isLongTag = false
let fornum = 0
let defaultMove = false
let inhaleTag = false
let BtmP = false
let Btm = 0
let Scroll = 0
let PressH = false
let fornum2 = 0
let delay = 0
let SpeedMem = 0
let Speed = 0
let Sound = 0
let showtime = 0
// 判定時間1秒
let defaultTime = 1000
// 用來判斷是否有移動
// 校正時調整defaultMinPaValue或defaultMaxPaValue，校正PaValue至-93
let defaultMinPaValue = -10000093
// 校正時調整defaultMinPaValue或defaultMaxPaValue，校正PaValue至-93
let defaultMaxPaValue = 10000000
let holdNum = 1
mouse.startMouseService()
showtime = 50
Sound = 5
Speed = 5
SpeedMem = Speed
delay = 5
let lastScroll = 1
// 避免Scroll及lastScroll同時為0時重新給1
let basicScroll = 1
music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground)
HX711.SetPIN_SCK(DigitalPin.P2)
HX711.SetPIN_DOUT(DigitalPin.P1)
HX711.begin()
// 檢查偏差值
let offsetPaValue = HX711.read()
// 檢查偏差值
for (let index = 0; index < 2; index++) {
    basic.showLeds(`
        . # . . .
        # # # . #
        . # # . #
        . # # # .
        . # . # .
        `)
    basic.showLeds(`
        . . . . #
        . # . . #
        # # # # .
        . # # # .
        . . # . .
        `)
    basic.showLeds(`
        . # . . .
        # # # . #
        . # # . #
        . # # # .
        # . . . #
        `)
}
clear(showtime)
basic.forever(function () {
    nowTime = input.runningTime()
    PaValue = Math.round(Math.map(HX711.read() - offsetPaValue, defaultMinPaValue, defaultMaxPaValue, -1000, 1000))
    serial.writeString("" + ("now default(Set to -93)：\n"))
    serial.writeNumber(PaValue)
    serial.writeString("" + ("\n"))
    // serial.writeNumber(offsetPaValue)
    serial.writeString("" + ("\n"))
    if (PaValue >= 2000) {
        if (fornum == 0) {
            saveTime = nowTime
            fornum = 1
        }
        if (nowTime - saveTime >= defaultTime) {
            isLongTag = true
            music.play(music.tonePlayable(688, music.beat(BeatFraction.Eighth)), music.PlaybackMode.InBackground)
            basic.pause(500)
        }
        resetStatus2()
    } else if (PaValue > 500 && PaValue <= 1999) {
        if (isLongTag == true && fornum == 2) {
            CurP = false
            Speed = 0
            music.play(music.tonePlayable(988, music.beat(BeatFraction.Eighth)), music.PlaybackMode.InBackground)
            music.setVolume(Sound * 28)
            music.stopAllSounds()
            basic.clearScreen()
            fornum = 0
            isLongTag = false
            basic.pause(1000)
        } else if (isLongTag == false && fornum == 0) {
            if (Cur < 4) {
                Cur += 1
            } else {
                Cur = 1
            }
            music.play(music.tonePlayable(988, music.beat(BeatFraction.Eighth)), music.PlaybackMode.InBackground)
            if (Cur == 1) {
                DirX = 0
                DirY = -1
                basic.showArrow(ArrowNames.North)
            } else if (Cur == 2) {
                DirX = 1
                DirY = 0
                basic.showArrow(ArrowNames.East)
            } else if (Cur == 3) {
                DirX = 0
                DirY = 1
                basic.showArrow(ArrowNames.South)
            } else if (Cur == 4) {
                DirX = -1
                DirY = 0
                basic.showArrow(ArrowNames.West)
            }
            Speed = SpeedMem
        }
        resetStatus2()
    } else if (PaValue <= 500 && PaValue >= -100) {
        if (isLongTag) {
            CurP = true
            Speed = SpeedMem / 2
            music.setVolume(Sound * 28 - 20)
            music.play(music.tonePlayable(688, music.beat(BeatFraction.Eighth)), music.PlaybackMode.LoopingInBackground)
            basic.clearScreen()
            if (fornum == 0) {
                isLongTag = false
            } else if (fornum == 1) {
                fornum = 2
            }
        }
        BtmP = false
        inhaleTag = false
        fornum2 = 0
    } else if (PaValue < -100 && PaValue >= -500) {
        resetStatus()
        inhaleTag = true
        if (fornum2 == 0) {
            saveTime = nowTime
            basic.pause(100)
        }
        if (nowTime - saveTime >= defaultTime) {
            // 進入長吹氣
            fornum2 = 1
            music.play(music.tonePlayable(688, music.beat(BeatFraction.Eighth)), music.PlaybackMode.InBackground)
            basic.pause(500)
            Btm = 0
        } else {
            fornum2 = 2
        }
        if (fornum2 == 1) {
            BtmP = true
        }
    } else if (PaValue < -500) {
        resetStatus()
        inhaleTag = true
        scrollFall()
        basic.pause(1000)
    }
    if (PaValue >= 500 && PaValue < 1999 && isLongTag == false) {
        fornum = 0
    }
    if (PaValue <= 0 && PaValue < -500 && inhaleTag == false) {
        fornum2 = 0
    }
    while (BtmP) {
        Speed = 0
        basic.pause(1000)
        Btm += 1
        if (Btm == 1) {
            music.play(music.tonePlayable(97, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else if (Btm == 2) {
            music.play(music.tonePlayable(131, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else if (Btm == 3) {
            music.play(music.tonePlayable(165, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else if (Btm == 4) {
            music.play(music.tonePlayable(196, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else if (Btm == 5) {
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else if (Btm == 6) {
            music.play(music.tonePlayable(330, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        } else {
            BtmP = false
            basic.clearScreen()
        }
        PaValue = Math.round(Math.map(HX711.read() - offsetPaValue, defaultMinPaValue, defaultMaxPaValue, -1000, 1000))
        if (PaValue >= -100 || PaValue >= 0) {
            if (Btm == 1) {
                Btm += 1
            }
            BtmP = false
            break;
        }
    }
    if (Btm == 2) {
        Scroll = 0
        // 修正開機時位於原點上按下click導致後續使用Mouse Scroll無法作用問題
        if (defaultMove) {
            mouse.click()
        }
        basic.showString("L")
    } else if (Btm == 3) {
        Scroll = 0
        Speed = 3
        DirX = 0
        DirY = holdNum * -1
        holdNum = DirY
        PressH = true
        basic.showString("H")
    } else if (Btm == 4) {
        Scroll = 0
        mouse.rightClick()
        basic.showString("R")
    } else if (Btm == 5) {
        if (Scroll == 0 || lastScroll != 1 && lastScroll != -1) {
            lastScroll = basicScroll
        }
        Scroll = lastScroll * -1
        lastScroll = Scroll
        showScroll()
        serial.writeNumber(Scroll)
    } else if (Btm == 6) {
        Scroll = 0
        mouse.click()
        music.play(music.tonePlayable(523, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
        mouse.click()
        music.play(music.tonePlayable(523, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        basic.showString("D")
    }
    Btm = 0
    MoveX = Speed * DirX
    MoveY = Speed * DirY
    if (PressH) {
        mouse.send(
        MoveX,
        MoveY,
        true,
        false,
        false,
        0,
        true
        )
    } else if (Scroll != 0) {
        mouse.scroll(Scroll)
        basic.pause(delay * 100)
    } else {
        defaultMove = true
        mouse.movexy(MoveX, MoveY)
    }
})
