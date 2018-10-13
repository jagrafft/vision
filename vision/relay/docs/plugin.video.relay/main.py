# -*- coding: utf-8 -*-
# Module: default
# Author: jason a. grafft
# Created on: 29.08.2018
# License: GPL v.3 https://www.gnu.org/copyleft/gpl.html

import json
import sys
import urllib
import urllib2
import urlparse
import xbmcgui
import xbmcplugin

_handle = int(sys.argv[1])
host = "160.94.183.29"
port = 14001
    
def get_hls(a, p):
    r = urllib2.urlopen("http://{}:{}".format(a, p)).read()
    return [(x.split("/")[1], x) for x in json.loads(r)]
    
def list_hls(h):
    hls_list = []
    
    for hls in h:
        li = xbmcgui.ListItem(label=hls[0])
        li.setProperty('IsPlayable', 'true')
        hls_list.append(("http://{}/hls/{}".format(host, hls[1]), li, False))

    xbmcplugin.addDirectoryItems(_handle, hls_list, len(hls_list))
    xbmcplugin.addSortMethod(_handle, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.setContent(_handle, 'videos')
    xbmcplugin.endOfDirectory(_handle)
    
def play_hls(url):
    play_item = xbmcgui.ListItem(path=url)
    xbmcplugin.setResolvedUrl(_handle, True, listitem=play_item)
    
def main():
    args = urlparse.parse_qs(sys.argv[2][1:])
    mode = args.get('mode', None)
    
    if mode is None:
        l = get_hls("10.0.1.68", 14001)
        list_hls(l)
    elif mode[0] == 'stream':
        play_hls(args['url'][0])
    
if __name__ == '__main__':
    main()