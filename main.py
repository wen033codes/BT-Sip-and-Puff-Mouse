def on_button_pressed_a():
    global acttime, act
    acttime = input.running_time()
    act = 1
input.on_button_pressed(Button.A, on_button_pressed_a)

lasttime = 0
count = 0
act = 0
acttime = 0
showtime = 16000
intlimit = 800
cntlimit = 3

def on_forever():
    global count, lasttime, act
    while input.running_time() - acttime <= intlimit:
        if act == 1:
            count += 1
            lasttime = acttime
            act = 0
    if count == 1 and input.running_time() - lasttime >= intlimit:
        basic.show_arrow(ArrowNames.NORTH)
    if count == 2 and input.running_time() - lasttime >= intlimit:
        basic.show_arrow(ArrowNames.SOUTH)
    if count >= cntlimit or input.running_time() - lasttime >= showtime:
        count = 0
        basic.clear_screen()
basic.forever(on_forever)
