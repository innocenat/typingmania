#!/usr/bin/env python3

class Song:
    """ Class to handle .json and .lyrics.json file generation """

    def __init__(self):
        self.event = []
        self.info = {}

        self.max_cpm = 0
        self.avg_cpm = 0
        self.avg_cpm_d = 0

    def add_event(self, event):
        if not "start" in event:
            raise ValueError("No start field")
        if not "end" in event:
            raise ValueError("No end field")

        if not "blank" in event and not "lyric" in event:
            raise ValueError("No lyric")

        if "typing" in event and type(event["typing"]) != list:
            event["typing"] = [event["typing"]]

        self.event.append(event)

        if not "blank" in event:
            # Calculate CPM
            (l, cpm) = self.cal_cpm(event)
            self.max_cpm = max(self.max_cpm, cpm)
            self.avg_cpm += cpm*l
            self.avg_cpm_d += l

    def set(self, k, v):
        self.info[k] = v

    def get(self, k):
        return self.info[k]

    def typing_len(self, t):
        import re

        l = len(t)
        for c in t:
            if re.match(r'[A-Za-z0-9\.\'\? ]', c) == None:
                l += 1

        return l

    def cal_cpm(self, event):
        # use lyrics if no typing is set, otherwise use typing
        text = event["lyric"]
        if "typing" in event:
            text = ''.join(str(x) for x in event["typing"])

        # Return tuple
        return (self.typing_len(text), self.typing_len(text)/((event["end"]-event["start"])/(60*1000)))

    def write(self, filename):
        import json
        import os.path

        # prepare metadata
        self.set("avg_cpm", round(self.avg_cpm / self.avg_cpm_d))
        self.set("max_cpm", round(self.max_cpm))
        self.set("lyrics", os.path.basename(filename) + ".lyrics.json")

        # write lyrics
        with open(filename + ".lyrics.json", "w") as fo:
            fo.write(json.dumps(self.event, sort_keys=False, ensure_ascii=True, indent=4, separators=(',', ': ')))
            fo.write("\n")

        # write metadata
        with open(filename + ".json", "w") as fo:
            fo.write(json.dumps(self.info, sort_keys=True, ensure_ascii=True, indent=4, separators=(',', ': ')))
            fo.write("\n")

def load_xml_data(url):
    """ just simple wget function """
    import urllib.request
    req = urllib.request.urlopen(url)
    xmldata = req.read()
    req.close()

    return xmldata

def download_file(url, path):
    import urllib.request
    urllib.request.urlretrieve(url, path)

def parse_xml_lyrics(dat):
    """ parse XML data from TypingMania Odyssey """
    # parse XML
    from xml.etree import ElementTree
    fixed = fix_odyssey_xml(dat)
    data = ElementTree.fromstring(fixed)

    # parse static data
    result = Song()
    count = int(data.find('saidaimondaisuu').text)
    try:
        result.set("image", data.find('background').get("id"))
    except: pass

    # parse lyrics
    s_interval = []
    s_typing = []
    s_nihongo = []

    for d in data.findall('nihongoword'):
        s_nihongo.append(d.text)
    for d in data.findall('word'):
        s_typing.append(d.text)
    for d in data.findall('interval'):
        s_interval.append(int(d.text))
    start = 0

    for i in range(0, min(count, len(s_interval))):
        end = start + s_interval[i]

        v_start = max(0, start-100)
        v_end = max(0, end-100)
        if s_typing[i] != '@':
            result.add_event({
                "start": v_start,
                "end": v_end,
                "lyric": s_nihongo[i],
                "typing": s_typing[i]
            })
        else:
            result.add_event({
                "start": v_start,
                "end": v_end,
                "blank": True
            })
        start = end

    return result

def fix_odyssey_xml(xml):
    import re

    xml = xml.decode("utf-8")

    if re.search("musicXML", xml) == None:
        xml = re.sub('<\?.+?\?>', '', xml)
        xml = "<musicXML>" + xml + "</musicXML>"

    return xml

def convert_odyssey_folder(url, target):
    """ parse odyssey folder XML format """
    from xml.etree import ElementTree
    import os.path
    import json
    import re

    base_path = os.path.split(url)[0] + "/"

    folder_data = load_xml_data(url)
    folder_data = re.sub('<\?.+?\?>', '', folder_data.decode('utf-8'))
    folder_data = folder_data.replace('&', '&amp;')
    folder_xml = ElementTree.fromstring(folder_data)

    song_list = []

    for item in folder_xml.findall("musicinfo"):
        try:
            print("Parsed: " + item.get('xmlpath'))
            # Lyrics
            lyrics_url = item.get("xmlpath")
            song = parse_xml_lyrics(load_xml_data(base_path + lyrics_url))

            song_id = os.path.splitext(os.path.basename(item.get("xmlpath")))[0]

            # Download song & background image
            if "image" in song.info:
                print(" ==> Downloading background image")
                img_file = os.path.basename(song.get('image'))
                download_file(base_path + song.get('image'), target + "/" + img_file)
                song.set('image', img_file)

            if item.get("musicpath").lower() != "none":
                print(" ==> Downloading song file")
                mp3_file = os.path.basename(item.get("musicpath"))
                mp3_file = os.path.splitext(mp3_file)[0] + ".mp3"
                download_file(base_path + item.get("musicpath"), target + "/" + mp3_file)
                song.set('file', mp3_file)
                song_list.append("songs/" + target + "/" + song_id + ".json")
            else:
                print(" ==> This song is video-only; not adding to list")
                song.set('file', 'none')

            # metadata
            song.set('title', item.find('musicname').text)
            song.set('composer', item.find('artist').text)
            song.set('subtitle', item.find('genre').text)
            song.set('level', item.find('level').text)

            # id
            song.set('id', '__odyssey_imported__f_' + target + "__i_" + song_id)

            # save
            song.write(target + "/" + song_id)
        except:
            print("Error: cannot parse " + item.get('xmlpath'))
            raise

    with open(target + "/" + "_index.json", "w") as fo:
        fo.write(json.dumps({ "file": song_list }, sort_keys=False, ensure_ascii=True, indent=4, separators=(',', ': ')))

    print("Song list saved!")

def main(args):
    if len(args) < 3:
        print("Usage: %s http://path/do/folder.xml local_folder" % args[0])
    else:
        convert_odyssey_folder(args[1], args[2])

if __name__ == '__main__':
    from sys import argv
    main(argv)
