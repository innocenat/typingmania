#!/usr/bin/env python3
"""
convert.py - part of TypingMania Engine
------------------------------------

Usage: convert.py input.ass

The script convert an ASS (subtitle format) file to a JSON file recognised by
TypingMania Engine

"""

def main(args):
    import os, os.path

    print("MameType Song Conversion Tool")

    if len(args) < 1:
        print("Error: no input file")
        return False

    inputfile = args[0];
    outputfile = os.path.splitext(inputfile)[0] + ".json"
    outputfile2 = os.path.splitext(inputfile)[0] + ".lyrics.json"

    # This is so assuming, but it should be okay
    key = os.path.basename(os.path.splitext(inputfile)[0])

    print()
    print("Input:  " + inputfile)
    print("Output: " + outputfile)

    try:
        with open(inputfile, "r", encoding="UTF-8") as fi:
            try:
                with open(outputfile, "w", encoding="UTF-8") as fo:
                    try:
                        with open(outputfile2, "w", encoding="UTF-8") as fo2:
                            convert(fi, fo, fo2, key);
                    except IOError:
                        print("Error: cannot open output file for writing!")
            except IOError:
                print("Error: cannot open output file for writing!")
    except IOError:
        print("Error: cannot open input file for reading!")

def convert(fi, fo, fo2, key):
    from re import compile
    import json

    regexp = compile(r"(Dialogue|Comment):[^,]+,(?P<start>[^,]+),(?P<end>[^,]+),[^,]+,(?P<type>[A-Za-z0-9\-]+),[^,]+,[^,]+,[^,]+,[^,]*,(?P<data>.+)")

    output = {
        "id": key,
        "file": key + ".mp3",
        "lyrics": key + ".lyrics.json",
        "image": key + ".jpg"
    }

    event = []
    lyrics = []
    typing = []

    maxCPM = 0;
    avgCPMn = 0;
    avgCPMd = 0;

    for line in fi:
        match = regexp.match(line)
        if match != None:
            dtype = match.group("type")
            start = match.group("start")
            end   = match.group("end")
            data  = match.group("data")
            if dtype == "lyrics":
                lyrics.append({
                    "start":  toMillisec(start)-100,
                    "end":    toMillisec(end)-100,
                    "lyric":  data
                })
            elif dtype == "typing":
                typing.append({
                    "start":  toMillisec(start)-100,
                    "end":    toMillisec(end)-100,
                    "typing":  data
                })
            else:
                output[dtype] = data

    # Process event data
    lyrics.sort(key=lambda s: s["start"])
    typing.sort(key=lambda s: s["start"])

    lasttime = 0;
    for lyric in lyrics:
        # Add blank interval
        if lyric["start"] != lasttime:
            event.append({
                "start": lasttime,
                "end": lyric["start"],
                "blank": True
            })

        # Basic data
        data = {
            "start": lyric["start"],
            "end": lyric["end"],
            "lyric": lyric["lyric"]
        }

        ctyping = False
        for typ in typing:
            if typ["start"] == lyric["start"] and typ["end"] == lyric["end"]:
                ctyping = typ
                break

        if ctyping != False:
            data["typing"] = parse_typing(ctyping["typing"])

        lasttime = lyric["end"]

        # level calculation
        text = data["lyric"]
        if ctyping != False:
            text = ', '.join(str(x) for x in data["typing"])

        l = len(text)
        import re

        for c in text:
            if re.match(r'[A-Za-z0-9\.\'\? ]', c) == None:
                l += 1

        cpm = (l)/((lyric["end"]-lyric["start"])/(60*1000))
        #data["cpm"] = round(cpm)

        maxCPM = max(cpm, maxCPM)
        avgCPMn += cpm*l
        avgCPMd += l

        # append data
        event.append(data)

    output["max_cpm"] = round(maxCPM)
    output["avg_cpm"] = round(avgCPMn/avgCPMd)

    fo.write(json.dumps(output, sort_keys=True, ensure_ascii=True, indent=4, separators=(',', ': ')))
    fo.write("\n")
    fo2.write(json.dumps(event, sort_keys=False, ensure_ascii=True, indent=4, separators=(',', ': ')))
    fo2.write("\n")

def toMillisec(time):
    import re
    match = re.match(r"([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)", time)
    if match == None:
        return 0
    hour = int(match.group(1))*60*60*1000
    mint = int(match.group(2))*60*1000
    secd = int(match.group(3))*1000
    csec = int(match.group(4))*10

    return hour+mint+secd+csec

def parse_typing(line):
    import re
    words = re.split(r"\{\\k[0-9]+\}", line)
    ret = []
    for word in words:
        if len(word.strip()):
            ret.append(word.strip())
    return ret

if __name__ == '__main__':
    from sys import argv
    main(argv[1:])
