# Wars

Each round a random bonus or malus for some troops is generated (like "Snowfall - Infantry moves 20% slower") and the system is move based.
After each round the bot will send an image showing the current state of the battle.
The Main goal is not to defeat the enemies army but to conquer his base (although without an army there will be nobody to defend the base)

## Movement

At the beggining of the battle, the players will divide their troops into several armies, which can be moved using a command like `.move army1 c1 e6` etc. Each army can either be moved or attack the enemies army each round. 
Additionally the players can keep a limited amount of troops (10% maybe?) as a defense line and place them whereever they want (in their half of the field) at the beginning of the game. However those can't be moved during the war.

Defeated armies won't necessarily die (the user keeps ~70% of resources and population, not everything will be lost) but they won't be able to fight anymore during this war *(or maybe for the next two rounds? feedback needed)*

## Maps:

5 or so maps, one is randomly chosen at the beginning of each battle.
The maps will be pretty big = at least several hundred fields.

## 5 types of troops:

* Tanks: lots of steel (and money), small population cost, costs oil each round => advantage over infantry
* Jets: a bit less steel but even and money ,small population cost, more oil each round => advantage over infantry and ships
* Infantry: very low steel, low money, higher population costs, food each round
* ~~Ships: high steel costs, high money costs, (almost) no population costs, oil each round, can transport troop (aka speed up movement, only overseas)~~
* Artillery: medium steel, pop and money, good in defense against tanks and jets, not so goood when attacking so those should be kept close to the home base as a last defense line.
