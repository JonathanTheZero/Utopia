import os
import random
import sys
import string
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw


def randomString(stringLength=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))



#args[0]: Number of personal farms
#args[1]: Amount of population upgrades
#args[2]: Population
#args[3]: Username
def plotImage(args):
    base = Image.open("./imageplotting/level1-backdrop.png")
    base = base.resize((1024, 1024))
    dome_mode = False
    black_bg = False

    name = randomString(15)
    used_positions = []
    args[0] = int(args[0])
    args[1] = int(args[1])
    args[2] = int(args[2])

    if args[0] <= 1:
        farms = Image.open("./imageplotting/level1-farm.png")
        farms = farms.resize((362, 160))  
        base.paste(farms, (80, 360), mask=farms)
        used_positions.append((80, 360))

    elif args[0] <= 2:
        farms = Image.open("./imageplotting/level1-farm.png")
        farms = farms.resize((362, 160))  
        base.paste(farms, (80, 360), mask=farms)
        base.paste(farms, (500, 360), mask=farms)
        used_positions.extend([(80, 360), (500, 360)])

    elif args[0] <= 4:
        base = Image.open("./imageplotting/transition-backdrop.png")
        base = base.resize((1024, 1024))
        farms = Image.open("./imageplotting/level1-farm.png")
        farms = farms.resize((362, 160)) 
        base.paste(farms, (80, 360), mask=farms)
        base.paste(farms, (500, 360), mask=farms)
        base.paste(farms, (80, 520), mask=farms)
        used_positions.extend([(80, 360), (500, 360), (80, 520)])

    else:
        base = Image.open("./imageplotting/level2-backdrop.png")
        base = base.resize((1024, 1024))
        if args[0] <= 5:
            factory = Image.open("./imageplotting/level2-factory.png")
            factory = factory.resize((304, 330))  
            base.paste(factory, (80, 190), mask=factory)
            used_positions.append((80, 190))

        elif args[0] <= 6:
            factory = Image.open("./imageplotting/level2-factory.png")
            farms = Image.open("./imageplotting/level1-farm.png")
            factory = factory.resize((304, 330))  
            farms = farms.resize((362, 160))  
            base.paste(factory, (80, 190), mask=factory)
            base.paste(farms, (500, 360), mask=farms)
            used_positions.extend([(80, 190), (500, 360)])

        elif args[0] <= 7:
            factory = Image.open("./imageplotting/level2-factory.png")
            factory = factory.resize((304, 330)) 
            base.paste(factory, (80, 190), mask=factory)
            base.paste(factory, (390, 190), mask=factory)
            used_positions.extend([(80, 190), (390, 190)])
        
        else:
            black_bg = True
            base = Image.open("./imageplotting/level3-backdrop.png")
            base = base.resize((1024, 1024))
            stars = Image.open("./imageplotting/level3-backdrop-stars.png").resize((1024, 1024))
            base.paste(stars, (0, 0), mask=stars)

            if args[0] <= 8:
                factory = Image.open("./imageplotting/level2-factory.png")
                tower = Image.open("./imageplotting/level3-tower.png")
                factory = factory.resize((304, 330))
                tower = tower.resize((102, 436)) 
                base.paste(factory, (80, 190), mask=factory)
                base.paste(factory, (400, 190), mask=factory)
                base.paste(tower, (500, 150), mask=tower)
                used_positions.extend([(80, 190), (500, 190), (400, 190)])
            
            elif args[0] <= 9:
                factory = Image.open("./imageplotting/level2-factory.png")
                tower = Image.open("./imageplotting/level3-tower.png")
                church = Image.open("./imageplotting/level3-church.png")
                factory = factory.resize((304, 330))
                tower = tower.resize((102, 436)) 
                church = church.resize((185, 182))
                base.paste(factory, (80, 190), mask=factory)
                base.paste(factory, (400, 190), mask=factory)
                base.paste(tower, (500, 150), mask=tower)
                base.paste(church, (600, 400), mask=church)
                used_positions.extend([(80, 190), (500, 190), (400, 190), (600, 400)])

            else:
                dome_mode = True
                base = Image.open("./imageplotting/level4-backdrop.png").resize((1024, 1024))
                stars = Image.open("./imageplotting/level4-backdrop-stars.png").resize((1024, 1024))
                base.paste(stars, (0, 0), mask=stars)

                if args[0] <= 10:
                    dome = Image.open("./imageplotting/lvl1-lvl4.png")
                    dome = dome.resize((307, 393))

                elif args[0] <= 11:
                    dome = Image.open("./imageplotting/lvl2-lvl4.png")
                    dome = dome.resize((307, 393))

                else:
                    dome = Image.open("./imageplotting/lvl3-lvl4.png")
                    dome = dome.resize((307, 389))
                    
                base.paste(dome, (365, 400), mask=dome)
                used_positions.append((330, 400))


    if dome_mode:

        if args[1] <= 2:
            dome = Image.open("./imageplotting/lvl1-lvl4.png")
            dome = dome.resize((307, 393))

        elif args[1] <= 4:
            dome = Image.open("./imageplotting/lvl2-lvl4.png")
            dome = dome.resize((307, 393))

        else:
            dome = Image.open("./imageplotting/lvl3-lvl4.png")
            dome = dome.resize((307, 389))

        base.paste(dome, (640, 200), mask=dome)
        used_positions.append((630, 200))

        if args[2] <= 1000000: #1M
            dome = Image.open("./imageplotting/lvl1-lvl4.png")
            dome = dome.resize((307, 393))
        
        elif args[2] <= 25000000: #25M
            dome = Image.open("./imageplotting/lvl2-lvl4.png")
            dome = dome.resize((307, 393))

        else:
            dome = Image.open("./imageplotting/lvl3-lvl4.png")
            dome = dome.resize((307, 389))

        base.paste(dome, (50, 250), mask=dome)
        used_positions.append((600, 200))

    else:   
        if args[1] <= 2:
            church = Image.open("./imageplotting/level1-church.png")
            church = church.resize((122, 142))  # divided by 10
            if (40, 95) in used_positions:
                base.paste(church, (390, 374), mask=church)
                used_positions.append((390, 374))
            else:
                base.paste(church, (446, 374), mask=church)
                used_positions.append((446, 374))

            if args[1] > 1:
                blacksmith = Image.open("./imageplotting/level1-blacksmith.png")
                blacksmith = blacksmith.resize((172, 160))  # divided by 10
                base.paste(blacksmith, (100, 720), mask=blacksmith)
                used_positions.append((100, 720))

        elif args[1] <= 4:
            office = Image.open("./imageplotting/level2-office.png")
            office = office.resize((394, 321))  # divided by 11

            if (80, 520) in used_positions:
                base.paste(office, (60, 680), mask=office)
                used_positions.append((60, 680))

            else:
                base.paste(office, (60, 530), mask=office)
                used_positions.append((60, 530))

            if args[1] > 3:
                church = Image.open("./imageplotting/level3-church.png")
                church = church.resize((185, 182))
                base.paste(church, (730, 400), mask=church)
                used_positions.append((730, 400))

        else:
            airport = Image.open("./imageplotting/level3-airport.png")
            airport = airport.resize((424, 271))

            if (80, 520) in used_positions:
                base.paste(airport, (30, 700), mask=airport)
                used_positions.append((30, 700))

            else:
                base.paste(airport, (30, 530), mask=airport)
                used_positions.append((30, 530))

            if args[1] > 5:
                tower = Image.open("./imageplotting/level3-tower.png")
                tower = tower.resize((102, 436)) 
                base.paste(tower, (480, 550), mask=tower)
                used_positions.append((480, 550))


        if args[2] <= 100000: #100k
            housebrown = Image.open("./imageplotting/level1-house-brown.png")
            housered = Image.open("./imageplotting/level1-house-red.png")
            housebrown = housebrown.resize((162, 132))
            housered = housered.resize((162, 132))  #scaled to same size
            base.paste(housebrown, (680, 600), mask=housebrown)
            base.paste(housebrown, (860, 600), mask=housebrown)
            used_positions.extend([(680, 600), (860, 600)])

            if args[2] >= 50000: #50k
                base.paste(housered, (680, 740), mask=housered)
                base.paste(housered, (860, 740), mask=housered)
                used_positions.extend([(680, 740), (860, 740)])

        elif args[2] <= 5000000: #5M
            housebrown = Image.open("./imageplotting/level2-apartment-brown.png")
            housered = Image.open("./imageplotting/level2-apartment-red.png")
            housebrown = housebrown.resize((116, 198))
            housered = housered.resize((116, 198))
            base.paste(housebrown, (720, 680), mask=housebrown)
            base.paste(housered, (840, 680), mask=housered)
            used_positions.extend([(720, 680), (840, 680)])

            if args[2] > 1000000: #1M
                church = Image.open("./imageplotting/level2-church.png")
                church = church.resize((197, 267))
                base.paste(housebrown, (710, 820), mask=housebrown)
                base.paste(housered, (830, 820), mask=housered)
                used_positions.extend([(710, 820), (830, 820)])

                if args[2] > 2000000: #2M
                    base.paste(housebrown, (600, 680), mask=housebrown)
                    base.paste(church, (450, 650), mask=church)
                    base.paste(housered, (590, 820), mask=housered)
                    used_positions.extend([(600, 680), (450, 650), (590, 820)])

        else:
            skyscraper = Image.open("./imageplotting/level3-skyscraper.png")
            skyscraper = skyscraper.resize((171, 482))
            base.paste(skyscraper, (720, 380), mask=skyscraper)
            if args[2] > 15000000: #15M
                base.paste(skyscraper, (620, 440), mask=skyscraper)
                if args[2] > 30000000: #30M
                    base.paste(skyscraper, (820, 440), mask=skyscraper)

            
    author_name = args[3] + "'s Utopia"
    draw_text(author_name, base, black_bg)
    base.save("./imageplotting/" + name + ".png", "PNG",
              quality=100, optimize=True, progressive=True)
    print(name)  # return value to node module



def draw_text(author_name, base, black_bg):
    font = ImageFont.truetype("./imageplotting/Vampire-Wars.ttf", 120)

    #adjust font to text
    if font.getsize(author_name)[0] > 840: #nice
        for i in range(0, 120, 4):
            font = ImageFont.truetype("./imageplotting/Vampire-Wars.ttf", 120 - i)
            if font.getsize(author_name)[0] < 842: 
                break

    draw = ImageDraw.Draw(base)
    if black_bg:
        draw.text((50, 30), author_name, fill=(240, 15, 15, 255), font=font)
    else:
        draw.text((50, 30), author_name, fill=(0, 0, 0), font=font)



# args syntax: personal farms amount, population upgrades, total population
# tempArgsVal format: amount#amount, types like above
for line in sys.stdin:
    global tempArgsVal
    tempArgsVal = line.rstrip()
    break

argsList = tempArgsVal.split("#")
plotImage(argsList)