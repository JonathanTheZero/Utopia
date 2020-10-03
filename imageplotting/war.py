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

    base = Image.open(BytesIO(requests.get(config.BASE_WAR).content))

    for i in range(len(field_list)):
        for j in range(len(field_list[i])):
            if isinstance(field_list[i][j], str):
                a = field_list[i][j].split("#")
                if a[0] == "1":
                    if a[1] == "0":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_RED1).content))
                    if a[1] == "1":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_RED2).content))
                    if a[1] == "2":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_RED3).content))
                elif a[0] == "2":
                    if a[1] == "0":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_BLUE1).content))
                    if a[1] == "1":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_BLUE2).content))
                    if a[1] == "2":
                        hexa = Image.open(
                            BytesIO(requests.get(config.HEX_BLUE3).content))

                if int(i) % 2 == 0:
                    base.paste(hexa, (39 + (j * 76), 1 +
                                      (i * 67) - i), mask=hexa)
                else:
                    base.paste(hexa, (1 + (j * 76), 1 +
                                      (i * 67) - i), mask=hexa)

    base.save(name + ".png", "PNG",
              quality=100, optimize=True, progressive=True)

    print(name)


for line in sys.stdin:
    global tempArgsVal
    tempArgsVal = line.rstrip()
    break

argsList = [json.loads(tempArgsVal)]

plotWar(argsList)
