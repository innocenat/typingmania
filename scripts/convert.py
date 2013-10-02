#!/usr/bin/env python3
"""
convert.py - part of MameType Engine
------------------------------------

Usage: convert.py input.ass

The script convert an ASS (subtitle format) file to a JSON file recognised by
MameType engine.

The input ASS file should have versed timed to audio file, and for each verse
has two lines: ??? (idk)

"""

def main(args):
	import os, os.path

	print("MameType Song Conversion Tool")

	if len(args) < 1:
		print("Error: no input file")
		return False

	inputfile = args[0];
	outputfile = os.path.splitext(inputfile)[0] + ".json"

	# This is so assuming, but it should be okay
	key = os.path.basename(os.path.splitext(inputfile)[0])

	print()
	print("Input:  " + inputfile)
	print("Output: " + outputfile)

	try:
		with open(inputfile, "r", encoding="UTF-8") as fi:
			try:
				with open(outputfile, "w", encoding="UTF-8") as fo:
					convert(fi, fo, key);
			except IOError:
				print("Error: cannot open output file for writing!")
	except IOError:
		print("Error: cannot open input file for reading!")

def convert(fi, fo, key):
	from re import compile
	import json

	regexp = compile(r"(Dialogue|Comment):[^,]+,(?P<start>[^,]+),(?P<end>[^,]+),[^,]+,(?P<type>[A-Za-z0-9\-]+),[^,]+,[^,]+,[^,]+,[^,]*,(?P<data>.+)")

	output = {
		"event": [],
		"key": key,
		"file": key + ".mp3"
	}

	# TODO calculate level

	for line in fi:
		match = regexp.match(line)
		if match != None:
			dtype = match.group("type")
			start = match.group("start")
			end   = match.group("end")
			data  = match.group("data")
			if dtype == "lyrics":
				output["event"].append({
					"start":  toMillisec(start),
					"end":    toMillisec(end),
					"lyric":  data
				})
			elif dtype == "typing":
				for i in range(0, len(output["event"])):
					if output["event"][i]["start"] == toMillisec(start) and output["event"][i]["end"] == toMillisec(end):
						output["event"][i]["typing"] = parse_typing(data)
						break
			else:
				output[dtype] = data

	fo.write(json.dumps(output, sort_keys=False, ensure_ascii=False, indent=4, separators=(',', ': ')))
	fo.write("\n")

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
