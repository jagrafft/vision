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

host = "160.94.183.61"

VIDEOS = {
            'A576': [
                {'name': 'Patient Left','video': 'rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality', 'thumb': './resources/icon.png', 'genre': 'RTSP'},
                {'name': 'Patient Foot','video': 'rtsp://192.168.1.202:554/axis-media/media.amp?profile=Quality', 'thumb': './resources/icon.png', 'genre': 'RTSP'}
            ],
            'A574': [
                {'name': 'Overhead','video': 'rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality', 'thumb': './resources/icon.png', 'genre': 'RTSP'}
            ],
            # 'GST-RTSP (Anesthesia)': [
            #     {'name': 'Beaumont (mp4)','video': 'rtsp://{}:8555/test'.format(host), 'thumb': './resources/icon.png', 'genre': 'RTSP'},
            #     {'name': 'SimMan (mp4)','video': 'rtsp://{}:8556/test'.format(host), 'thumb': './resources/icon.png', 'genre': 'RTSP'},
            #     {'name': 'Traffic (mp4)','video': 'rtsp://{}:8557/test'.format(host), 'thumb': './resources/icon.png', 'genre': 'RTSP'}
            # ],
            # 'DASH (Anesthesia)': [
            #     {'name': '001','video': 'http://{}/dash/mp4/001/manifest.mpd'.format(host), 'thumb': './resources/icon.png', 'genre': 'DASH'},
            #     {'name': '002','video': 'http://{}/dash/mp4/002/manifest.mpd'.format(host), 'thumb': './resources/icon.png', 'genre': 'DASH'}
            # ],
            'HLS (Anesthesia)': [
                {'name': '001','video': 'http://{}/hls/mp4/001/playlist.m3u8'.format(host), 'thumb': './resources/icon.png', 'genre': 'HLS'},
                {'name': '002','video': 'http://{}/hls/mp4/002/playlist.m3u8'.format(host), 'thumb': './resources/icon.png', 'genre': 'HLS'},
                {'name': '003','video': 'http://{}/hls/mp4/003/playlist.m3u8'.format(host), 'thumb': './resources/icon.png', 'genre': 'HLS'}
            ]
        }

def get_url(**kwargs):
    return '{0}?{1}'.format(_url, urlencode(kwargs))

def get_categories():
    return VIDEOS.iterkeys()

def get_videos(category):
    return VIDEOS[category]

def list_categories():
    xbmcplugin.setPluginCategory(_handle, 'vision Recordings')
    xbmcplugin.setContent(_handle, 'videos')
    categories = get_categories()
    
    for category in categories:
        list_item = xbmcgui.ListItem(label=category)
        # list_item.setArt({'thumb': VIDEOS[category][0]['thumb'],
                        #   'icon': VIDEOS[category][0]['thumb'],
                        #   'fanart': VIDEOS[category][0]['thumb']})
        list_item.setInfo('video', {'title': category,
                                    'genre': category,
                                    'mediatype': 'video'})
        url = get_url(action='listing', category=category)
        is_folder = True
        xbmcplugin.addDirectoryItem(_handle, url, list_item, is_folder)
    
    xbmcplugin.addSortMethod(_handle, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.endOfDirectory(_handle)


def list_videos(category):
    xbmcplugin.setPluginCategory(_handle, category)
    xbmcplugin.setContent(_handle, 'videos')
    videos = get_videos(category)
    
    for video in videos:
        list_item = xbmcgui.ListItem(label=video['name'])
        list_item.setInfo('video', {'title': video['name'],
                                    'genre': video['genre'],
                                    'mediatype': 'video'})
        # list_item.setArt({'thumb': video['thumb'], 'icon': video['thumb'], 'fanart': video['thumb']})
        list_item.setProperty('IsPlayable', 'true')
        url = get_url(action='play', video=video['video'])
        is_folder = False
        xbmcplugin.addDirectoryItem(_handle, url, list_item, is_folder)
    
    xbmcplugin.addSortMethod(_handle, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.endOfDirectory(_handle)


def play_video(path):
    play_item = xbmcgui.ListItem(path=path)
    xbmcplugin.setResolvedUrl(_handle, True, listitem=play_item)


def router(paramstring):
    params = dict(parse_qsl(paramstring))

    if params:
        if params['action'] == 'listing':
            list_videos(params['category'])
        elif params['action'] == 'play':
            play_video(params['video'])
        else:
            raise ValueError('Invalid paramstring: {0}!'.format(paramstring))
    else:
        list_categories()


if __name__ == '__main__':
    router(sys.argv[2][1:])