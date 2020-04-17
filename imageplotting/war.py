import os
import random
import sys
import string
import requests
import json
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from io import BytesIO

import config
from shared import randomString


def plotWar(args):
    field_list = args[0]
    name = randomString(15)

    base = Image.open("Assets/15base.png")

    for i in range(len(field_list)):
        for j in range(len(field_list[i])):
            if field_list[i][j] != 0:
                red = Image.open("Assets/redhex.png" if field_list[i][j] == 1 else "Assets/bluehex.png")
                if i % 2 == 0:
                    base.paste(red, (39 + (j * 76), 1 + (i * 132)), mask=red)
                else:
                    base.paste(red, (1 + (j * 76), 67 + (i * 132)), mask=red)

    base.save("./imageplotting/" + name + ".png", "PNG",
              quality=100, optimize=True, progressive=True)

    print(name)


'''
for line in sys.stdin:
    global tempArgsVal
    tempArgsVal = line.rstrip()
    break

argsList = tempArgsVal.split("#")
argsList[0] = json.loads(argsList[0])
'''
s = "[[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]"
argsList = [json.loads(s)]
plotWar(argsList)
