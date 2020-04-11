import os
import sys

for line in sys.stdin:
    global pathname
    pathname = line.rstrip()
    break

os.remove(pathname)