# -*- coding: utf-8 -*-
# Module: default
# Author: jason a. grafft
# Created: 30 April 2018
# License: GPL v.3 https://www.gnu.org/copyleft/gpl.html

import sys
from urllib import urlencode
from urlparse import parse_qsl
import xbmcgui
import xbmcplugin

_url = sys.argv[0]
_handle = int(sys.argv[1])

FEEDS = {
            'A576': [
                {'name': 'Patient Left','addr': 'rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality'},
                {'name': 'Patient Foot','addr': 'rtsp://192.168.1.202:554/axis-media/media.amp?profile=Quality'}
            ],
            'A574': [
                {'name': 'Overhead','addr': 'rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality'}
            ],
            'Anesthesia Server': [
                {'name': 'Beaumont (mp4)','addr': 'rtsp://160.94.183.61:8555/test'},
                {'name': 'SimMan (mp4)','addr': 'rtsp://160.94.183.61:8556/test'},
                {'name': 'Traffic (mp4)','addr': 'rtsp://160.94.183.61:8557/test'}
            ]
        }

def get_url(**kwargs):
    return '{0}?{1}'.format(_url, urlencode(kwargs))

def get_categories():
    return FEEDS.iterkeys()

def get_feeds(category):
    return FEEDS[category]

def list_categories():
    xbmcplugin.setPluginCategory(_handle, 'Overhead Cameras')
    xbmcplugin.setContent(_handle, 'feeds')
    categories = get_categories()

    for category in categories:
        item = xbmcgui.ListItem(label=category)
        item.setInfo('feed', {'title': category, 'mediatype': 'video'})
        url = get_url(action='listing', category=category)
        is_folder = True
        xbmcplugin.addDirectoryItem(_handle, url, item, is_folder)
    
    xbmcplugin.addSortMethod(_handle, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.endOfDirectory(_handle)

def list_feeds(category):
    xbmcplugin.setPluginCategory(_handle, category)
    xbmcplugin.setContent(_handle, 'feeds')
    feeds = get_feeds(category)

    for feed in feeds:
        item = xbmcgui.ListItem(label=feed['name'])
        item.setInfo('feed', {'title': feed['name'], 'mediatype': 'video'})
        item.setProperty('IsPlayable', 'true')
        url = get_url(action='play', video=feed['addr'])
        is_folder = False
        xbmcplugin.addDirectoryItem(_handle, url, item, is_folder)
    
    xbmcplugin.addSortMethod(_handle, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.endOfDirectory(_handle)

def play_feed(path):
    item = xbmcgui.ListItem(path=path)
    xbmcplugin.setResolvedUrl(_handle, True, listitem=item)

def router(paramstr):
    params = dict(parse_qsl(paramstr))

    if params:
        if params['action'] == 'listing':
            list_feeds(params['category'])
        elif params['action'] == 'play':
            play_feed(params['video'])
        else:
            raise ValueError('paramstr invalid: {0}'.format(paramstr))
    else:
        list_categories()

if __name__ == '__main__':
    router(sys.argv[2][1:])